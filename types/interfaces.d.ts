import type {
  PostageType,
  NotificationType,
  TextStatus,
  PrecompLetterStatus,
  EmailStatus,
  LetterStatus
} from "./enum.d.ts"

export interface EmailResponse {
  email_address: string
  subject: string,
}

export interface TextResponse {
  phone_number: string
}

export interface LetterResponse {
  line_1: string,
  line_2: string,
  line_3: string,
  line_4?: string,
  line_5?: string,
  line_6?: string,
  line_7?: string
  postage: PostageType
}

export interface LetterCost {
  billable_sheets_of_paper?: number,
  postage?: "first" | "second" | "europe" | "rest-of-world"
}

export interface SmsCost {
  billable_sms_fragments?: number,
  international_rate_multiplier?: number,
  sms_rate?: number,
}

export interface Notification {
  id: string,
  reference?: string,
  type: NotificationType,
  status: TextStatus | PrecompLetterStatus | EmailStatus | LetterStatus,
  template: Template,
  body: string,
  created_at: string,
  created_by_name?: string,
  sent_at?: string,
  completed_at?: string,
  scheduled_for?: string,
  one_click_unsubscribe?: string,
  is_cost_data_ready: boolean,
  cost_in_pounds?: number,
  cost_details?: LetterCost | SmsCost
}


export interface TemplateData {
  id: string,
  name: string,
  type: NotificationType,
  created_at: string,
  updated_at: string,
  version: number,
  created_by: string,
  subject: string,
  body: string,
  letter_contact_block?: string
}

interface TextMessage {
  id: string,
  user_number: string,
  notify_number: string,
  created_at: string,
  service_id: string,
  content: string
}

