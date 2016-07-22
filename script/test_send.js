var argv = require('optimist')
    .usage('Usage: $0' +
      ' -b [baseUrl]' +
      ' -s [notify secret] ' +
      ' -i [serviceId]' +
      ' -t [templateId] ' +
      ' -d [destination (email address or phone number]' +
      ' -p [personalisation]' +
      ' -m [type (email or sms, default email)]')
    .demand(['s', 'i', 't'])
    .argv,
  NotifyClient = require('../client/notification').NotifyClient,
  notifyClient,

  baseUrl = argv.b || 'https://api.notifications.service.gov.uk',
  secret = argv.s,
  serviceId = argv.i,
  templateId = argv.t,
  destination = argv.d,
  personalisation = argv.p ? JSON.parse(argv.p) : null,
  type = argv.m;

notifyClient = new NotifyClient(baseUrl, serviceId, secret);

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
    notifyClient.sendSms(templateId, destination, personalisation)
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
