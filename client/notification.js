var ApiClient = require('./api_client'),
  _ = require('underscore');

/**
 *
 * @param baseUrl
 * @param serviceId
 * @param apiKeyId
 *
 * @constructor
 */
function NotifyClient() {
  this.apiClient = new (Function.prototype.bind.apply(
      ApiClient,
      [null].concat(Array.prototype.slice.call(arguments))
  ));
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
   * notifyClient = new NotifyClient(urlBase, serviceId, apiKeyId);
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
  },

  /**
   *
   * @returns {Promise}
   */
  getNotifications: function(){return this.apiClient.get('/notifications')}
});

module.exports = {
  NotifyClient: NotifyClient
};
