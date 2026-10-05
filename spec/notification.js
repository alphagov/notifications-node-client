const chai = require('chai');
const chaiBytes = require('chai-bytes');
chai.use(chaiBytes);

let expect = require('chai').expect,
  NotifyClient = require('../client/notification.js').NotifyClient,
  MockDate = require('mockdate'),
  createGovukNotifyToken = require('../client/authentication.js');
const {getGlobalDispatcher, MockAgent, setGlobalDispatcher} = require("undici");

MockDate.set(1234567890000);

const baseUrl = 'http://localhost';
const serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1';
const apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

function getNotifyClient() {
  return new NotifyClient(baseUrl, serviceId, apiKeyId);
}

/** @type {import('undici').Interceptable} */
let mockPool;

function getNotifyAuthNock(path, {method, data, query} = {}) {
  return mockPool.intercept({
    path,
    method,
    body: data && JSON.stringify(data),
    query,
    headers: {
      'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
    }
  });
}

const responseOptions =  {headers: {'Content-Type': 'application/json'}};

describe('notification api', () => {
  let dispatcher;

  beforeEach(() => {
    MockDate.set(1234567890000);
    dispatcher = getGlobalDispatcher();
    const mockAgent = new MockAgent();
    setGlobalDispatcher(mockAgent);
    mockPool = mockAgent.get(baseUrl);
  });

  afterEach(() => {
    MockDate.reset();
    setGlobalDispatcher(dispatcher);
  });

  let notifyClient = getNotifyClient();

  describe('sendEmail', () => {
    it('should send an email', () => {

      let email = 'dom@example.com',
        templateId = '123',
        options = {
          personalisation: {foo: 'bar'},
        },
        data = {
          template_id: templateId,
          email_address: email,
          personalisation: options.personalisation
        };

      getNotifyAuthNock('/v2/notifications/email', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendEmail(templateId, email, options)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should send an email with email_reply_to_id', () => {

      let email = 'dom@example.com',
        templateId = '123',
        options = {
          personalisation: {foo: 'bar'},
          emailReplyToId: '456',
        },
        data = {
          template_id: templateId,
          email_address: email,
          personalisation: options.personalisation,
          email_reply_to_id: options.emailReplyToId
        };

      getNotifyAuthNock('/v2/notifications/email', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendEmail(templateId, email, options)
      .then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should send an email with a one click unsubscribe URL', () => {

      let email = 'me@example.com',
        templateId = '123',
        options = {
          personalisation: {foo: 'bar'},
          oneClickUnsubscribeURL: '456',
        },
        data = {
          template_id: templateId,
          email_address: email,
          personalisation: options.personalisation,
          one_click_unsubscribe_url: options.oneClickUnsubscribeURL
        };

      getNotifyAuthNock('/v2/notifications/email', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendEmail(templateId, email, options)
      .then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should send an email with sanitise content parameter', () => {

      let email = 'dom@example.com',
        templateId = '123',
        options = {
          personalisation: {code: '12345', name: 'John'},
          sanitiseContentFor: ['code']
        },
        data = {
          template_id: templateId,
          email_address: email,
          personalisation: options.personalisation,
          sanitise_content_for: options.sanitiseContentFor
        };

      getNotifyAuthNock('/v2/notifications/email', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendEmail(templateId, email, options)
      .then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should send an email with document upload', () => {
      let email = 'dom@example.com',
        templateId = '123',
        options = {
          personalisation: {documents:
            notifyClient.prepareUpload(Buffer.from("%PDF-1.5 testpdf"))
          },
        },
        data = {
          template_id: templateId,
          email_address: email,
          personalisation: options.personalisation,
        };

      getNotifyAuthNock('/v2/notifications/email', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendEmail(templateId, email, options)
      .then((response) => {
        expect(response.status).to.equal(200);
      });
    });

    it('should send an email with a custom filename', () => {
      let email = 'dom@example.com',
        templateId = '123',
        options = {
          personalisation: {documents:
            notifyClient.prepareUpload(Buffer.from("a,b"), {filename: 'report.csv'})
          },
        },
        data = {
          template_id: templateId,
          email_address: email,
          personalisation: options.personalisation,
        };

      getNotifyAuthNock('/v2/notifications/email', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendEmail(templateId, email, options)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(data.personalisation.documents.filename).to.include('report.csv');
      });
    });

    it('should reject options dicts with unknown options', () => {
      let email = 'foo@bar.com',
        templateId = '123',
        // old personalisation dict
        options = {
          firstname: 'Fred',
          surname: 'Smith',
          reference: 'ABC123'
        };
      return notifyClient.sendEmail(templateId, email, options)
        .catch((err) => expect(err.message).to.include('["firstname","surname"]'));
    });
  });

  describe('prepareUpload', () => {
    it('should throw error when file bigger than 2MB is supplied', () => {
      let file = Buffer.alloc(3*1024*1024)
      expect(function(){
        notifyClient.prepareUpload(file);
      }).to.throw("File is larger than 2MB.")
    });
    it('should accept files as buffers (from fs.readFile with no encoding)', () => {
      let fs = require('fs');
      let file = fs.readFileSync('./spec/test_files/simple.csv');
      expect(typeof(file)).to.equal('object')
      expect(Buffer.isBuffer(file)).to.equal(true);
      expect(
        notifyClient.prepareUpload(file)
      ).contains({file: 'MSwyLDMKYSxiLGMK'})
    });
    it('should accept files as strings (from fs.readFile with an encoding)', () => {
      let fs = require('fs');
      let file = fs.readFileSync('./spec/test_files/simple.csv', 'binary');
      expect(typeof(file)).to.equal('string')
      expect(Buffer.isBuffer(file)).to.equal(false);
      expect(
        notifyClient.prepareUpload(file)
      ).contains({file: 'MSwyLDMKYSxiLGMK'})
    });

    it('should allow send a file email confirmation to be disabled', () => {
      let file = Buffer.alloc(2*1024*1024)
      expect(
        notifyClient.prepareUpload(file, {confirmEmailBeforeDownload: false})
      ).contains({confirm_email_before_download: false, retention_period: null})
    });

    it('should allow send a file email confirmation to be set', () => {
      let file = Buffer.alloc(2*1024*1024)
      expect(
        notifyClient.prepareUpload(file, {confirmEmailBeforeDownload: true})
      ).contains({confirm_email_before_download: true, retention_period: null})
    });

    it('should allow custom retention periods to be set', () => {
      let file = Buffer.alloc(2*1024*1024)
      expect(
        notifyClient.prepareUpload(file, {retentionPeriod: "52 weeks"})
      ).contains({confirm_email_before_download: null, retention_period: '52 weeks'})
    });

    it('should allow custom filenames to be set', () => {
      let file = Buffer.alloc(2*1024*1024)
      expect(
        notifyClient.prepareUpload(file, {filename: "report.csv"})
      ).contains({confirm_email_before_download: null, filename: "report.csv"})
    });
  });

  describe('sendSms', () => {

    it('should send an sms', () => {

      let phoneNo = '07525755555',
        templateId = '123',
        options = {
          personalisation: {foo: 'bar'},
        },
        data = {
          template_id: templateId,
          phone_number: phoneNo,
          personalisation: options.personalisation
        };

      getNotifyAuthNock('/v2/notifications/sms', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendSms(templateId, phoneNo, options)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should send an sms with smsSenderId', () => {

      let phoneNo = '07525755555',
        templateId = '123',
        options = {
          personalisation: {foo: 'bar'},
          smsSenderId: '456',
        },
        data = {
          template_id: templateId,
          phone_number: phoneNo,
          personalisation: options.personalisation,
          sms_sender_id: options.smsSenderId,
        };

      getNotifyAuthNock('/v2/notifications/sms', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendSms(templateId, phoneNo, options)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should reject options dicts with unknown options', () => {
      let phoneNumber = '07123456789',
        templateId = '123',
        // old personalisation dict
        options = {
          firstname: 'Fred',
          surname: 'Smith',
          reference: 'ABC123'
        };
      return notifyClient.sendSms(templateId, phoneNumber, options)
        .catch((err) => expect(err.message).to.include('["firstname","surname"]'));
    });
  });

  describe('sendLetter', () => {

    it('should send a letter', () => {

      let templateId = '123',
        options = {
          personalisation: {
            address_line_1: 'Mr Tester',
            address_line_2: '1 Test street',
            postcode: 'NW1 2UN'
          },
        },
        data = {
          template_id: templateId,
          personalisation: options.personalisation
        };

      getNotifyAuthNock('/v2/notifications/letter', {method: 'POST', data})
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.sendLetter(templateId, options)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should reject options dicts with unknown options', () => {
      let templateId = '123',
        // old personalisation dict
        options = {
          address_line_1: 'Mr Tester',
          address_line_2: '1 Test street',
          postcode: 'NW1 2UN',
          reference: 'ABC123'
        };
      return notifyClient.sendLetter(templateId, options)
        .catch((err) => expect(err.message).to.include('["address_line_1","address_line_2","postcode"]'));
    });

  });

  it('should get notification by id', () => {

    let notificationId = 'wfdfdgf';

    getNotifyAuthNock('/v2/notifications/' + notificationId)
      .reply(200, {hooray: 'bkbbk'}, responseOptions);

    return notifyClient.getNotificationById(notificationId)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
  });

  it('should get letter pdf by id', () => {

    let pdf_file = Buffer.from("%PDF-1.5 testpdf")
    let notificationId = 'wfdfdgf';

    getNotifyAuthNock('/v2/notifications/' + notificationId + '/pdf')
      .reply(200, pdf_file, {headers: {'Content-Type': 'application/pdf'}});

    return notifyClient.getPdfForLetterNotification(notificationId)
      .then(function (response_buffer) {
        expect(response_buffer).to.equalBytes(pdf_file)
      });
  });


  describe('sendPrecompiledLetter', () => {

    it('should send a precompiled letter', () => {
      let pdf_file = Buffer.from("%PDF-1.5 testpdf"),
      reference = "HORK",
      data = {"reference": reference, "content": pdf_file.toString('base64')}

      getNotifyAuthNock('/v2/notifications/letter', {method: 'POST', data})
        .reply(200, {hiphip: 'hooray'}, responseOptions);

      return notifyClient.sendPrecompiledLetter(reference, pdf_file)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });


    it('should be able to set postage when sending a precompiled letter', () => {
      let pdf_file = Buffer.from("%PDF-1.5 testpdf"),
      reference = "HORK",
      postage = "first"
      data = {"reference": reference, "content": pdf_file.toString('base64'), "postage": postage}

      getNotifyAuthNock('/v2/notifications/letter', {method: 'POST', data})
        .reply(200, {hiphip: 'hooray'}, responseOptions);

      return notifyClient.sendPrecompiledLetter(reference, pdf_file, postage)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should throw error when file bigger than 5MB is supplied', () => {
      let file = Buffer.alloc(6*1024*1024),
      reference = "HORK"
      expect(function(){
        notifyClient.sendPrecompiledLetter(reference, file);
      }).to.throw("File is larger than 5MB.")
    });
  });


  describe('getNotifications', () => {

    it('should get all notifications', () => {

      getNotifyAuthNock('/v2/notifications')
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.getNotifications()
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all notifications with a reference', () => {

      let reference = 'myref';

      getNotifyAuthNock('/v2/notifications?reference=' + reference)
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.getNotifications(undefined, undefined, reference)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all failed notifications', () => {

      let status = 'failed';

      getNotifyAuthNock('/v2/notifications?status=' + status)
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.getNotifications(undefined, 'failed')
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all failed sms notifications', () => {

      let templateType = 'sms';
      let status = 'failed';

      getNotifyAuthNock('/v2/notifications?template_type=' + templateType + '&status=' + status)
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.getNotifications(templateType, status)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all delivered sms notifications with a reference', () => {

      let templateType = 'sms';
      let status = 'delivered';
      let reference = 'myref';

      getNotifyAuthNock('/v2/notifications', {
        query: {
          template_type: templateType,
          status,
          reference
        }
      })
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.getNotifications(templateType, status, reference)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all failed email notifications with a reference older than a given notification', () => {

      let templateType = 'sms';
      let status = 'delivered';
      let reference = 'myref';
      let olderThanId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

      getNotifyAuthNock('/v2/notifications?template_type=' + templateType +
        '&status=' + status +
        '&reference=' + reference +
        '&older_than=' + olderThanId,
          'GET'
      )
        .reply(200, {hooray: 'bkbbk'}, responseOptions);

      return notifyClient.getNotifications(templateType, status, reference, olderThanId)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('template funtions', () => {

    it('should get template by id', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

      getNotifyAuthNock('/v2/template/' + templateId)
        .reply(200, {foo: 'bar'}, responseOptions);

      return notifyClient.getTemplateById(templateId)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should return personalisation from get template by id', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

      getNotifyAuthNock('/v2/template/' + templateId)
        .reply(200, {personalisation: {name: {required: true}}}, responseOptions);

      return notifyClient.getTemplateById(templateId)
      .then(function (response) {
        expect(response.status).to.equal(200);
        expect(response.data.personalisation).to.deep.equal({name: {required: true}});
      });

    });

    it('should get template by id and version', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';
      let version = 10;

      getNotifyAuthNock('/v2/template/' + templateId + '/version/' + version)
        .reply(200, {foo: 'bar'}, responseOptions);

      return notifyClient.getTemplateByIdAndVersion(templateId, version)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should get all templates with unspecified template type', () => {

      getNotifyAuthNock('/v2/templates')
        .reply(200, {foo: 'bar'}, responseOptions);

      return notifyClient.getAllTemplates()
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should get all templates with unspecified template type', () => {

      let templateType = 'sms'

      getNotifyAuthNock('/v2/templates?type=' + templateType)
        .reply(200, {foo: 'bar'}, responseOptions);

      return notifyClient.getAllTemplates(templateType)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should preview template by id with personalisation', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';
      let payload = {name: 'Foo' }
      let expectedPersonalisation = {personalisation: payload };

      getNotifyAuthNock('/v2/template/' + templateId + '/preview', {
        method: 'POST',
        data: expectedPersonalisation
      })
        .reply(200, {foo: 'bar'}, responseOptions);

      return notifyClient.previewTemplateById(templateId, payload)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should preview template by id without personalisation', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

      getNotifyAuthNock('/v2/template/' + templateId + '/preview', {method: 'POST'})
        .reply(200, {foo: 'bar'}, responseOptions);

      return notifyClient.previewTemplateById(templateId)
      .then(function (response) {
        expect(response .status).to.equal(200);
      });
    });
  });

  it('should get latest 250 received texts', function() {

    getNotifyAuthNock('/v2/received-text-messages')
      .reply(200, {"foo":"bar"}, responseOptions);

    return notifyClient.getReceivedTexts()
      .then(function(response){
        expect(response.status).to.equal(200);
      });
  });

  it('should get up to next 250 received texts with a reference older than a given message id', function() {

    var olderThanId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

    getNotifyAuthNock('/v2/received-text-messages?older_than=' + olderThanId)
      .reply(200, {"foo":"bar"}, responseOptions);

    return notifyClient.getReceivedTexts(olderThanId)
    .then(function(response){
      expect(response.status).to.equal(200);
    });
  });
});

MockDate.reset();
