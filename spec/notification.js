const chai = require('chai');
const chaiBytes = require('chai-bytes');
chai.use(chaiBytes);

let expect = require('chai').expect,
  NotifyClient = require('../client/notification.js').NotifyClient,
  MockDate = require('mockdate'),
  nock = require('nock'),
  createGovukNotifyToken = require('../client/authentication.js');

MockDate.set(1234567890000);

const baseUrl = 'http://localhost';
const serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1';
const apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

function getNotifyClient() {
  let baseUrl = 'http://localhost';
  let notifyClient = new NotifyClient(baseUrl, serviceId, apiKeyId);
  return notifyClient;
}

async function getNotifyAuthNock() {
  let notifyNock = nock(baseUrl, {
    reqheaders: {
      'Authorization': 'Bearer ' + await createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
    }
  })
  return notifyNock;
}

describe('notification api', () => {

  let notifyClient = getNotifyClient();
  let notifyAuthNock;

  before(async () => {
    MockDate.set(1234567890000);
    notifyAuthNock = await getNotifyAuthNock();
  });

  after(() => {
    MockDate.reset();
  });

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

      notifyAuthNock
      .post('/v2/notifications/email', data)
      .reply(200, {hooray: 'bkbbk'});

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

      notifyAuthNock
      .post('/v2/notifications/email', data)
      .reply(200, {hooray: 'bkbbk'});

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

      notifyAuthNock
      .post('/v2/notifications/email', data)
      .reply(200, {hooray: 'bkbbk'});

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

      notifyAuthNock
      .post('/v2/notifications/email', data)
      .reply(200, {hooray: 'bkbbk'});

      return notifyClient.sendEmail(templateId, email, options)
      .then((response) => {
        expect(response.status).to.equal(200);
        expect(response.config.data).to.include('"filename":"report.csv"');
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

      notifyAuthNock
      .post('/v2/notifications/sms', data)
      .reply(200, {hooray: 'bkbbk'});

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

      notifyAuthNock
      .post('/v2/notifications/sms', data)
      .reply(200, {hooray: 'bkbbk'});

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

      notifyAuthNock
      .post('/v2/notifications/letter', data)
      .reply(200, {hooray: 'bkbbk'});

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

    notifyAuthNock
      .get('/v2/notifications/' + notificationId)
      .reply(200, {hooray: 'bkbbk'});

    return notifyClient.getNotificationById(notificationId)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
  });

  it('should get letter pdf by id', () => {

    let pdf_file = Buffer.from("%PDF-1.5 testpdf")
    let notificationId = 'wfdfdgf';

    notifyAuthNock
      .get('/v2/notifications/' + notificationId + '/pdf')
      .reply(200, pdf_file.toString());

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

      notifyAuthNock
      .post('/v2/notifications/letter', data)
      .reply(200, {hiphip: 'hooray'});

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

      notifyAuthNock
      .post('/v2/notifications/letter', data)
      .reply(200, {hiphip: 'hooray'});

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

      notifyAuthNock
      .get('/v2/notifications')
      .reply(200, {hooray: 'bkbbk'});

      return notifyClient.getNotifications()
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all notifications with a reference', () => {

      let reference = 'myref';

      notifyAuthNock
      .get('/v2/notifications?reference=' + reference)
      .reply(200, {hooray: 'bkbbk'});

      return notifyClient.getNotifications(undefined, undefined, reference)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all failed notifications', () => {

      let status = 'failed';

      notifyAuthNock
      .get('/v2/notifications?status=' + status)
      .reply(200, {hooray: 'bkbbk'});

      return notifyClient.getNotifications(undefined, 'failed')
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all failed sms notifications', () => {

      let templateType = 'sms';
      let status = 'failed';

      notifyAuthNock
      .get('/v2/notifications?template_type=' + templateType + '&status=' + status)
      .reply(200, {hooray: 'bkbbk'});

      return notifyClient.getNotifications(templateType, status)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });

    it('should get all delivered sms notifications with a reference', () => {

      let templateType = 'sms';
      let status = 'delivered';
      let reference = 'myref';

      notifyAuthNock
      .get('/v2/notifications?template_type=' + templateType + '&status=' + status + '&reference=' + reference)
      .reply(200, {hooray: 'bkbbk'});

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

      notifyAuthNock
      .get('/v2/notifications?template_type=' + templateType +
        '&status=' + status +
        '&reference=' + reference +
        '&older_than=' + olderThanId
      )
      .reply(200, {hooray: 'bkbbk'});

      return notifyClient.getNotifications(templateType, status, reference, olderThanId)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });
    });
  });

  describe('template funtions', () => {

    it('should get template by id', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

      notifyAuthNock
      .get('/v2/template/' + templateId)
      .reply(200, {foo: 'bar'});

      return notifyClient.getTemplateById(templateId)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should get template by id and version', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';
      let version = 10;

      notifyAuthNock
      .get('/v2/template/' + templateId + '/version/' + version)
      .reply(200, {foo: 'bar'});

      return notifyClient.getTemplateByIdAndVersion(templateId, version)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should get all templates with unspecified template type', () => {

      notifyAuthNock
      .get('/v2/templates')
      .reply(200, {foo: 'bar'});

      return notifyClient.getAllTemplates()
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should get all templates with unspecified template type', () => {

      let templateType = 'sms'

      notifyAuthNock
      .get('/v2/templates?type=' + templateType)
      .reply(200, {foo: 'bar'});

      return notifyClient.getAllTemplates(templateType)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should preview template by id with personalisation', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';
      let payload = {name: 'Foo' }
      let expectedPersonalisation = {personalisation: payload };

      notifyAuthNock
        .post('/v2/template/' + templateId + '/preview', expectedPersonalisation)
        .reply(200, {foo: 'bar'});

      return notifyClient.previewTemplateById(templateId, payload)
      .then(function (response) {
        expect(response.status).to.equal(200);
      });

    });

    it('should preview template by id without personalisation', () => {

      let templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

      notifyAuthNock
      .post('/v2/template/' + templateId + '/preview')
      .reply(200, {foo: 'bar'});

      return notifyClient.previewTemplateById(templateId)
      .then(function (response) {
        expect(response .status).to.equal(200);
      });
    });
  });

  it('should get latest 250 received texts', function() {

    notifyAuthNock
      .get('/v2/received-text-messages')
      .reply(200, {"foo":"bar"});

    return notifyClient.getReceivedTexts()
      .then(function(response){
        expect(response.status).to.equal(200);
      });
  });

  it('should get up to next 250 received texts with a reference older than a given message id', function() {

    var olderThanId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

    notifyAuthNock
      .get('/v2/received-text-messages?older_than=' + olderThanId)
      .reply(200, {"foo":"bar"});

    return notifyClient.getReceivedTexts(olderThanId)
    .then(function(response){
      expect(response.status).to.equal(200);
    });
  });
});

MockDate.reset();
