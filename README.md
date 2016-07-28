[![Build Status](https://travis-ci.org/alphagov/notifications-node-client.svg)](https://travis-ci.org/alphagov/notifications-node-client)
[![Dependency Status](https://david-dm.org/alphagov/notifications-node-client.svg)](https://david-dm.org/alphagov/notifications-node-client)

# GOV.UK Notify Node.js client

## Installation
```shell
npm install notifications-node-client
```

## Getting started
```javascript
var NotifyClient = require('notifications-node-client').NotifyClient,

notifyClient = new NotifyClient(
  "https://api.notifications.service.gov.uk",
  process.env.NOTIFY_SERVICE_ID,
  process.env.NOTIFY_SECRET // API Key
);
```

Generate an API key by logging in to
[GOV.UK Notify](https://www.notifications.service.gov.uk) and going to
the _API integration_ page.

You will also find your service ID on the _API integration_ page.

## Send a message

```javascript
notifyClient.sendEmail(templateId, emailAddress, personalisation);
```

```javascript
notifyClient.sendSms(templateId, phoneNumber, personalisation);
```

Find template_id by clicking API info for the template you want to send.

### With personalisation
```javascript
notifyClient.sendSms(templateId, phoneNumber, personalisation={
    'name': 'Amala',
    'reference_number': '300241',
});
