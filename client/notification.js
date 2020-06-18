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

  if (type == 'letter' || personalisation) {
    // personalisation mandatory for letters
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

  let payload = {}

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
  }).join('&');

  return queryString ? '?' + queryString : '';
}

function checkOptionsKeys(allowedKeys, options) {
  let invalidKeys = Object.keys(options).filter((key_name) =>
    !allowedKeys.includes(key_name)
  );

  if (invalidKeys.length) {
    let err_msg = (
      'NotifyClient now uses an options configuration object. Options ' + JSON.stringify(invalidKeys) +
      ' not recognised. Please refer to the README.md for more information on method signatures.'
    )
    return new Error(err_msg);
  }
  return null;
}

function _check_and_encode_file(file, size_limit) {
  if (file.length > size_limit * 1024 * 1024) {
    throw "File is larger than " + String(size_limit) + "MB.";
  }
  return file.toString('base64')
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
   * @param {Object} options
   *
   * @returns {Promise}
   */
  sendEmail: function (templateId, emailAddress, options) {
    options = options || {};
    var err = checkOptionsKeys(['personalisation', 'reference', 'emailReplyToId'], options)
    if (err) {
      return Promise.reject(err);
    }
    var personalisation = options.personalisation || undefined,
      reference = options.reference || undefined,
      emailReplyToId = options.emailReplyToId || undefined;

    return this.apiClient.post('/v2/notifications/email',
      createNotificationPayload('email', templateId, emailAddress, personalisation, reference, emailReplyToId));
  },

  /**
   *
   * @param {String} templateId
   * @param {String} phoneNumber
   * @param {Object} options
   *
   * @returns {Promise}
   */
  sendSms: function (templateId, phoneNumber, options) {
    options = options || {};
    var err = checkOptionsKeys(['personalisation', 'reference', 'smsSenderId'], options)
    if (err) {
      return Promise.reject(err);
    }

    var personalisation = options.personalisation || undefined;
    var reference = options.reference || undefined;
    var smsSenderId = options.smsSenderId || undefined;

    return this.apiClient.post('/v2/notifications/sms',
      createNotificationPayload('sms', templateId, phoneNumber, personalisation, reference, smsSenderId));
  },

  /**
   *
   * @param {String} templateId
   * @param {Object} options
   *
   * @returns {Promise}
   */
  sendLetter: function (templateId, options) {
    options = options || {};
    var err = checkOptionsKeys(['personalisation', 'reference'], options)
    if (err) {
      return Promise.reject(err);
    }
    var personalisation = options.personalisation || undefined;
    var reference = options.reference || undefined;

    return this.apiClient.post('/v2/notifications/letter',
      createNotificationPayload('letter', templateId, undefined, personalisation, reference));
  },

  sendPrecompiledLetter: function(reference, pdf_file, postage) {
    var postage = postage || undefined
    content = _check_and_encode_file(pdf_file, 5)
    notification = {
      "reference": reference,
      "content": content
    }
    if (postage != undefined) {
      notification["postage"] = postage
    }
    return this.apiClient.post('/v2/notifications/letter', notification);
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
   * @param {String} notificationId
   *
   * @returns {Promise}
   */
  getPdfForLetterNotification: function(notificationId) {
    const url = '/v2/notifications/' + notificationId + '/pdf'

    return this.apiClient.get(url, { encoding: null })
    .then(function(response) {
      var pdf = Buffer.from(response.body, "base64")
      return pdf
    });
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
    let templateQuery = ''

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

    let payload = {}

    if (personalisation) {
      payload.personalisation = personalisation;
    }

    return this.apiClient.post('/v2/template/' + templateId +  '/preview', payload);
  },

  /**
  *
  * @param {String} olderThan
  *
  * @returns {Promise}
  */
  getReceivedTexts: function(olderThan){
    if (olderThan) {
      queryString = '?older_than=' + olderThan;
    } else {
      queryString = '';
    }

    return this.apiClient.get('/v2/received-text-messages' + queryString);
  },

  /**
   *
   * @param {String} url
   */
  setProxy: function(url) {
    this.apiClient.setProxy(url);
  },

  /**
  *
  * @param {Buffer} fileData
  * @param {Boolean} isCsv
  *
  * @returns {Dictionary}
  */
  prepareUpload: function(fileData, isCsv = false) {
    return {
      'file': _check_and_encode_file(fileData, 2),
      'is_csv': isCsv
    }
  },

});

module.exports = {
  NotifyClient: NotifyClient
};
