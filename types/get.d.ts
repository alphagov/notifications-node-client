import type { get } from "./api_client.d.ts"

import type {
  Notification,
  EmailResponse,
  TextResponse,
  LetterResponse,
  TextMessage,
  TemplateData
} from "./interfaces.d.ts"

import type {
  PostageType,
  NotificationType,
} from "./enum.d.ts"

export declare function getNotificationById(
  notificationId: string,
): ReturnType<typeof get<
  Notification &
  (EmailResponse |
    TextResponse |
    LetterResponse) >>

export declare function getNotifications(
  templateType?: string,
  status?: string,
  reference?: string,
  olderThanId?: string,
): ReturnType<typeof get<
  {
    notifications: Notification[],
    links: {
      current: string,
      next: string
    }[]
  }
>>

export declare function getPdfForLetterNotification(
  notificationId: string,
): ReturnType<typeof get<ArrayBuffer>>

export declare function getTemplateById(
  templateId: string,
): ReturnType<typeof get<TemplateData>>

export declare function getTemplateByIdAndVersion(
  templateId: string,
  version: number
): ReturnType<typeof get<TemplateData>>

export declare function getAllTemplates(
  templateType?: NotificationType,
): ReturnType<typeof get<{
  templates: TemplateData[]
}>>

export declare function previewTemplateById(
  templateId: string,
  personalisation?: any,
): ReturnType<typeof get<{
  id: string,
  type: NotificationType,
  version: number,
  body: string
  html: string,
  subject: string,
  postage?: PostageType
}>>
export declare function getReceivedTexts(
  olderThan?: string,
): ReturnType<typeof get<{
  received_text_messages: TextMessage[],
  links: {
    current: string,
    next: string
  }
}>>
