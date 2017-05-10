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
  const smsTemplateId = process.env.SMS_TEMPLATE_ID;
  const emailTemplateId = process.env.EMAIL_TEMPLATE_ID;

  beforeEach(() => {

    const urlBase = process.env.NOTIFY_API_URL;
    const serviceId = process.env.SERVICE_ID;
    const apiKeyId = process.env.API_KEY;
    notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
    var definitions_json = require('./schemas/v2/definitions.json');
    chai.tv4.addSchema('definitions.json', definitions_json);

  });

  describe('notifications', () => {

    it('send email notification', () => {
      var postEmailNotificationResponseJson = require('./schemas/v2/POST_notification_email_response.json');
      return notifyClient.sendEmail(emailTemplateId, email, personalisation, clientRef).then((response) => {
        response.statusCode.should.equal(201);
        expect(response.body).to.be.jsonSchema(postEmailNotificationResponseJson);
        response.body.content.body.should.equal('Hello Foo\n\nFunctional test help make our world a better place');
        response.body.content.subject.should.equal('Functional Tests are good');
        response.body.reference.should.equal(clientRef);
        emailNotificationId = response.body.id;
      })
    });

    it('send sms notification', () => {
      var postSmsNotificationResponseJson = require('./schemas/v2/POST_notification_sms_response.json');
      return notifyClient.sendSms(smsTemplateId, phoneNumber, personalisation).then((response) => {
        response.statusCode.should.equal(201);
        expect(response.body).to.be.jsonSchema(postSmsNotificationResponseJson);
        response.body.content.body.should.equal('Hello Foo\n\nFunctional Tests make our world a better place');
        smsNotificationId = response.body.id;
      });
    });

    var getNotificationJson = require('./schemas/v2/GET_notification_response.json');
    var getNotificationsJson = require('./schemas/v2/GET_notifications_response.json');

    it('get email notification by id', () => {
      should.exist(emailNotificationId)
      return notifyClient.getNotificationById(emailNotificationId).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getNotificationJson);
        response.body.type.should.equal('email');
        response.body.body.should.equal('Hello Foo\n\nFunctional test help make our world a better place');
        response.body.subject.should.equal('Functional Tests are good');
      });
    });

    it('get sms notification by id', () => {
      should.exist(smsNotificationId)
      return notifyClient.getNotificationById(smsNotificationId).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getNotificationJson);
        response.body.type.should.equal('sms');
        response.body.body.should.equal('Hello Foo\n\nFunctional Tests make our world a better place');
      });
    });

    it('get all notifications', () => {
      chai.tv4.addSchema('notification.json', getNotificationJson);
      return notifyClient.getNotifications().then((response) => {
        response.should.have.property('statusCode', 200);
        expect(response.body).to.be.jsonSchema(getNotificationsJson);
      });
    });

  });

  describe('templates', () => {

    var getTemplateJson = require('./schemas/v2/GET_template_by_id.json');
    var getTemplatesJson = require('./schemas/v2/GET_templates_response.json');
    var postTemplatePreviewJson = require('./schemas/v2/POST_template_preview.json');

    it('get sms template by id', () => {
      return notifyClient.getTemplateById(smsTemplateId).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplateJson);
        should.not.exist(response.body.subject);
      });
    });

    it('get email template by id', () => {
      return notifyClient.getTemplateById(emailTemplateId).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplateJson);
        response.body.body.should.equal('Hello ((name))\n\nFunctional test help make our world a better place');
        response.body.subject.should.equal('Functional Tests are good');
      });
    });

    it('get sms template by id and version', () => {
      return notifyClient.getTemplateByIdAndVersion(smsTemplateId, 1).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplateJson);
        should.not.exist(response.body.subject);
        response.body.version.should.equal(1);
      });
    });

    it('get email template by id and version', () => {
      return notifyClient.getTemplateByIdAndVersion(emailTemplateId, 1).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplateJson);
        response.body.version.should.equal(1);
      });
    });

    it('get all templates', () => {
      return notifyClient.getAllTemplates().then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('get sms templates', () => {
      return notifyClient.getAllTemplates('sms').then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('get email templates', () => {
      return notifyClient.getAllTemplates('email').then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('preview sms template', () => {
      var personalisation = { "name": "Foo" }
      return notifyClient.previewTemplateById(smsTemplateId, personalisation).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(postTemplatePreviewJson);
        response.body.type.should.equal('sms');
        should.not.exist(response.body.subject);
      });
    });

    it('preview email template', () => {
      var personalisation = { "name": "Foo" }
      return notifyClient.previewTemplateById(emailTemplateId, personalisation).then((response) => {
        response.statusCode.should.equal(200);
        expect(response.body).to.be.jsonSchema(postTemplatePreviewJson);
        response.body.type.should.equal('email');
        should.exist(response.body.subject);
      });
    });

  });

});
