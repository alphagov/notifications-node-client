var expect = require('chai').expect, NotifyClient = require('../client/notification.js').NotifyClient,
    nock = require('nock'),
    createGovukNotifyToken = require('../client/authentication.js');


describe('notification api', function() {

    it('should send an email', function(done) {

        var urlBase = 'http://base',
          email = 'dom@example.com',
          templateId = '123',
          personalisation = {foo: 'bar'},
          data = {
              template: templateId,
              to: email,
              personalisation: personalisation
          },
          notifyClient,
          clientId = 123,
          secret = 'SECRET';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/notifications/email', secret, clientId)
            }})
            .post('/notifications/email', data)
            .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, clientId, secret);
        notifyClient.sendEmail(templateId, email, personalisation)
          .then(function (response) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it('should send an sms', function(done) {

        var urlBase = 'http://base',
          phoneNo = '07525755555',
          templateId = '123',
          personalisation = {foo: 'bar'},
          data = {
              template: templateId,
              to: phoneNo,
              personalisation: personalisation
          },
          notifyClient,
          clientId = 123,
          secret = 'SECRET';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/notifications/email', secret, clientId)
            }})
          .post('/notifications/sms', data)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, clientId, secret);
        notifyClient.sendSms(templateId, phoneNo, personalisation)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });

    it('should get notification by id', function(done) {

        var urlBase = 'http://base',
          notificationId = 'wfdfdgf',
          notifyClient,
          clientId = 123,
          secret = 'SECRET';

        nock(urlBase, {
            reqheaders: {
                'Authorization': 'Bearer ' + createGovukNotifyToken('POST', '/notifications/email', secret, clientId)
            }})
          .get('/notifications/' + notificationId)
          .reply(200, {"hooray": "bkbbk"});

        notifyClient = new NotifyClient(urlBase, clientId, secret);
        notifyClient.getNotificationById(notificationId)
          .then(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
          });
    });
});
