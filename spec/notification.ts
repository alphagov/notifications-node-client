import { NotifyClient } from "..";

/**
 * This isn't an actual test file. Its purpose is to demonstrate the use of 
 * types with no issues.
 */

(async () => {
  const client = new NotifyClient('__TEST_API_KEY__');

  client.setProxy('__SAPLE_PROXY__');

  const email1 = await client.sendEmail('__SAMPLE_TEMPLATE_ID__', 'test@example.com');
  const email2 = await client.sendEmail('__SAMPLE_TEMPLATE_ID__', 'test@example.com', {
    personalisation: {
      firstName: 'Jeff',
      lastName: 'Jefferson',
    },
  });

  email1.content.body;
  email2.reference;

  const sms1 = await client.sendSms('__SAMPLE_TEMPLATE_ID__', '00000000000');
  const sms2 = await client.sendSms('__SAMPLE_TEMPLATE_ID__', '00000000000', {
    personalisation: {
      firstName: 'Jeff',
      lastName: 'Jefferson',
    },
  });

  sms1.content.body;
  sms2.reference;

  const letter = await client.sendLetter('__SAMPLE_TEMPLATE_ID__', {
    personalisation: {
      address_line_1: '__SAMPLE_LETTER_DATA__',
      address_line_2: '__SAMPLE_LETTER_DATA__',
      postcode: '__SAMPLE_LETTER_DATA__',
      application_id: '__SAMPLE_LETTER_DATA__',
      application_date: '__SAMPLE_LETTER_DATA__',

      firstName: 'Jeff',
      lastName: 'Jefferson',
    },
  });

  letter.content.body;

  const notification = await client.getNotificationById('__TEST_NOTIFICATION_ID__');

  notification.body;

  const notifications1 = await client.getNotifications();
  const notifications2 = await client.getNotifications('all');
  const notifications3 = await client.getNotifications('all', 'sent');
  const notifications4 = await client.getNotifications('all', 'sent', '__SAMPLE_REFERANCE__');
  const notifications5 = await client.getNotifications('all', 'sent', '__SAMPLE_REFERANCE__', '__SAMPLE_TIMESTAMP__');

  for (const n of notifications1.notifications) { n.type; }
  for (const n of notifications2.notifications) { n.body; }
  for (const n of notifications3.notifications) { n.created_at; }
  for (const n of notifications4.notifications) { n.email_address; }
  for (const n of notifications5.notifications) { n.status; }

  const template1 = await client.getTemplateById('__SAMPLE_TEMPLATE_ID__');

  template1.type;

  const template2 = await client.getTemplateByIdAndVersion('__SAMPLE_TEMPLATE_ID__', 5);

  template2.version === 5;

  const templates = await client.getAllTemplates('email');

  for (const t of templates.templates) { t.version; }

  const previewTemplate = await client.previewTemplateById('__SAMPLE_TEMPLATE_ID__', {
    firstName: 'Jeff',
    lastName: 'Jefferson',
  });

  previewTemplate.version;

  const receivedText = await client.getReceivedTexts('__SAMPLE_TIMESTAMP__');

  for (const r of receivedText.received_text_messages) { r.notify_number; }
});
