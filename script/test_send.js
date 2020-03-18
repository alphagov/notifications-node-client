var argv = require('optimist')
    .usage('Usage: $0' +
      ' -b [baseUrl]' +
      ' -s [notify secret]' +
      ' -t [templateId]' +
      ' -d [destination (email address or phone number, not needed for letters]' +
      ' -p [personalisation (required for letter {"address_line_1": "mrs test", "address_line_2": "1 test street", "postcode": "SW1 1AA"})]' +
      ' -m [type (email, sms or letter, default email)]')
    .demand(['s', 't'])
    .argv,
  NotifyClient = require('../client/notification').NotifyClient,
  notifyClient,

  baseUrl = argv.b || 'https://api.notifications.service.gov.uk',
  secret = argv.s,
  templateId = argv.t,
  destination = argv.d,
  personalisation = argv.p ? JSON.parse(argv.p) : null,
  type = argv.m || 'email';

notifyClient = new NotifyClient(baseUrl, secret);

switch(type) {

  case 'email':
    notifyClient.sendEmail(templateId, destination, personalisation)
      .then(function(response) {
        console.log('Notify response: ' + JSON.stringify(response));
      })
      .catch(function(error) {
        console.log('Error ' + error);
      });
    break;

  case 'sms':
    notifyClient.sendSms(templateId, String(destination), personalisation)
      .then(function(response) {
        console.log('Notify response: ' + JSON.stringify(response));
      })
      .catch(function(error) {
        console.log('Error ' + error);
      });
    break;

  case 'letter':
    notifyClient.sendLetter(templateId, personalisation)
      .then(function(response) {
        console.log('Notify response: ' + JSON.stringify(response));
      })
      .catch(function(error) {
        console.log('Error ' + error);
      });
    break;

  default:
    console.log('Unrecognised notification type');
}
