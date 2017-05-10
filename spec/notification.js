var expect = require('chai').expect, NotifyClient = require('../client/notification.js').NotifyClient,
    nock = require('nock'),
    createGovukNotifyToken = require('../client/authentication.js');

const baseUrl = 'http://localhost';
const serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1';
const apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

function getNotifyClient() {
    var baseUrl = 'http://localhost';
    var notifyClient = new NotifyClient(baseUrl, serviceId, apiKeyId);
    return notifyClient;
}

function getNotifyAuthNock() {
    var notifyNock = nock(baseUrl, {
        reqheaders: {
            'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
        }
    })
    return notifyNock;
}

describe('notification api', function() {

    var notifyClient = getNotifyClient();
    var notifyAuthNock = getNotifyAuthNock();

    it('should send an email', function(done) {

        var email = 'dom@example.com',
          templateId = '123',
          personalisation = {foo: 'bar'},
          data = {
              template_id: templateId,
              email_address: email,
              personalisation: personalisation
          };

        notifyAuthNock
          .post('/v2/notifications/email', data)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.sendEmail(templateId, email, personalisation)
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });

    });

    it('should send an sms', function(done) {

        var phoneNo = '07525755555',
          templateId = '123',
          personalisation = {foo: 'bar'},
          data = {
              template_id: templateId,
              phone_number: phoneNo,
              personalisation: personalisation
          };

        notifyAuthNock
          .post('/v2/notifications/sms', data)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.sendSms(templateId, phoneNo, personalisation)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get notification by id', function(done) {

        var baseUrl = 'http://localhost',
          notificationId = 'wfdfdgf';

        notifyAuthNock
          .get('/v2/notifications/' + notificationId)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotificationById(notificationId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all notifications', function(done) {

        notifyAuthNock
          .get('/v2/notifications')
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotifications()
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all notifications with a reference', function(done) {

        var reference = 'myref'

        notifyAuthNock
          .get('/v2/notifications?reference=' + reference)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotifications(undefined, undefined, reference)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all failed notifications', function(done) {

        var status = 'failed';

        notifyAuthNock
          .get('/v2/notifications?status=' + status)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotifications(undefined, 'failed')
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all failed sms notifications', function(done) {

        var templateType = 'sms'
          status = 'failed';

        notifyAuthNock
          .get('/v2/notifications?template_type=' + templateType + '&status=' + status)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotifications(templateType, status)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all delivered sms notifications with a reference', function(done) {

        var templateType = 'sms'
          status = 'delivered';
          reference = 'myref'

        notifyAuthNock
          .get('/v2/notifications?template_type=' + templateType + '&status=' + status + '&reference=' + reference)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotifications(templateType, status, reference)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all failed email notifications with a reference older than a given notification', function(done) {

        var templateType = 'sms';
          status = 'delivered';
          reference = 'myref';
          olderThanId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

        notifyAuthNock
          .get('/v2/notifications?template_type=' + templateType +
               '&status=' + status +
               '&reference=' + reference +
               '&older_than=' + olderThanId
              )
          .reply(200, {"hooray": "bkbbk"});

        notifyClient.getNotifications(templateType, status, reference, olderThanId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get template by id', function(done) {

        var templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

        notifyAuthNock
          .get('/v2/template/' + templateId)
          .reply(200, {"foo": "bar"});

        notifyClient.getTemplateById(templateId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });

    });

    it('should get template by id and version', function(done) {

        var templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';
          version = 10;

        notifyAuthNock
          .get('/v2/template/' + templateId + '/version/' + version)
          .reply(200, {"foo": "bar"});

        notifyClient.getTemplateByIdAndVersion(templateId, version)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });

    });

    it('should get all templates with unspecified template type', function(done) {

        notifyAuthNock
          .get('/v2/templates')
          .reply(200, {"foo": "bar"});

        notifyClient.getAllTemplates()
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });

    });

    it('should get all templates with unspecified template type', function(done) {

        var templateType = 'sms'

        notifyAuthNock
          .get('/v2/templates?type=' + templateType)
          .reply(200, {"foo": "bar"});

        notifyClient.getAllTemplates(templateType)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });

    });

    it('should preview template by id with personalisation', function(done) {

        var templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';
          payload = { "name": "Foo" }
          expectedPersonalisation = { "personalisation" : payload };

        notifyAuthNock
          .post('/v2/template/' + templateId + '/preview', expectedPersonalisation)
          .reply(200, {"foo": "bar"});

        notifyClient.previewTemplateById(templateId, payload)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });

    });

    it('should preview template by id without personalisation', function(done) {

        var templateId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

        notifyAuthNock
          .post('/v2/template/' + templateId + '/preview')
          .reply(200, {"foo": "bar"});

        notifyClient.previewTemplateById(templateId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

});
