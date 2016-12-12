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
function createNotificationPayload(type, templateId, to, personalisation) {

  var payload = {
    template_id: templateId
  };

  if (type == 'email') {
    payload.email_address = to
  } else if (type == 'sms') {
    payload.phone_number = to
  }


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
    return this.apiClient.post('/v2/notifications/email',
      createNotificationPayload('email', templateId, emailAddress, personalisation));
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
    return this.apiClient.post('/v2/notifications/sms',
      createNotificationPayload('sms', templateId, phoneNumber, personalisation));
  },

  /**
   *
   * @param {String} notificationId
   *
   * @returns {Promise}
   */
  getNotificationById: function(notificationId) {
    return this.apiClient.get('/v2/notifications/' + notificationId);
  },

  /**
   *
   * @returns {Promise}
   */
  getNotifications: function(){return this.apiClient.get('/v2/notifications')}
});

module.exports = {
  NotifyClient: NotifyClient
};
