import { matches } from 'lodash';
import nock from 'nock';

import version from './version.json';

import { NotifyClient, NotifyClientConfiguration, RequestOptions } from '.';

const config: NotifyClientConfiguration = {
  apiEndpoint: 'https://example.com',
  apiKeyID: '__API_KEY_ID__',
  serviceID: '__SERVICE_ID__',
};

const id = '__ID__';
const templateID = '__TEMPLATE_ID__';
const emailAddress = 'jeff@example.com';
const phoneNumber = '07000000000';
const reference = '__REFERENCE__';
const personalisation = { name: 'Jeff' };

describe(NotifyClient, () => {
  let client: NotifyClient;
  let nockNotify: nock.Scope;

  beforeEach(() => {
    nock.cleanAll();

    client = new NotifyClient(config);
    nockNotify = nock(config.apiEndpoint as string);
  });

  afterEach(() => {
    nockNotify.done();

    nock.cleanAll();
  });

  it('should set the apiEndpoint by default', async () => {
    nock('https://api.notifications.service.gov.uk')
      .post('/v2/notifications/email')
      .reply(200);

    const client = new NotifyClient({ ...config, apiEndpoint: undefined });

    await expect(client.sendEmail(templateID, emailAddress)).resolves.not.toThrow();
  });

  it('should include the required headers', async () => {
    nock(config.apiEndpoint as string, {
      reqheaders: {
        authorization: (value: string): boolean => {
          const expected = /^[Bb]earer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
          expect(value).toMatch(expected);

          return expected.test(value);
        },
        'user-agent': (value: string): boolean => {
          const expected = `NOTIFY-API-NODE-CLIENT/${version}`;
          expect(value).toEqual(expected);

          return value === expected;
        },
      },
    })
      .post('/v2/notifications/email')
      .reply(200);

    await expect(client.sendEmail(templateID, emailAddress)).resolves.not.toThrow();
  });

  it('should throw an error if unrecognised options have been passed', async () => {
    await expect(client.sendEmail(templateID, emailAddress, { test: true } as RequestOptions)).rejects.toThrow();
  });

  it('should resolve without throwing option errors', async () => {
    nockNotify
      .post('/v2/notifications/email', matches({
        email_address: emailAddress,
        template_id: templateID,
      }))
      .reply(200);

    await expect(client.sendEmail(templateID, emailAddress)).resolves.not.toThrow();
  });

  it('should fail to make a request due to team api key', async () => {
    nockNotify
      .post('/v2/notifications/email')
      .reply(400, [{ error: 'BadRequestError', message: 'Can\'t send to this recipient using a team-only API key' }]);

    await expect(client.sendEmail(templateID, emailAddress)).rejects.toThrow(/BadRequestError/);
  });

  it('should fail to make a request due to invalid token', async () => {
    nockNotify
      .post('/v2/notifications/email')
      .reply(403, [{ error: 'AuthError', message: 'Invalid token: API key not found' }]);

    await expect(client.sendEmail(templateID, emailAddress)).rejects.toThrow(/AuthError/);
  });

  it('should fail to make a request due to rate limit being hit', async () => {
    nockNotify
      .post('/v2/notifications/email')
      .reply(429, [{ error: 'TooManyRequestsError', message: 'Exceeded send limits (LIMIT NUMBER) for today' }]);

    await expect(client.sendEmail(templateID, emailAddress)).rejects.toThrow(/TooManyRequestsError/);
  });

  it('should send an email', async () => {
    nockNotify
      .post('/v2/notifications/email', matches({
        email_address: emailAddress,
        email_reply_to_id: emailAddress,
        personalisation,
        reference,
        template_id: templateID,
      }))
      .reply(200, { id, reference, template: { id: templateID } });

    const response = await client.sendEmail(templateID, emailAddress, {
      emailReplyToID: emailAddress,
      personalisation,
      reference,
    } as RequestOptions);

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('reference');
    expect(response.reference).toEqual(reference);
    expect(response).toHaveProperty('template');
    expect(response.template).toHaveProperty('id');
    expect(response.template.id).toEqual(templateID);
  });

  it('should send an email without options', async () => {
    nockNotify
      .post('/v2/notifications/email')
      .reply(200, { id });

    const response = await client.sendEmail(templateID, emailAddress);

    expect(response).toHaveProperty('id');
  });

  it('should send an sms', async () => {
    nockNotify
      .post('/v2/notifications/sms', matches({
        personalisation,
        phone_number: phoneNumber,
        reference,
        sms_sender_id: phoneNumber,
        template_id: templateID,
      }))
      .reply(200, { id, reference, template: { id: templateID } });

    const response = await client.sendSMS(templateID, phoneNumber, {
      personalisation,
      reference,
      smsSenderID: phoneNumber,
    } as RequestOptions);

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('reference');
    expect(response.reference).toEqual(reference);
    expect(response).toHaveProperty('template');
    expect(response.template).toHaveProperty('id');
    expect(response.template.id).toEqual(templateID);
  });

  it('should send an sms without options', async () => {
    nockNotify
      .post('/v2/notifications/sms')
      .reply(200, { id });

    const response = await client.sendSMS(templateID, phoneNumber);

    expect(response).toHaveProperty('id');
  });

  it('should send a letter', async () => {
    nockNotify
      .post('/v2/notifications/letter', matches({
        personalisation,
        reference,
        template_id: templateID,
      }))
      .reply(200, { id, reference, template: { id: templateID } });

    const response = await client.sendLetter(templateID, {
      personalisation,
      reference,
    } as RequestOptions);

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('reference');
    expect(response.reference).toEqual(reference);
    expect(response).toHaveProperty('template');
    expect(response.template).toHaveProperty('id');
    expect(response.template.id).toEqual(templateID);
  });

  it('should send a letter without options', async () => {
    nockNotify
      .post('/v2/notifications/letter')
      .reply(200, { id });

    const response = await client.sendLetter(templateID);

    expect(response).toHaveProperty('id');
  });

  it('should fail to send a pre-compiled letter due to file being too big', async () => {
    const data = new ArrayBuffer(6 * 1024 * 1024);

    await expect(client.sendPrecompiledLetter(reference, Buffer.from(data))).rejects.toThrow(/File is larger/);
  });

  it('should send a pre-compiled letter', async () => {
    nockNotify
      .post('/v2/notifications/letter', matches({
        reference,
      }))
      .reply(200, { id, reference });

    const response = await client.sendPrecompiledLetter(reference, Buffer.from('Pre-compiled letter', 'utf-8'));

    expect(response).toHaveProperty('id');
    expect(response).toHaveProperty('reference');
    expect(response.reference).toEqual(reference);
    expect(response).not.toHaveProperty('template');
  });

  it('should get notification by ID', async () => {
    nockNotify
      .get(`/v2/notifications/${id}`)
      .reply(200, { id });

    const response = await client.getNotificationByID(id);

    expect(response).toHaveProperty('id');
    expect(response.id).toEqual(id);
  });

  it('should get notifications', async () => {
    nockNotify
      .get('/v2/notifications')
      .reply(200, { links: { current: '/', next: '/?page=2' }, notifications: [{ id }, { id }, { id }] });

    const response = await client.getNotifications();

    expect(response).toHaveProperty('links');
    expect(response).toHaveProperty('notifications');
    expect(response.notifications).toHaveLength(3);
    expect(response.notifications[0]).toHaveProperty('id');
    expect(response.notifications[0].id).toEqual(id);
  });

  it('should get PDF for letter notifications', async () => {
    const content = Buffer.from('%PDF-1.5 testpdf');
    nockNotify
      .get(`/v2/notifications/${id}/pdf`)
      .reply(200, content.toString('base64'));

    const response = await client.getPDFForLetterNotification(id);

    expect(response).toEqual(content);
  });

  it('should get PDF for letter notifications', async () => {
    nockNotify
      .get(`/v2/notifications/${id}/pdf`)
      .reply(400, [{ error: 'PDFNotReadyError', message: 'PDF not available yet, try again later' }]);

    await expect(client.getPDFForLetterNotification(id)).rejects.toThrow(/PDFNotReadyError/);
  });

  it('should get template by ID', async () => {
    nockNotify
      .get(`/v2/template/${templateID}`)
      .reply(200, { id: templateID });

    const response = await client.getTemplateByID(templateID);

    expect(response).toHaveProperty('id');
    expect(response.id).toEqual(templateID);
  });

  it('should get template by ID and version', async () => {
    const version = '0';

    nockNotify
      .get(`/v2/template/${templateID}/version/${version}`)
      .reply(200, { id: templateID, version });

    const response = await client.getTemplateByIDAndVersion(templateID, version);

    expect(response).toHaveProperty('id');
    expect(response.id).toEqual(templateID);
    expect(response).toHaveProperty('version');
    expect(response.version).toEqual(version);
  });

  it('should get all templates', async () => {
    nockNotify
      .get('/v2/templates')
      .reply(200, { templates: [{ id: templateID, version }] });

    const response = await client.getAllTemplates();

    expect(response).toHaveProperty('templates');
    expect(response.templates).toHaveLength(1);
    expect(response.templates[0]).toHaveProperty('id');
    expect(response.templates[0].id).toEqual(templateID);
  });

  it('should preview template by ID', async () => {
    nockNotify
      .post(`/v2/template/${templateID}/preview`)
      .reply(200, { html: '<p>Hello World</p>', id: templateID });

    const response = await client.previewTemplateByID(templateID);

    expect(response).toHaveProperty('html');
    expect(response.html).toEqual('<p>Hello World</p>');
    expect(response).toHaveProperty('id');
  });

  it('should get received texts', async () => {
    nockNotify
      .get('/v2/received-text-messages')
      .reply(200, { received_text_messages: [{ id }] });

    const response = await client.getReceivedTexts();

    expect(response).toHaveProperty('received_text_messages');
    expect(response.received_text_messages).toHaveLength(1);
    expect(response.received_text_messages[0]).toHaveProperty('id');
    expect(response.received_text_messages[0].id).toEqual(id);
  });

  it('should prepare upload', () => {
    const content = Buffer.from('%PDF-1.5 testpdf');
    const response = client.prepareUpload(content);

    expect(response).toHaveProperty('file');
    expect(response.file).toEqual(content.toString('base64'));
    expect(response).toHaveProperty('is_csv');
  });

  it('should fail to prepare upload due to file being too big', () => {
    const data = new ArrayBuffer(3 * 1024 * 1024);

    expect(() => {
      client.prepareUpload(Buffer.from(data));
    }).toThrow(/File is larger/);
  });
});
