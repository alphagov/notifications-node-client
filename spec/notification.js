var expect = require('chai').expect, NotifyClient = require('../client/notification.js').NotifyClient,
    nock = require('nock'),
    createGovukNotifyToken = require('../client/authentication.js');


describe('notification api', function() {

    it('should send an email', function(done) {

        var urlBase = 'http://localhost',
          email = 'dom@example.com',
          templateId = '123',
          personalisation = {foo: 'bar'},
          data = {
              template_id: templateId,
              email_address: email,
              personalisation: personalisation
          },
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/email', apiKeyId, serviceId)
            }})
            .post('/v2/notifications/email', data)
            .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.sendEmail(templateId, email, personalisation)
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('should send an sms', function(done) {

        var urlBase = 'http://localhost',
          phoneNo = '07525755555',
          templateId = '123',
          personalisation = {foo: 'bar'},
          data = {
              template_id: templateId,
              phone_number: phoneNo,
              personalisation: personalisation
          },
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/email', apiKeyId, serviceId)
            }})
          .post('/v2/notifications/sms', data)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.sendSms(templateId, phoneNo, personalisation)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get notification by id', function(done) {

        var urlBase = 'http://localhost',
          notificationId = 'wfdfdgf',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications/' + notificationId)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotificationById(notificationId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all notifications', function(done) {

        var urlBase = 'http://localhost',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications')
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotifications()
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all notifications with a reference', function(done) {

        var urlBase = 'http://localhost',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';
          reference = 'myref'
        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications?reference=' + reference)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotifications(undefined, undefined, reference)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all failed notifications', function(done) {

        var urlBase = 'http://localhost',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';
          status = 'failed';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications?status=' + status)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotifications(undefined, 'failed')
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all failed sms notifications', function(done) {

        var urlBase = 'http://localhost',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';
          templateType = 'sms'
          status = 'failed';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications?template_type=' + templateType + '&status=' + status)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotifications(templateType, status)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all delivered sms notifications with a reference', function(done) {

        var urlBase = 'http://localhost',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';
          templateType = 'sms'
          status = 'delivered';
          reference = 'myref'

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications?template_type=' + templateType + '&status=' + status + '&reference=' + reference)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotifications(templateType, status, reference)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get all failed email notifications with a reference older than a given notification', function(done) {

        var urlBase = 'http://localhost',
          notifyClient,
          serviceId = 'c745a8d8-b48a-4b0d-96e5-dbea0165ebd1',
          apiKeyId = '8b3aa916-ec82-434e-b0c5-d5d9b371d6a3';
          templateType = 'sms';
          status = 'delivered';
          reference = 'myref';
          olderThanId = '35836a9e-5a97-4d99-8309-0c5a2c3dbc72';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/v2/notifications/', apiKeyId, serviceId)
            }})
          .get('/v2/notifications?template_type=' + templateType +
               '&status=' + status +
               '&reference=' + reference +
               '&older_than=' + olderThanId
              )
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
        notifyClient.getNotifications(templateType, status, reference, olderThanId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

});
