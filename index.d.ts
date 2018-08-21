export type TemplateType = 'all' | 'email' | 'sms' | 'letter';

export interface Notification {
  readonly id: string;
  readonly body: string;
  readonly subject: string;
  readonly reference: string;
  readonly email_address: string;
  readonly phone_number: string;
  readonly line_1: string;
  readonly line_2: string;
  readonly line_3: string;
  readonly line_4: string;
  readonly line_5: string;
  readonly line_6: string;
  readonly postcode: string;
  readonly type: TemplateType;
  readonly status: string;
  readonly template: {
      readonly version: number;
      readonly id: number;
      readonly uri: string;
   },
  readonly created_at: string;
  readonly sent_at: string;
}

export interface Template {
  readonly id: string;
  readonly type: TemplateType;
  readonly created_at: string;
  readonly updated_at: string;
  readonly version: number;
  readonly created_by: string;
  readonly body: string;
  readonly subject: string | null;
}

export interface ItterableResponse {
  readonly links: {
    readonly current: string;
    readonly previous: string;
    readonly next: string;
  };
}

export interface NotificationsResponse extends ItterableResponse {
  readonly notifications: ReadonlyArray<Notification>;
}

export interface TemplatesResponse extends ItterableResponse {
  readonly templates: ReadonlyArray<Template>;
}

export interface ReceivedTextMessages extends ItterableResponse {
  readonly received_text_messages: ReadonlyArray<{
    readonly id: string;
    readonly user_number: string;
    readonly notify_number: string;
    readonly created_at: string;
    readonly service_id: string;
    readonly content: string;
  }>;
}

export interface ErrorResponse {
  readonly error: string;
  readonly message: string;
}

interface GeneralResponse {
  readonly id: string;
  readonly reference: string | null;
  readonly content: {
      readonly body: string;
  };
  readonly uri: string;
  readonly template: {
      readonly id: string;
      readonly version: number;
      readonly uri: string;
  };
}

export interface EmailResponse extends GeneralResponse {
  readonly content: {
    readonly body: string;
    readonly from_email: string;
    readonly subject: string;
  };
}

export interface SmsResponse extends GeneralResponse {
  readonly content: {
    readonly body: string;
    readonly from_number: string;
  };
}

export interface LetterResponse extends GeneralResponse {
  readonly content: {
    readonly body: string;
    readonly subject: string;
  };
  readonly scheduled_for: string | null;
}

export interface RequestOptions {
  personalisation?: object,
  reference?: string,
  emailReplyToId?: string,
}

export interface RequestLetterOptions extends RequestOptions {
  personalisation: {
    readonly address_line_1: string;
    readonly address_line_2: string;
    readonly postcode: string;
    readonly application_id: string;
    readonly application_date: string;

    readonly [option: string]: string;
  },
}

export class NotifyClient {
  constructor(apiKey: string);
  sendEmail(templateID: string, email: string, options?: RequestOptions): Promise<EmailResponse>;
  sendSms(templateID: string, phoneNumber: string, options?: RequestOptions): Promise<SmsResponse>;
  sendLetter(templateID: string, options: RequestLetterOptions): Promise<LetterResponse>;
  getNotificationById(notificationID: string): Promise<Notification>;
  getNotifications(templateType?: TemplateType, status?: string, reference?: string, olderThanID?: string): Promise<NotificationsResponse>;
  getTemplateById(templateID: string): Promise<Template>;
  getTemplateByIdAndVersion(templateID: string, version: number): Promise<Template>;
  getAllTemplates(templateType: TemplateType): Promise<TemplatesResponse>;
  previewTemplateById(templateID: string, personalisation: object): Promise<Template>;
  getReceivedTexts(olderThan: string): Promise<ReceivedTextMessages>;
  setProxy(url: string): void;
}
