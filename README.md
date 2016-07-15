[![Build Status](https://travis-ci.org/alphagov/notifications-node-client.svg)](https://travis-ci.org/alphagov/notifications-node-client)
[![Dependency Status](https://david-dm.org/alphagov/notifications-node-client.svg)](https://david-dm.org/alphagov/notifications-node-client)

Work in progress GOV.UK Notify Node.js client. Usage:

```javascript
var request = require('request');
var createGOVUKNotifyToken = require('notifications-node-client');
var yourServiceID = 123;
var yourAPIKey = 'SECRET--DO NOT CHECK IN!';

// GET request
var token = createGOVUKNotifyToken(yourAPIKey, yourServiceID);

request(
  {
    method: 'GET',
    url: 'https://api.notify.works/notifications/sms',
    headers: {
      'Content-type': "application/json",
      "Authorization": "Bearer " + token
    }
  },
  function(error, response, body) {
    console.log(error, response, body);
  }
);


// POST request
var token = createGOVUKNotifyToken(yourAPIKey, yourServiceID);

request(
  {
    method: 'POST',
    url: 'https://api.notify.works/notifications/sms',
    headers: {
      'Content-type': "application/json",
      "Authorization": "Bearer " + token
    },
    body: "{content:'Hello world'}"
  },
  function(error, response, body) {
    console.log(error, response, body);
  }
);

```
