var ApiClient = require('./api_client');

/**
 * @typedef {"sms" | "letter" | "email"} NotificationType
 */

/**
 * @typedef {"first" | "second" | "economy" | "europe" | "rest-of-world"} PostageType
 */

/**
 * @typedef {Object} TemplateRef
 * @property {string} id
 * @property {number} version
 * @property {string} uri
 */

/**
 * @typedef {Object} NotificationResponse
 * @property {string} id
 * @property {string} [reference]
 * @property {NotificationType} type
 * @property {string} status
 * @property {{id: string, name: string, version: number}} template
 * @property {string} body
 * @property {string} created_at
 * @property {string} [created_by_name]
 * @property {string} [sent_at]
 * @property {string} [completed_at]
 * @property {string} [scheduled_for]
 * @property {string} [one_click_unsubscribe]
 * @property {boolean} is_cost_data_ready
 * @property {number} [cost_in_pounds]
 * @property {{billable_sheets_of_paper?: number, postage?: string} | {billable_sms_fragments?: number, international_rate_multiplier?: number, sms_rate?: number}} [cost_details]
 * @property {string} [email_address]
 * @property {string} [phone_number]
 * @property {string} [subject]
 * @property {string} [line_1]
 * @property {string} [line_2]
 * @property {string} [line_3]
 * @property {string} [line_4]
 * @property {string} [line_5]
 * @property {string} [line_6]
 * @property {string} [line_7]
 * @property {PostageType} [postage]
 */

/**
 * @typedef {Object} TemplateData
 * @property {string} id
 * @property {string} name
 * @property {NotificationType} type
 * @property {string} created_at
 * @property {string | null} updated_at
 * @property {string} created_by
 * @property {number} version
 * @property {string} body
 * @property {string} [subject]
 * @property {string} [letter_contact_block]
 * @property {PostageType} [postage]
 */

/**
 * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
 * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
 * @param {string} [apiKeyId] - API key (3 args)
 * @constructor
 */
