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
  let emailId;
  let smsId;
  const personalisation = { name: 'foo' };
  const email = 'imdad.ahad@digital.cabinet-office.gov.uk';
  const phoneNumber = '07599381777';

  beforeEach(() => {
    const urlBase = process.env.NOTIFY_API_URL;
    const serviceId = process.env.SERVICE_ID;
    const apiKeyId = process.env.API_KEY;
    notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);

    // Load definitions and add schema
    var definitions_json = require('./schemas/definitions.json');
    var email_notification_json = require('./schemas/email_notification.json');
    var sms_notification_json = require('./schemas/sms_notification.json');

    chai.tv4.addSchema('definitions.json', definitions_json);
    chai.tv4.addSchema('email_notification.json', email_notification_json);
    chai.tv4.addSchema('sms_notification.json', sms_notification_json);

  });

  describe('should send', () => {
    var post_notification_return_email_json = require('./schemas/POST_notification_return_email.json');
    it('email', () => {
      const templateId = process.env.EMAIL_TEMPLATE_ID;
      return notifyClient.sendEmail(templateId, email, personalisation).then((response) => {
        expect(response.body).to.be.jsonSchema(post_notification_return_email_json);
        response.statusCode.should.equal(201);
        response.body.data.notification.id.should.be.a('string');
        emailId = response.body.data.notification.id

      });
    });

    it('sms', () => {
      var post_notification_return_sms_json = require('./schemas/POST_notification_return_sms.json');
      const templateId = process.env.SMS_TEMPLATE_ID;
      return notifyClient.sendSms(templateId, phoneNumber, personalisation).then((response) => {
        expect(response.body).to.be.jsonSchema(post_notification_return_sms_json);
        response.statusCode.should.equal(201)
        response.body.data.notification.id.should.be.a('string');
        smsId = response.body.data.notification.id;
      });
    });
  });

  describe('should retrieve', () => {

    it('email by id', () => {
      should.exist(emailId)
      var email_notification_json = require('./schemas/email_notification.json');
      return notifyClient.getNotificationById(emailId).then((response) => {
        expect(response.body.data.notification).to.be.jsonSchema(email_notification_json);
        response.should.have.property('statusCode', 200);
        response.body.data.notification.id.should.be.a('string');
      });
    });

    it('sms by id', () => {
      should.exist(smsId)
      var sms_notification_json = require('./schemas/sms_notification.json');
      return notifyClient.getNotificationById(smsId).then((response) => {
        expect(response.body.data.notification).to.be.jsonSchema(sms_notification_json);
        response.should.have.property('statusCode', 200);
        response.body.data.notification.id.should.be.a('string');
      });
    });

    it('all notifications', () => {
      var get_notifications_return_json = require('./schemas/GET_notifications_return.json');
      return notifyClient.getNotifications().then((response) => {
        expect(response.body).to.be.jsonSchema(get_notifications_return_json);
        response.should.have.property('statusCode', 200);
        response.body.notifications.should.be.an('array');
      });
    });
  });
});
