// This file is compiled with tsc --noEmit to verify the generated types work correctly.
// It is NOT run as a test - it only needs to type-check.

import { NotifyClient } from '..';

// Constructor overloads
const client1 = new NotifyClient('apiKeyId');
const client2 = new NotifyClient('https://example.com', 'apiKeyId');
const client3 = new NotifyClient('https://example.com', 'serviceId', 'apiKeyId');

// sendEmail
async function testSendEmail() {
  const response = await client1.sendEmail('template-id', 'test@example.com', {
    personalisation: { name: 'Test' },
    reference: 'ref-123',
    emailReplyToId: 'reply-to-id',
    oneClickUnsubscribeURL: 'https://example.com/unsub',
  });
  const id: string = response.data.id;
  const subject: string = response.data.content.subject;
  const fromEmail: string = response.data.content.from_email;
  const unsubUrl: string | undefined = response.data.content.one_click_unsubscribe_url;
  const templateId: string = response.data.template.id;
  const templateVersion: number = response.data.template.version;
  const templateUri: string = response.data.template.uri;
}

// sendSms
async function testSendSms() {
  const response = await client1.sendSms('template-id', '07123456789', {
    personalisation: { code: '1234' },
    reference: 'ref-123',
    smsSenderId: 'sender-id',
  });
  const id: string = response.data.id;
  const body: string = response.data.content.body;
  const fromNumber: string = response.data.content.from_number;
}

// sendLetter
async function testSendLetter() {
  const response = await client1.sendLetter('template-id', {
    personalisation: { address_line_1: 'Mr Test', address_line_2: '1 Test St', postcode: 'SW1A 1AA' },
    reference: 'ref-123',
  });
  const id: string = response.data.id;
  const scheduledFor: string | null = response.data.scheduled_for;
}

// sendPrecompiledLetter
async function testSendPrecompiledLetter() {
  const response = await client1.sendPrecompiledLetter('ref', Buffer.from('pdf'), 'first');
  const id: string = response.data.id;
  const postage: string = response.data.postage;
}

// getNotificationById
async function testGetNotificationById() {
  const response = await client1.getNotificationById('notification-id');
  const id: string = response.data.id;
  const type: "sms" | "letter" | "email" = response.data.type;
  const status: string = response.data.status;
  const body: string = response.data.body;
  const createdAt: string = response.data.created_at;
  const isCostDataReady: boolean = response.data.is_cost_data_ready;
  const emailAddress: string | undefined = response.data.email_address;
  const phoneNumber: string | undefined = response.data.phone_number;
  const subject: string | undefined = response.data.subject;
  const createdByName: string | undefined = response.data.created_by_name;
  const sentAt: string | undefined = response.data.sent_at;
  const completedAt: string | undefined = response.data.completed_at;
  const scheduledFor: string | undefined = response.data.scheduled_for;
  const oneClickUnsubscribe: string | undefined = response.data.one_click_unsubscribe;
  const costInPounds: number | undefined = response.data.cost_in_pounds;
  const line1: string | undefined = response.data.line_1;
}

// getNotifications
async function testGetNotifications() {
  const response = await client1.getNotifications('sms', 'delivered', 'ref', 'older-than-id');
  const notifications = response.data.notifications;
  const firstNotification = notifications[0];
  const type: "sms" | "letter" | "email" = firstNotification.type;
  const links = response.data.links;
  const current: string = links.current;
  const next: string = links.next;
}

// getPdfForLetterNotification
async function testGetPdf() {
  const pdf: Buffer = await client1.getPdfForLetterNotification('notification-id');
}

// getTemplateById
async function testGetTemplateById() {
  const response = await client1.getTemplateById('template-id');
  const id: string = response.data.id;
  const name: string = response.data.name;
  const type: "sms" | "letter" | "email" = response.data.type;
  const createdAt: string = response.data.created_at;
  const version: number = response.data.version;
  const body: string = response.data.body;
  const letterContactBlock: string | undefined = response.data.letter_contact_block;
  const postage: string | undefined = response.data.postage;
}

// getTemplateByIdAndVersion
async function testGetTemplateByIdAndVersion() {
  const response = await client1.getTemplateByIdAndVersion('template-id', 3);
  const id: string = response.data.id;
}

// getAllTemplates
async function testGetAllTemplates() {
  const response = await client1.getAllTemplates('email');
  const templates = response.data.templates;
  const first = templates[0];
  const type: "sms" | "letter" | "email" = first.type;
}

// previewTemplateById
async function testPreviewTemplateById() {
  const response = await client1.previewTemplateById('template-id', { name: 'Test' });
  const id: string = response.data.id;
  const type: "sms" | "letter" | "email" = response.data.type;
  const body: string = response.data.body;
  const html: string | undefined = response.data.html;
  const postage: "first" | "second" | "europe" | "rest-of-world" | undefined = response.data.postage;
}

// getReceivedTexts
async function testGetReceivedTexts() {
  const response = await client1.getReceivedTexts('older-than-id');
  const messages = response.data.received_text_messages;
  const first = messages[0];
  const userNumber: string = first.user_number;
  const serviceId: string = first.service_id;
}

// prepareUpload
function testPrepareUpload() {
  const result = client1.prepareUpload(Buffer.from('data'), {
    filename: 'test.csv',
    confirmEmailBeforeDownload: true,
    retentionPeriod: '52 weeks',
  });
  const file: string = result.file;
}

// setProxy
client1.setProxy({ host: 'proxy.example.com', port: 8080 });

// setClient - accepts axios instance
