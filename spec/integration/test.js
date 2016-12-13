const NotifyClient = require('../../client/notification.js').NotifyClient;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiJsonSchema = require('chai-json-schema');
chai.use(chaiAsPromised);
chai.use(chaiJsonSchema);

const should = chai.should();
const expect = chai.expect;

// will not run unless flag provided `npm test --integration`
const describer = process.env.npm_config_integration ? describe.only : describe.skip;

describer('notification api with a live service', () => {
  let notifyClient;
  let emailNotificationId;
  let smsNotificationId;
  const personalisation = { name: 'Foo' };
  const clientRef = 'client-ref';
  const email = process.env.FUNCTIONAL_TEST_EMAIL;
  const phoneNumber = process.env.FUNCTIONAL_TEST_NUMBER;

  beforeEach(() => {

    const urlBase = process.env.NOTIFY_API_URL;
    const serviceId = process.env.SERVICE_ID;
    const apiKeyId = process.env.API_KEY;
    notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
    var definitions_json = require('./schemas/v2/definitions.json');
    chai.tv4.addSchema('definitions.json', definitions_json);

  });

  describe('should send', () => {

    it('email', () => {

      var post_notification_return_email_json = require('./schemas/v2/POST_notification_email_response.json');
      const emailTemplateId = process.env.EMAIL_TEMPLATE_ID;
      return notifyClient.sendEmail(emailTemplateId, email, personalisation, clientRef).then((response) => {
        response.statusCode.should.equal(201);
        expect(response.body).to.be.jsonSchema(post_notification_return_email_json);
        response.body.content.body.should.equal('Hello Foo\n\nFunctional test help make our world a better place');
        response.body.content.subject.should.equal('Functional Tests are good');
        response.body.reference.should.equal(clientRef);
        emailNotificationId = response.body.id;
      });

    });

    it('sms', () => {

      var post_notification_return_sms_json = require('./schemas/v2/POST_notification_sms_response.json');
      const smsTemplateId = process.env.SMS_TEMPLATE_ID;
      return notifyClient.sendSms(smsTemplateId, phoneNumber, personalisation).then((response) => {
        response.statusCode.should.equal(201);
        expect(response.body).to.be.jsonSchema(post_notification_return_sms_json);
        response.body.content.body.should.equal('Hello Foo\n\nFunctional Tests make our world a better place');
        smsNotificationId = response.body.id;
      });

    });

  });

  describe('should retrieve', () => {

    var notification_json = require('./schemas/v2/GET_notification_response.json');

    it('email by id', () => {

      should.exist(emailNotificationId)
      return notifyClient.getNotificationById(emailNotificationId).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(notification_json);
        response.body.type.should.equal('email');
      });

    });

    it('sms by id', () => {

      should.exist(smsNotificationId)
      return notifyClient.getNotificationById(smsNotificationId).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(notification_json);
        response.body.type.should.equal('sms');
      });

    });

    it('all notifications', () => {

      var notification_json = require('./schemas/v2/GET_notification_response.json');
      chai.tv4.addSchema('notification.json', notification_json);
      var get_notifications_return_json = require('./schemas/v2/GET_notifications_response.json');
      return notifyClient.getNotifications().then((response) => {
        response.should.have.property('statusCode', 200);
        expect(response.body).to.be.jsonSchema(get_notifications_return_json);
      });

    });

  });

});