function NotifyClient(apiKeyOrUrl, serviceIdOrApiKey, apiKeyId) {
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
 * @param {String} oneClickUnsubscribeURL
 *
 * @returns {Object}
 */
function createNotificationPayload(type, templateId, to, personalisation, reference, replyToId, oneClickUnsubscribeURL) {

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

  if (oneClickUnsubscribeURL && type == 'email') {
    payload.one_click_unsubscribe_url = oneClickUnsubscribeURL;
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
  if (typeof(file) === 'string') {
    file = Buffer.from(file);
  }
  return file.toString('base64')
}

/**
 * @param {string} templateId
 * @param {string} emailAddress
 * @param {{personalisation?: Object, reference?: string, emailReplyToId?: string, oneClickUnsubscribeURL?: string}} [options]
 * @returns {Promise<import('axios').AxiosResponse<{id: string, reference?: string, content: {body: string, subject: string, from_email: string, one_click_unsubscribe_url?: string}, uri: string, template: TemplateRef}>>}
 */
NotifyClient.prototype.sendEmail = function (templateId, emailAddress, options) {
  options = options || {};
  var err = checkOptionsKeys(['personalisation', 'reference', 'emailReplyToId', 'oneClickUnsubscribeURL'], options)
  if (err) {
    return Promise.reject(err);
  }
  var personalisation = options.personalisation || undefined,
    reference = options.reference || undefined,
    emailReplyToId = options.emailReplyToId || undefined,
    oneClickUnsubscribeURL = options.oneClickUnsubscribeURL || undefined;

  return this.apiClient.post('/v2/notifications/email',
    createNotificationPayload('email', templateId, emailAddress, personalisation, reference, emailReplyToId, oneClickUnsubscribeURL));
};

/**
 * @param {string} templateId
 * @param {string} phoneNumber
 * @param {{personalisation?: Object, reference?: string, smsSenderId?: string}} [options]
 * @returns {Promise<import('axios').AxiosResponse<{id: string, reference?: string, content: {body: string, from_number: string}, uri: string, template: TemplateRef}>>}
 */
NotifyClient.prototype.sendSms = function (templateId, phoneNumber, options) {
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
};

/**
 * @param {string} templateId
 * @param {{personalisation?: Object, reference?: string}} [options]
 * @returns {Promise<import('axios').AxiosResponse<{id: string, reference?: string, content: {body: string, subject: string}, uri: string, template: TemplateRef, scheduled_for: string | null}>>}
 */
NotifyClient.prototype.sendLetter = function (templateId, options) {
  options = options || {};
  var err = checkOptionsKeys(['personalisation', 'reference'], options)
  if (err) {
    return Promise.reject(err);
  }
  var personalisation = options.personalisation || undefined;
  var reference = options.reference || undefined;

  return this.apiClient.post('/v2/notifications/letter',
    createNotificationPayload('letter', templateId, undefined, personalisation, reference));
};

/**
 * @param {string} reference
 * @param {Buffer | string} pdf_file
 * @param {"first" | "second" | "economy" | "europe" | "rest-of-world"} [postage]
 * @returns {Promise<import('axios').AxiosResponse<{id: string, reference: string, postage: PostageType}>>}
 */
NotifyClient.prototype.sendPrecompiledLetter = function(reference, pdf_file, postage) {
  var postage = postage || undefined
  var content = _check_and_encode_file(pdf_file, 5)
  var notification = {
    "reference": reference,
    "content": content
  }
  if (postage != undefined) {
    notification["postage"] = postage
  }
  return this.apiClient.post('/v2/notifications/letter', notification);
};

/**
 * @param {string} notificationId
 * @returns {Promise<import('axios').AxiosResponse<NotificationResponse>>}
 */
NotifyClient.prototype.getNotificationById = function(notificationId) {
  return this.apiClient.get('/v2/notifications/' + notificationId);
};

/**
 * @param {string} [templateType]
 * @param {string} [status]
 * @param {string} [reference]
 * @param {string} [olderThanId]
 * @returns {Promise<import('axios').AxiosResponse<{notifications: NotificationResponse[], links: {current: string, next: string}}>>}
 */
NotifyClient.prototype.getNotifications = function(templateType, status, reference, olderThanId) {
  return this.apiClient.get('/v2/notifications' + buildGetAllNotificationsQuery(templateType, status, reference, olderThanId));
};

/**
 * @param {string} notificationId
 * @returns {Promise<Buffer>}
 */
NotifyClient.prototype.getPdfForLetterNotification = function(notificationId) {
  const url = '/v2/notifications/' + notificationId + '/pdf'

  // Unlike other requests, we expect a successful response as an arraybuffer and an error as JSON
  // Axios does not support flexible response types so we will need to handle the error case ourselves below
  return this.apiClient.get(url, { responseType: 'arraybuffer' })
  .then(function(response) {
    var pdf = Buffer.from(response.data, "base64")
    return pdf
  })
  .catch(function(error) {
    // If we receive an error, as the response is an arraybuffer rather than our usual JSON
    // we need to convert it to JSON to be read by the user
    string_of_error_body = new TextDecoder().decode(error.response.data);

    // Then we replace the error data with the JSON error rather than the arraybuffer of the error
    error.response.data = JSON.parse(string_of_error_body);

    // and rethrow to let the user handle the error
    throw error
  });
};

/**
 * @param {string} templateId
 * @returns {Promise<import('axios').AxiosResponse<TemplateData>>}
 */
NotifyClient.prototype.getTemplateById = function(templateId) {
  return this.apiClient.get('/v2/template/' + templateId);
};

/**
 * @param {string} templateId
 * @param {number} version
 * @returns {Promise<import('axios').AxiosResponse<TemplateData>>}
 */
NotifyClient.prototype.getTemplateByIdAndVersion = function(templateId, version) {
  return this.apiClient.get('/v2/template/' + templateId + '/version/' + version);
};

/**
 * @param {NotificationType} [templateType]
 * @returns {Promise<import('axios').AxiosResponse<{templates: TemplateData[]}>>}
 */
NotifyClient.prototype.getAllTemplates = function(templateType) {
  let templateQuery = ''

  if (templateType) {
    templateQuery = '?type=' + templateType;
  }

  return this.apiClient.get('/v2/templates' + templateQuery);
};

/**
 * @param {string} templateId
 * @param {Object} [personalisation]
 * @returns {Promise<import('axios').AxiosResponse<{id: string, type: NotificationType, version: number, body: string, html?: string, subject?: string, postage?: PostageType}>>}
 */
NotifyClient.prototype.previewTemplateById = function(templateId, personalisation) {

  let payload = {}

  if (personalisation) {
    payload.personalisation = personalisation;
  }

  return this.apiClient.post('/v2/template/' + templateId +  '/preview', payload);
};

/**
 * @param {string} [olderThan]
 * @returns {Promise<import('axios').AxiosResponse<{received_text_messages: Array<{id: string, user_number: string, notify_number: string, created_at: string, service_id: string, content: string}>, links: {current: string, next: string}}>>}
 */
NotifyClient.prototype.getReceivedTexts = function(olderThan){
  let queryString;

  if (olderThan) {
    queryString = '?older_than=' + olderThan;
  } else {
    queryString = '';
  }

  return this.apiClient.get('/v2/received-text-messages' + queryString);
};

/**
 * @param {import('axios').AxiosProxyConfig} proxyConfig
 * @returns {void}
 */
NotifyClient.prototype.setProxy = function(proxyConfig) {
  this.apiClient.setProxy(proxyConfig);
};

/**
 * @param {import('axios').AxiosInstance} client
 * @returns {void}
 */
NotifyClient.prototype.setClient = function(client) {
  this.apiClient.setClient(client);
};

/**
 * @param {Buffer | string} fileData
 * @param {{filename?: string, confirmEmailBeforeDownload?: boolean, retentionPeriod?: string}} [options]
 * @returns {{file: string, filename: string | null, confirm_email_before_download: boolean | null, retention_period: string | null}}
 */
NotifyClient.prototype.prepareUpload = function(fileData, options) {
  let data = {
    file: _check_and_encode_file(fileData, 2),
    filename: null,
    confirm_email_before_download: null,
    retention_period: null,
  }

  if (options !== undefined) {
    data.filename = options.filename || null;
    data.confirm_email_before_download = options.confirmEmailBeforeDownload !== undefined ? options.confirmEmailBeforeDownload : null;
    data.retention_period = options.retentionPeriod || null;
  }

  return data;
};

module.exports = {
  NotifyClient: NotifyClient
};
