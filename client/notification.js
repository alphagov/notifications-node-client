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
 * @param {String} type
 * @param {String} templateId
 * @param {String} to
 * @param {Object} personalisation
 * @param {String} reference
 * @param {String} replyToId
 *
 * @returns {Object}
 */
function createNotificationPayload(type, templateId, to, personalisation, reference, replyToId) {

  var payload = {
    template_id: templateId
  };

  if (type == 'email') {
    payload.email_address = to;
  } else if (type == 'sms') {
    payload.phone_number = to;
  } 

  if (type == 'letter') {
    // personalisation mandatory for letters
    payload.personalisation = personalisation;
  } else if (!!personalisation) {
    payload.personalisation = personalisation;
  }

  if (reference) {
    payload.reference = reference;
  }

  if (replyToId && type == 'email') {
    payload.email_reply_to_id = replyToId;
  } else if (replyToId && type == 'sms') {
    payload.sms_sender_id = replyToId;
  }

  return payload;
}

/**
 *
 * @param {String} templateType
 * @param {String} status
 * @param {String} reference
 * @param {String} olderThanId
 *
 * @returns {String}
 */
function buildGetAllNotificationsQuery(templateType, status, reference, olderThanId) {

  payload = {}

  if (templateType) {
    payload.template_type = templateType;
  }

  if (status) {
    payload.status = status;
  }

  if (reference) {
    payload.reference = reference;
  }

  if (olderThanId) {
    payload.older_than = olderThanId;
  }

  return buildQueryStringFromDict(payload);
}

function buildQueryStringFromDict(dictionary) {
  var queryString = Object.keys(dictionary).map(function(key) {
    return [key, dictionary[key]].map(encodeURIComponent).join("=");
  }).join("&");

  return queryString ? '?' + queryString : '';
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
   * @param {String} reference
   * @param {String} emailReplyToId
   *
   * @returns {Promise}
   */
  sendEmail: function (templateId, emailAddress, personalisation, reference, emailReplyToId) {
    return this.apiClient.post('/v2/notifications/email',
      createNotificationPayload('email', templateId, emailAddress, personalisation, reference, emailReplyToId));
  },

  /**
   *
   * @param {String} templateId
   * @param {String} phoneNumber
   * @param {Object} personalisation
   * @param {String} reference
   * @param {String} smsSenderId
   *
   * @returns {Promise}
   */
  sendSms: function (templateId, phoneNumber, personalisation, reference, smsSenderId) {
    return this.apiClient.post('/v2/notifications/sms',
      createNotificationPayload('sms', templateId, phoneNumber, personalisation, reference, smsSenderId));
  },

  /**
   *
   * @param {String} templateId
   * @param {Object} personalisation
   * @param {String} reference
   *
   * @returns {Promise}
   */
  sendLetter: function (templateId, personalisation, reference) {
    return this.apiClient.post('/v2/notifications/letter',
      createNotificationPayload('letter', templateId, undefined, personalisation, reference));
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
   * @param {String} templateType
   * @param {String} status
   * @param {String} reference
   * @param {String} olderThanId
   *
   * @returns {Promise}
   *
   */
  getNotifications: function(templateType, status, reference, olderThanId) {
    return this.apiClient.get('/v2/notifications' + buildGetAllNotificationsQuery(templateType, status, reference, olderThanId));
  },

  /**
   *
   * @param {String} templateId
   *
   * @returns {Promise}
   */
  getTemplateById: function(templateId) {
    return this.apiClient.get('/v2/template/' + templateId);
  },

  /**
   *
   * @param {String} templateId
   * @param {Integer} version
   *
   * @returns {Promise}
   */
  getTemplateByIdAndVersion: function(templateId, version) {
    return this.apiClient.get('/v2/template/' + templateId + '/version/' + version);
  },

  /**
   *
   * @param {String} type
   *
   * @returns {Promise}
   */
  getAllTemplates: function(templateType) {
    templateQuery = ''

    if (templateType) {
      templateQuery = '?type=' + templateType;
    }

    return this.apiClient.get('/v2/templates' + templateQuery);
  },

  /**
   *
   * @param {String} templateId
   * @param {Dictionary} personalisation
   *
   * @returns {Promise}
   */
  previewTemplateById: function(templateId, personalisation) {

    payload = {}

    if (!!personalisation) {
      payload.personalisation = personalisation;
    }

    return this.apiClient.post('/v2/template/' + templateId +  '/preview', payload);
  },

  /**
   *
   * @param {String} url
   */
  setProxy: function(url) {
    this.apiClient.setProxy(url);
  }
});

module.exports = {
  NotifyClient: NotifyClient
};
