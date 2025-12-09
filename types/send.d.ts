import type { post } from "./api_client.d.ts"
import type { PostageType } from "./enum.d.ts"

interface Template {
  id: string,
  version: number,
  uri: string
}

export declare function sendEmail(
  templateId: string,
  emailAddress: string,
  options: {
    personalisation?: Object,
    reference?: string,
    emailReplyToId?: string,
    oneClickUnsubscribeURL?: string,
  }
): ReturnType<typeof post<{
  id: string,
  reference?: string,
  content: {
    subject: string,
    body: string,
    from_email: string,
    one_click_unsubscribe_url: string,
  },
  uri: string,
  template: Template
}>>

export declare function sendSms(
  templateId: string,
  phoneNumber: string,
  options: {
    personalisation?: Object,
    reference?: string,
    smsSendId?: string,
  }
): ReturnType<typeof post<{
  id: string,
  reference?: string,
  content: {
    body: string,
    from_number: string
  },
  uri: string,
  template: Template
}>>

export declare function sendLetter(
  templateId: string,
  options: {
    personalisation?: Object,
    reference?: string
  }
): ReturnType<typeof post<{
  id: string,
  reference?: string,
  content: {
    subject: string,
    body: string
  },
  uri: string,
  template: Template,
  scheduled_for: string | null
}>>

export declare function sendPrecompiledLetter(
  reference: string,
  pdf_file: Buffer<ArrayBuffer>,
  postage?: PostageType | undefined,
): ReturnType<typeof post<{
  id: string,
  reference: string,
  postage: PostageType
}>>

export declare function prepareUpload(
  fileData: Buffer<ArrayBuffer>,
  options?: {
    filename?: string
    confirmEmailBeforeDownload?: boolean
    retentionPeriod?: string
  }
): {
  file: string;
  filename?: string;
  confirm_email_before_download?: boolean;
  retention_period?: boolean;
}
