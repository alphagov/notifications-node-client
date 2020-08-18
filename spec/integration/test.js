const fs = require('fs');
const NotifyClient = require('../../client/notification.js').NotifyClient;

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiJsonSchema = require('chai-json-schema');
const chaiBytes = require('chai-bytes');
chai.use(chaiAsPromised);
chai.use(chaiJsonSchema);
chai.use(chaiBytes);

const should = chai.should();
const expect = chai.expect;

// will not run unless flag provided `npm test --integration`
const describer = process.env.npm_config_integration ? describe.only : describe.skip;

function make_random_id() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

describer('notification api with a live service', function () {
  // default is 2000 (ms) - api is sometimes slower than this :(
  this.timeout(40000)

  let notifyClient;
  let teamNotifyClient;
  let emailNotificationId;
  let smsNotificationId;
  let letterNotificationId;
  const personalisation = { name: 'Foo' };
  const clientRef = 'client-ref';
  const email = process.env.FUNCTIONAL_TEST_EMAIL;
  const phoneNumber = process.env.FUNCTIONAL_TEST_NUMBER;
  const letterContact = {
    address_line_1: make_random_id(),
    address_line_2: 'Foo',
    postcode: 'SW1 1AA',
  };
  const smsTemplateId = process.env.SMS_TEMPLATE_ID;
  const smsSenderId = process.env.SMS_SENDER_ID || undefined;
  const emailTemplateId = process.env.EMAIL_TEMPLATE_ID;
  const emailReplyToId = process.env.EMAIL_REPLY_TO_ID || undefined;
  const letterTemplateId = process.env.LETTER_TEMPLATE_ID;

  beforeEach(() => {

    const urlBase = process.env.NOTIFY_API_URL;
    const apiKeyId = process.env.API_KEY
    const inboundSmsKeyId = process.env.INBOUND_SMS_QUERY_KEY;
    const teamApiKeyId = process.env.API_SENDING_KEY;
    notifyClient = new NotifyClient(urlBase, apiKeyId);
    teamNotifyClient = new NotifyClient(urlBase, teamApiKeyId);
    receivedTextClient = new NotifyClient(urlBase, inboundSmsKeyId);
    var definitions_json = require('./schemas/v2/definitions.json');
    chai.tv4.addSchema('definitions.json', definitions_json);

  });

  describe('notifications', () => {
    it('send email notification', () => {
      var postEmailNotificationResponseJson = require('./schemas/v2/POST_notification_email_response.json'),
        options = {personalisation: personalisation, reference: clientRef};

      return notifyClient.sendEmail(emailTemplateId, email, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postEmailNotificationResponseJson);
        response.data.content.body.should.equal('Hello Foo\r\n\r\nFunctional test help make our world a better place');
        response.data.content.subject.should.equal('Functional Tests are good');
        response.data.reference.should.equal(clientRef);
        emailNotificationId = response.data.id;
      })
    });

    it('send email notification with email_reply_to_id', () => {
      var postEmailNotificationResponseJson = require('./schemas/v2/POST_notification_email_response.json'),
        options = {personalisation: personalisation, reference: clientRef, emailReplyToId: emailReplyToId};

      should.exist(emailReplyToId);
      return notifyClient.sendEmail(emailTemplateId, email, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postEmailNotificationResponseJson);
        response.data.content.body.should.equal('Hello Foo\r\n\r\nFunctional test help make our world a better place');
        response.data.content.subject.should.equal('Functional Tests are good');
        response.data.reference.should.equal(clientRef);
        emailNotificationId = response.data.id;
      })
    });

    it('send email notification with document upload', () => {
      var postEmailNotificationResponseJson = require('./schemas/v2/POST_notification_email_response.json'),
        options = {personalisation: { name: 'Foo', documents:
          notifyClient.prepareUpload(Buffer.from("%PDF-1.5 testpdf"))
        }, reference: clientRef};

      return notifyClient.sendEmail(emailTemplateId, email, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postEmailNotificationResponseJson);
        response.data.content.body.should.equal('Hello Foo\r\n\r\nFunctional test help make our world a better place');
        response.data.content.subject.should.equal('Functional Tests are good');
        response.data.reference.should.equal(clientRef);
        emailNotificationId = response.data.id;
      })
    });

    it('send email notification with CSV document upload', () => {
      var postEmailNotificationResponseJson = require('./schemas/v2/POST_notification_email_response.json'),
        options = {personalisation: { name: 'Foo', documents:
          notifyClient.prepareUpload(Buffer.from("a,b"), true)
        }, reference: clientRef};

      return notifyClient.sendEmail(emailTemplateId, email, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postEmailNotificationResponseJson);
        response.data.content.body.should.equal('Hello Foo\r\n\r\nFunctional test help make our world a better place');
        response.data.content.subject.should.equal('Functional Tests are good');
        response.data.reference.should.equal(clientRef);
        emailNotificationId = response.data.id;
      })
    });

    it('send sms notification', () => {
      var postSmsNotificationResponseJson = require('./schemas/v2/POST_notification_sms_response.json'),
        options = {personalisation: personalisation};

      return notifyClient.sendSms(smsTemplateId, phoneNumber, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postSmsNotificationResponseJson);
        response.data.content.body.should.equal('Hello Foo\n\nFunctional Tests make our world a better place');
        smsNotificationId = response.data.id;
      });
    });

    it('send sms notification with sms_sender_id', () => {
      var postSmsNotificationResponseJson = require('./schemas/v2/POST_notification_sms_response.json'),
        options = {personalisation: personalisation, reference: clientRef, smsSenderId: smsSenderId};

      should.exist(smsSenderId);
      return teamNotifyClient.sendSms(smsTemplateId, phoneNumber, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postSmsNotificationResponseJson);
        response.data.content.body.should.equal('Hello Foo\n\nFunctional Tests make our world a better place');
        smsNotificationId = response.data.id;
      });
    });

    it('send letter notification', () => {
      var postLetterNotificationResponseJson = require('./schemas/v2/POST_notification_letter_response.json'),
        options = {personalisation: letterContact};

      return notifyClient.sendLetter(letterTemplateId, options).then((response) => {
        response.status.should.equal(201);
        expect(response.data).to.be.jsonSchema(postLetterNotificationResponseJson);
        response.data.content.body.should.equal('Hello ' + letterContact.address_line_1);
        letterNotificationId = response.data.id;
      });
    });

    it('send a precompiled letter notification', () => {
      var postPrecompiledLetterNotificationResponseJson = require(
          './schemas/v2/POST_notification_precompiled_letter_response.json'
      );
      fs.readFile('./spec/integration/test_files/one_page_pdf.pdf', function(err, pdf_file) {
        return notifyClient.sendPrecompiledLetter("my_reference", pdf_file, "first")
        .then((response) => {
          response.status.should.equal(201);
          expect(response.data).to.be.jsonSchema(postPrecompiledLetterNotificationResponseJson);
          letterNotificationId = response.data.id;
        })
      });
    });

    var getNotificationJson = require('./schemas/v2/GET_notification_response.json');
    var getNotificationsJson = require('./schemas/v2/GET_notifications_response.json');

    it('get email notification by id', () => {
      should.exist(emailNotificationId)
      return notifyClient.getNotificationById(emailNotificationId).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getNotificationJson);
        response.data.type.should.equal('email');
        response.data.body.should.equal('Hello Foo\r\n\r\nFunctional test help make our world a better place');
        response.data.subject.should.equal('Functional Tests are good');
      });
    });

    it('get sms notification by id', () => {
      should.exist(smsNotificationId)
      return notifyClient.getNotificationById(smsNotificationId).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getNotificationJson);
        response.data.type.should.equal('sms');
        response.data.body.should.equal('Hello Foo\n\nFunctional Tests make our world a better place');
      });
    });

    it('get letter notification by id', () => {
      should.exist(letterNotificationId)
      return notifyClient.getNotificationById(letterNotificationId).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getNotificationJson);
        response.data.type.should.equal('letter');
        response.data.body.should.equal('Hello ' + letterContact.address_line_1);
      });
    });

    it('get a letter pdf', (done) => {
      should.exist(letterNotificationId)
      pdf_contents = fs.readFileSync('./spec/integration/test_files/one_page_pdf.pdf');
      var count = 0
      // it takes a while for the pdf for a freshly sent letter to become ready, so we need to retry the promise
      // a few times, and apply delay in between the attempts. Since our function returns a promise,
      // and it's asynchronous, we cannot use a regular loop to do that. That's why we envelop our promise in a
      // function which we call up to 7 times or until the promise is resolved.
      const tryClient = () => {
        return notifyClient.getPdfForLetterNotification(letterNotificationId)
        .then((file_buffer) => {
          expect(pdf_contents).to.equalBytes(file_buffer);
          done();
        })
        .catch((err) => {
          if (err.constructor.name === 'AssertionError') {
            done(err);
          }
          if (err.response.data && (err.response.data.errors[0].error === "PDFNotReadyError")) {
            count += 1
            if (count < 7) {
              setTimeout(tryClient, 5000)
            } else {
              done(new Error('Too many PDFNotReadyError errors'));
            }
          };
        })
      };
      tryClient()

    });

    it('get all notifications', () => {
      chai.tv4.addSchema('notification.json', getNotificationJson);
      return notifyClient.getNotifications().then((response) => {
        response.should.have.property('status', 200);
        expect(response.data).to.be.jsonSchema(getNotificationsJson);
      });
    });

  });

  describe('templates', () => {

    var getTemplateJson = require('./schemas/v2/GET_template_by_id.json');
    var getTemplatesJson = require('./schemas/v2/GET_templates_response.json');
    var postTemplatePreviewJson = require('./schemas/v2/POST_template_preview.json');
    var getReceivedTextJson = require('./schemas/v2/GET_received_text_response.json');
    var getReceivedTextsJson = require('./schemas/v2/GET_received_texts_response.json');

    it('get sms template by id', () => {
      return notifyClient.getTemplateById(smsTemplateId).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplateJson);
        response.data.name.should.equal('Client Functional test sms template');
        should.not.exist(response.data.subject);
        should.not.exist(response.data.letter_contact_block);
      });
    });

    it('get email template by id', () => {
      return notifyClient.getTemplateById(emailTemplateId).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplateJson);
        response.data.body.should.equal('Hello ((name))\r\n\r\nFunctional test help make our world a better place');
        response.data.name.should.equal('Client Functional test email template');
        response.data.subject.should.equal('Functional Tests are good');
        should.not.exist(response.data.letter_contact_block);
      });
    });

    it('get letter template by id', () => {
      return notifyClient.getTemplateById(letterTemplateId).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplateJson);
        response.data.body.should.equal('Hello ((address_line_1))');
        response.data.name.should.equal('Client functional letter template');
        response.data.subject.should.equal('Main heading');
        response.data.letter_contact_block.should.equal(
          'Government Digital Service\nThe White Chapel Building\n' +
          '10 Whitechapel High Street\nLondon\nE1 8QS\nUnited Kingdom'
        );
      });
    });

    it('get sms template by id and version', () => {
      return notifyClient.getTemplateByIdAndVersion(smsTemplateId, 1).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplateJson);
        response.data.name.should.equal('Example text message template');
        should.not.exist(response.data.subject);
        response.data.version.should.equal(1);
        should.not.exist(response.data.letter_contact_block);
      });
    });

    it('get email template by id and version', () => {
      return notifyClient.getTemplateByIdAndVersion(emailTemplateId, 1).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplateJson);
        response.data.name.should.equal('Client Functional test email template');
        response.data.version.should.equal(1);
      });
    });

    it('get letter template by id and version', () => {
      return notifyClient.getTemplateByIdAndVersion(letterTemplateId, 1).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplateJson);
        response.data.name.should.equal('Untitled');
        response.data.version.should.equal(1);
        // version 1 of the template had no letter_contact_block
        should.not.exist(response.data.letter_contact_block);
      });
    });

    it('get all templates', () => {
      return notifyClient.getAllTemplates().then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('get sms templates', () => {
      return notifyClient.getAllTemplates('sms').then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('get email templates', () => {
      return notifyClient.getAllTemplates('email').then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('get letter templates', () => {
      return notifyClient.getAllTemplates('letter').then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getTemplatesJson);
      });
    });

    it('preview sms template', () => {
      var personalisation = { "name": "Foo" }
      return notifyClient.previewTemplateById(smsTemplateId, personalisation).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(postTemplatePreviewJson);
        response.data.type.should.equal('sms');
        should.not.exist(response.data.subject);
      });
    });

    it('preview email template', () => {
      var personalisation = { "name": "Foo" }
      return notifyClient.previewTemplateById(emailTemplateId, personalisation).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(postTemplatePreviewJson);
        response.data.type.should.equal('email');
        should.exist(response.data.subject);
      });
    });

    it('preview letter template', () => {
      var personalisation = { "address_line_1": "Foo", "address_line_2": "Bar", "postcode": "SW1 1AA" }
      return notifyClient.previewTemplateById(letterTemplateId, personalisation).then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(postTemplatePreviewJson);
        response.data.type.should.equal('letter');
        should.exist(response.data.subject);
      });
    });

    it('get all received texts', () => {
      chai.tv4.addSchema('receivedText.json', getReceivedTextJson);
      return receivedTextClient.getReceivedTexts().then((response) => {
        response.status.should.equal(200);
        expect(response.data).to.be.jsonSchema(getReceivedTextsJson);
        expect(response.data["received_text_messages"]).to.be.an('array').that.is.not.empty;
      });
    });

  });

});
