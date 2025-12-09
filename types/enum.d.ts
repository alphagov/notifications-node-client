export type PostageType =
  "first" |
  "second" |
  "economy"

export type EmailStatus =
  "created" |
  "sending" |
  "delivered" |
  "permanent-failure" |
  "temporary-failure" |
  "technical-failure"

export type TextStatus =
  "created" |
  "sending" |
  "pending" |
  "sent" |
  "delivered" |
  "permanent-failure" |
  "temporary-failure" |
  "technical-failure"

export type LetterStatus =
  "accepted" |
  "received" |
  "cancelled" |
  "technical-failure" |
  "permanent-failure"

export type PrecompLetterStatus =
  "accepted" |
  "received" |
  "cancelled" |
  "pending-virus-check" |
  "virus-scan-failed" |
  "validation-failed" |
  "technical-failure" |
  "permanent-failure"

export type NotificationType =
  "sms" |
  "letter" |
  "email"
