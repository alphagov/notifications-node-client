[![Build Status](https://travis-ci.org/alphagov/notifications-node-client.svg)](https://travis-ci.org/alphagov/notifications-node-client)
[![Dependency Status](https://david-dm.org/alphagov/notifications-node-client.svg)](https://david-dm.org/alphagov/notifications-node-client)

Work in progress GOV.UK Notify Node.js client

Usage:
```javascript
var request = require('request');
var createGOVUKNotifyToken = require('notifications-node-client');
var yourServiceID = 123;
var yourAPIKey = 'SECRET--DO NOT CHECK IN!';

// without payload
var token = createGOVUKNotifyToken("GET", "/notifications/sms", yourAPIKey, yourServiceID);

// with payload
var token = createGOVUKNotifyToken("POST", "/notifications/sms", yourAPIKey, yourServiceID, "{content:'Hello world'}");

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
```
