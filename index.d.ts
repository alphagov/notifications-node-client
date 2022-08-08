type ProxyConfig = {
  host: string;
  port: number;
};

type SendEmailOptions<PersonalisationFields extends Record<string, any>> = {
  personalisation: PersonalisationFields;
  reference: string;
  emailReplyToId?: string;
};

type SendEmailResponse = {
  content: {
    body: string;
    from_email: string;
    subject: string;
  };
  id: string;
  reference: string | null;
  scheduled_for: string | null;
  template: {
    id: string;
    uri: string;
    version: number;
  };
  uri: string;
};

type GetNotificationByIdResponse = {
  body: string;
  completed_at: string;
  created_at: string;
  created_by_name: string | null;
  email_address: string;
  id: string;
  line_1: string | null;
  line_2: string | null;
  line_3: string | null;
  line_4: string | null;
  line_5: string | null;
  line_6: string | null;
  phone_number: null;
  postage: null;
  postcode: null;
  reference: null;
  scheduled_for: null;
  sent_at: string;
  status:
    | "created"
    | "sending"
    | "delivered"
    | "permanent-failure"
    | "temporary-failure"
    | "technical-failure";
  subject: string;
  template: {
    id: string;
    uri: string;
    version: number;
  };
  type: "email";
};

type GetNotificationsResponse = {
  notifications: [GetNotificationByIdResponse];
};

export type PreparedUpload = {
  file: string;
  is_csv: boolean;
};

export class NotifyClient {
  constructor(apiKey: string);

  setProxy: (config: ProxyConfig) => void;

  sendEmail: <PersonalisationFields extends Record<string, any>>(
    templateId: string,
    emailAddress: string,
    options: SendEmailOptions<PersonalisationFields>
  ) => Promise<{ status: number; data: SendEmailResponse }>;

  getNotificationById: (
    notificationId: string
  ) => Promise<{ status: number; data: GetNotificationByIdResponse }>;

  getNotifications: () => Promise<{
    status: number;
    data: GetNotificationsResponse;
  }>;

  prepareUpload: (fileData: Buffer, isCsv: boolean) => PreparedUpload;
}
