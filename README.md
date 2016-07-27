[![Build Status](https://travis-ci.org/alphagov/notifications-node-client.svg)](https://travis-ci.org/alphagov/notifications-node-client)
[![Dependency Status](https://david-dm.org/alphagov/notifications-node-client.svg)](https://david-dm.org/alphagov/notifications-node-client)

Work in progress GOV.UK Notify Node.js client. Usage:

```javascript
var NotifyClient = require('notifications-node-client').NotifyClient,
  notifyClient = new NotifyClient(
    process.env.NOTIFY_BASE_URL,
    process.env.NOTIFY_SERVICE_ID,
    process.env.NOTIFY_SECRET // API Key
  );

module.exports = {
  /**
   * @param {String} templateId
   * @param {String} emailAddress
   * @param {Object} personalisation
   *
   * @returns {Promise}
   */
  sendEmail: function(templateId, emailAddress, personalisation) {
    return notifyClient.sendEmail(templateId, emailAddress, personalisation);
  },

  /**
   * @param {String} templateId
   * @param {String} phoneNumber
   * @param {Object} personalisation
   *
   * @returns {Promise}
   */
  sendSms: function(templateId, phoneNumber, personalisation) {
    return notifyClient.sendSms(templateId, phoneNumber, personalisation);
  }
};

```
