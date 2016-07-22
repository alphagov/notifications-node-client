var ApiClient = require('./api_client'),
  _ = require('underscore');

/**
 *
 * @param baseUrl
 * @param clientId
 * @param secret
 *
 * @constructor
 */
function NotifyClient(baseUrl, clientId, secret) {
  this.apiClient = new ApiClient(baseUrl, clientId, secret);
}

/**
 *
 * @param {String} templateId
 * @param {String} to
 * @param {Object} personalisation
 *
 * @returns {Object}
 */
function createNotificationPayload(templateId, to, personalisation) {
  var payload = {
    template: templateId,
    to: to
  };

  if (!!personalisation) {
    payload.personalisation = personalisation;
  }

  return payload;
}

_.extend(NotifyClient.prototype, {
  /**
   * Usage:
   *
   * notifyClient = new NotifyClient(urlBase, clientId, secret);
   *
   * notifyClient.sendEmail(templateId, email, personalisation)
   *    .then(function (response) {
   *       //do stuff with response
   *     })
   *     .catch(function (error) {
   *       //deal with errors here
   *     });
   *
   *
   * @param {String} templateId
   * @param {String} emailAddress
   * @param {Object} personalisation
   *
   * @returns {Promise}
   */
  sendEmail: function (templateId, emailAddress, personalisation) {
    return this.apiClient.post('/notifications/email',
      createNotificationPayload(templateId, emailAddress, personalisation));
  },

  /**
   *
   * @param {String} templateId
   * @param {String} phoneNumber
   * @param {Object} personalisation
   *
   * @returns {Promise}
   */
  sendSms: function (templateId, phoneNumber, personalisation) {
    return this.apiClient.post('/notifications/sms',
      createNotificationPayload(templateId, phoneNumber, personalisation));
  },

  /**
   *
   * @param {String} notificationId
   *
   * @returns {Promise}
   */
  getNotificationById: function(notificationId) {
    return this.apiClient.get('/notifications/' + notificationId);
  }
});

module.exports = {
  NotifyClient: NotifyClient
};