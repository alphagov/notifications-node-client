import type {
  setClient,
  setProxy
} from "./api_client.d.ts"
import type {
  getNotificationById,
  getNotifications,
  getPdfForLetterNotification,
  getTemplateById,
  getTemplateByIdAndVersion,
  getAllTemplates,
  previewTemplateById,
  getReceivedTexts,
} from "./get.d.ts"

import type {
  sendEmail,
  sendSms,
  sendLetter,
  sendPrecompiledLetter,
  prepareUpload
} from "./send.d.ts"

export declare class NotifyClient {
  getNotificationById: typeof getNotificationById
  getNotifications: typeof getNotifications
  getPdfForLetterNotification: typeof getPdfForLetterNotification
  getTemplateById: typeof getTemplateById
  getTemplateByIdAndVersion: typeof getTemplateByIdAndVersion
  getAllTemplates: typeof getAllTemplates
  previewTemplateById: typeof previewTemplateById
  getReceivedTexts: typeof getReceivedTexts

  sendEmail: typeof sendEmail
  sendSms: typeof sendSms
  sendLetter: typeof sendLetter
  sendPrecompiledLetter: typeof sendPrecompiledLetter
  prepareUpload: typeof prepareUpload

  setClient: typeof setClient
  setProxy: typeof setProxy

  constructor(urlBase: string, serviceId: string, apiKeyId: string)
  constructor(urlBase: string, apiKeyId: string)
  constructor(apiKeyId: string)
}
