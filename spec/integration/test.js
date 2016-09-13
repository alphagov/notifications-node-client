// TODO:
// look into using https://www.npmjs.com/package/jsonschema to validate responses

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const NotifyClient = require('../../client/notification.js').NotifyClient;

chai.should();
chai.use(chaiAsPromised);
const should = chai.should()

// will not run unless flag provided `npm test --integration`
const describer = process.env.npm_config_integration ? describe.only : describe.skip;

describer('notification api with a live service', () => {
  let notifyClient;
  let emailId;
  let smsId;
  const personalisation = { name: 'foo' };
  const email = 'test@example.com';
  const phoneNumber = '07700 900662';

  beforeEach(() => {
    const urlBase = process.env.NOTIFY_API_URL;
    const serviceId = process.env.SERVICE_ID;
    const apiKeyId = process.env.API_KEY;

    notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
  });

  describe('should send', () => {
    it('email', () => {

      const templateId = process.env.EMAIL_TEMPLATE_ID;
      return notifyClient.sendEmail(templateId, email, personalisation).then((response) => {
        response.statusCode.should.equal(201);
        response.body.data.notification.id.should.be.a('string');

        emailId = response.body.data.notification.id
      });
    });

    it('sms', () => {
      const templateId = process.env.SMS_TEMPLATE_ID;

      return notifyClient.sendSms(templateId, phoneNumber, personalisation).then((response) => {
        response.statusCode.should.equal(201)
        response.body.data.notification.id.should.be.a('string');

        smsId = response.body.data.notification.id;
      });
    });
  });

  describe('should retrieve', () => {
    it('email by id', () => {
      should.exist(emailId)

      return notifyClient.getNotificationById(emailId).then((response) => {
        response.should.have.property('statusCode', 200);
        response.body.data.notification.id.should.be.a('string');
      });
    });

    it('sms by id', () => {
      should.exist(smsId)

      return notifyClient.getNotificationById(smsId).then((response) => {
        response.should.have.property('statusCode', 200);
        response.body.data.notification.id.should.be.a('string');
      });
    });

    it('all notifications', () => {
      return notifyClient.getNotifications().then((response) => {
        response.should.have.property('statusCode', 200);
        response.body.notifications.should.be.an('array');
      });
    });
  });
});
