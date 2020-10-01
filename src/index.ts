import axios, { AxiosError, AxiosProxyConfig, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import jwt from 'jsonwebtoken';

import version from './version.json';

const DEFAULT_API_ENDPOINT = 'https://api.notifications.service.gov.uk';
const DEFAULT_TIMEOUT = 30000;

type NotificationType = 'email' | 'sms' | 'letter';

export type RequestOptions = {
  readonly emailReplyToID?: string;
  readonly personalisation?: object;
  readonly reference?: string;
  readonly smsSenderID?: string;
};

export namespace Payload {
  type Base = {
    readonly personalisation?: object;
    readonly reference?: string;
    readonly template_id: string;
  };

  export type Email = Base & {
    readonly email_address: string;
    readonly email_reply_to_id?: string;
  };

  export type SMS = Base & {
    readonly phone_number: string;
    readonly sms_sender_id?: string;
  };

  export type Letter = Base;
}

export namespace Response {
  type Base = {
    readonly content: object;
    readonly id: string;
    readonly reference: string | null;
    readonly uri: string;
    readonly template: {
      readonly id: string;
      readonly version: number;
      readonly uri: string;
    };
    readonly scheduled_for?: string | null;
  };

  type Links = {
    readonly current: string;
    readonly next?: string;
    readonly previous?: string;
  };

  export type Error = readonly {
    readonly error: string;
    readonly message: string;
  }[];

  export type SMS = Base & {
    readonly content: {
      readonly body: string;
      readonly from_number: string;
    };
  };

  export type Letter = Base & {
    readonly content: {
      readonly body: string;
      readonly subject: string;
    };
  };

  export type Email = Base & {
    readonly content: {
      readonly body: string;
      readonly from_email: string;
      readonly subject: string;
    };
  }

  export type PrecompiledLetter = {
    readonly id: string;
    readonly postage: string;
    readonly reference: string;
  };

  export type Notification = {
    readonly body: string;
    readonly created_at: string;
    readonly created_by_name: string;
    readonly email_address?: string;
    readonly id: string;
    readonly line_1?: string;
    readonly line_2?: string;
    readonly line_3?: string;
    readonly line_4?: string;
    readonly line_5?: string;
    readonly line_6?: string;
    readonly line_7?: string;
    readonly phone_number?: string;
    readonly postage?: string;
    readonly reference: string;
    readonly sent_at: string;
    readonly status: string;
    readonly subject: string | null;
    readonly template: {
      readonly version: number;
      readonly id: number;
      readonly uri: string;
    };
    readonly type: NotificationType;
  };

  export type Notifications = {
    readonly links: Links;
    readonly notifications: readonly Notification[];
  };

  export type Template = {
    readonly body: string;
    readonly created_at: string;
    readonly created_by: string;
    readonly id: string;
    readonly letter_contact_block: string | null;
    readonly name: string;
    readonly subject: string | null;
    readonly type: NotificationType;
    readonly updated_at: string;
    readonly version: string;
  };

  export type Templates = {
    readonly templates: readonly Template[];
  };

  export type PreviewTemplate = {
    readonly body: string;
    readonly html: string;
    readonly id: string;
    readonly subject: string | null;
    readonly type: NotificationType
    readonly version: string;
  };

  export type ReceivedTextMessages = {
    readonly links: Links;
    readonly received_text_messages: readonly {
      readonly content: string;
      readonly created_at: string;
      readonly id: string;
      readonly notify_number: string;
      readonly service_id: string;
      readonly user_number: string;
    }[];
  };
}

export type PreparedUpload = { readonly file: string, readonly is_csv: boolean };

export type ProxyConfiguration = AxiosProxyConfig;

export type NotifyClientConfiguration = {
  readonly apiEndpoint?: string;
  readonly apiKeyID: string;
  readonly proxy?: ProxyConfiguration;
  readonly serviceID: string;
};

export class NotifyError extends Error {
  public readonly code: number;
  public readonly status: string;

  constructor(code: number, response: Response.Error) {
    super(`${response[0].error}: ${response[0].message}`);

    this.code = code;
    this.status = response[0].error;
  }
}

export class NotifyClient {
  private readonly apiEndpoint: string;
  private readonly apiKeyID: string;
  private readonly proxy?: ProxyConfiguration;
  private readonly serviceID: string;

  constructor(config: NotifyClientConfiguration) {
    this.apiEndpoint = config.apiEndpoint || DEFAULT_API_ENDPOINT;
    this.apiKeyID = config.apiKeyID;
    this.proxy = config.proxy;
    this.serviceID = config.serviceID;
  }

  async sendEmail(templateID: string, emailAddress: string, options: RequestOptions = {}): Promise<Response.Email> {
    checkOptionsKeys(['personalisation', 'reference', 'emailReplyToID'], options);

    const data: Payload.Email = {
      email_address: emailAddress,
      email_reply_to_id: options.emailReplyToID,
      personalisation: options.personalisation,
      reference: options.reference,
      template_id: templateID,
    };

    const response = await this.request<Response.Email>('post', '/v2/notifications/email', { data });

    return response.data;
  }

  async sendSMS(templateID: string, phoneNumber: string, options: RequestOptions = {}): Promise<Response.SMS> {
    checkOptionsKeys(['personalisation', 'reference', 'smsSenderID'], options);

    const data: Payload.SMS = {
      personalisation: options.personalisation,
      phone_number: phoneNumber,
      reference: options.reference,
      sms_sender_id: options.smsSenderID,
      template_id: templateID,
    };

    const response = await this.request<Response.SMS>('post', '/v2/notifications/sms', { data });

    return response.data;
  }

  async sendLetter(templateID: string, options: RequestOptions = {}): Promise<Response.Letter> {
    checkOptionsKeys(['personalisation', 'reference'], options);

    const data: Payload.Letter = {
      personalisation: options.personalisation,
      reference: options.reference,
      template_id: templateID,
    };

    const response = await this.request<Response.Letter>('post', '/v2/notifications/letter', { data });

    return response.data;
  }

  async sendPrecompiledLetter(reference: string, file: Buffer, postage?: string): Promise<Response.PrecompiledLetter> {
    const content = checkAndEncodeFile(file, 5);
    const data = { content, postage, reference };
    const response = await this.request<Response.PrecompiledLetter>('post', '/v2/notifications/letter', { data });

    return response.data;
  }

  async getNotificationByID(notificationID: string): Promise<Response.Notification> {
    const response = await this.request<Response.Notification>('get', `/v2/notifications/${notificationID}`);

    return response.data;
  }

  async getNotifications(
    type?: NotificationType,
    status?: string,
    reference?: string,
    olderThanID?: string,
  ): Promise<Response.Notifications> {
    const response = await this.request<Response.Notifications>('get', '/v2/notifications', {
      params: {
        older_than: olderThanID,
        reference,
        status,
        template_type: type,
      },
    });

    return response.data;
  }

  async getPDFForLetterNotification(notificationID: string): Promise<Buffer> {
    const response = await this.request<string>('get', `/v2/notifications/${notificationID}/pdf`);

    return Buffer.from(response.data, 'base64');
  }

  async getTemplateByID(templateID: string): Promise<Response.Template> {
    const response = await this.request<Response.Template>('get', `/v2/template/${templateID}`);

    return response.data;
  }

  async getTemplateByIDAndVersion(templateID: string, version: string): Promise<Response.Template> {
    const response = await this.request<Response.Template>('get', `/v2/template/${templateID}/version/${version}`);

    return response.data;
  }

  async getAllTemplates(type?: NotificationType): Promise<Response.Templates> {
    const response = await this.request<Response.Templates>('get', '/v2/templates', {
      params: { type },
    });

    return response.data;
  }

  async previewTemplateByID(templateID: string, personalisation?: object): Promise<Response.PreviewTemplate> {
    const response = await this.request<Response.PreviewTemplate>('post', `/v2/template/${templateID}/preview`, {
      data: { personalisation },
    });

    return response.data;
  }

  async getReceivedTexts(olderThan?: string): Promise<Response.ReceivedTextMessages> {
    const response = await this.request<Response.ReceivedTextMessages>('get', '/v2/received-text-messages', {
      params: { older_than: olderThan },
    });

    return response.data;
  }

  prepareUpload(fileData: Buffer, isCSV?: boolean): PreparedUpload {
    return {
      file: checkAndEncodeFile(fileData, 2),
      is_csv: !!isCSV,
    };
  }

  private get token(): string {
    return jwt.sign(
      {
        iat: Math.round(Date.now() / 1000),
        iss: this.serviceID,
      },
      this.apiKeyID,
      {
        header: { alg: 'HS256', typ: 'JWT' },
      },
    );
  }

  private async request<T>(method: Method, url: string, opts?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    try {
      const response = await axios.request({
        baseURL: this.apiEndpoint,
        headers: {
          Authorization: `Bearer ${this.token}`,
          'User-Agent': `NOTIFY-API-NODE-CLIENT/${version}`,
        },
        method,
        proxy: this.proxy,
        timeout: DEFAULT_TIMEOUT,
        url,

        ...opts,
      });

      return response;
    } catch (err) {
      const { name, message, response } = err as AxiosError<Response.Error>;

      throw new NotifyError(
        response?.status || 500,
        response?.data || [{ error: name, message }],
      );
    }
  }
}

function checkOptionsKeys(allowedKeys: readonly string[], options: object): void {
  const invalidKeys = Object.keys(options).filter(key => !allowedKeys.includes(key));

  if (invalidKeys.length > 0) {
    throw new Error(`NotifyClient now uses an options configuration object. Options ${JSON.stringify(invalidKeys)} not
      recognised. Please refer to the README.md for more information on method signatures.`);
  }
}

function checkAndEncodeFile(file: Buffer, sizeLimit: number): string {
  if (file.length > sizeLimit * 1024 * 1024) {
    throw new Error(`File is larger than ${sizeLimit}MB.`);
  }

  return file.toString('base64');
}
