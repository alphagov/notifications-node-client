const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const NotifyClient = require('../../client/notification.js').NotifyClient;

chai.should();
chai.use(chaiAsPromised);

// will not run unless flag provided `npm test --integration`
describer = process.env.npm_config_integration ? describe : describe.skip

describer('notification api with a live service', function() {
  let notifyClient;
  const personalisation = { name: 'foo' };
  const email = 'test@example.com';
  const phoneNumber = '07700 900662';

  beforeEach(function(){
    const urlBase = process.env.NOTIFY_API_URL;
    const serviceId = process.env.SERVICE_ID;
    const apiKeyId = process.env.API_KEY;

    notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
  });

  it('should send an email', function() {
    const templateId = process.env.EMAIL_TEMPLATE_ID;
    return Promise.all([
      notifyClient.sendEmail(templateId, email, personalisation).should.be.fulfilled
    ]);
  });

  it('should send an sms', function() {
    const templateId = process.env.SMS_TEMPLATE_ID;
    return notifyClient.sendSms(templateId, phoneNumber).should.be.fulfilled;
  });
});
