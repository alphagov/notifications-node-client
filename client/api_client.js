var restClient = require('request-promise'),
    _ = require('underscore'),
    createGovukNotifyToken = require('../client/authentication.js'),
    notifyProductionAPI = 'https://api.notifications.service.gov.uk'
    version = require(__dirname + '/../package.json').version;

/**
 * @param urlBase
 * @param serviceId
 * @param apiKeyId
 *
 * @constructor
 */
function ApiClient() {

  this.proxy = null;

  if (arguments.length === 1) {
    this.urlBase = notifyProductionAPI;
    this.apiKeyId = arguments[0].substring(arguments[0].length - 36, arguments[0].length);
    this.serviceId = arguments[0].substring(arguments[0].length - 73, arguments[0].length - 37);
  }

  if (arguments.length === 2) {

    if (arguments[0].startsWith('http')) {
      this.urlBase = arguments[0];
      this.apiKeyId = arguments[1].substring(arguments[1].length - 36, arguments[1].length);
      this.serviceId = arguments[1].substring(arguments[1].length - 73, arguments[1].length - 37);
    } else {
      this.urlBase = notifyProductionAPI;
      this.serviceId = arguments[0];
      this.apiKeyId = arguments[1].substring(arguments[1].length - 36, arguments[1].length);
    }

  }

  if (arguments.length === 3) {
    this.urlBase = arguments[0];
    this.serviceId = arguments[1];
    this.apiKeyId = arguments[2].substring(arguments[2].length - 36, arguments[2].length);
  }

}

/**
 *
 * @param {string} requestMethod
 * @param {string} requestPath
 * @param {string} apiKeyId
 * @param {string} serviceId
 *
 * @returns {string}
 */
function createToken(requestMethod, requestPath, apiKeyId, serviceId) {
  return createGovukNotifyToken(requestMethod, requestPath, apiKeyId, serviceId);
}

_.extend(ApiClient.prototype, {

  /**
   *
   * @param {string} path
   *
   * @returns {Promise}
   */
  get: function(path) {
    var options = {
      method: 'GET',
      uri: this.urlBase + path,
      json: true,
      resolveWithFullResponse: true,
      headers: {
        'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId),
        'User-agent': 'NOTIFY-API-NODE-CLIENT/' + version
      }
    };

    if(this.proxy !== null) options.proxy = this.proxy;

    return restClient(options);
  },

  /**
   *
   * @param {string} path
   * @param {object} data
   *
   * @returns {Promise}
   */
  post: function(path, data){
    var options = {
      method: 'POST',
      uri: this.urlBase + path,
      json: true,
      body: data,
      resolveWithFullResponse: true,
      headers: {
        'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId),
        'User-agent': 'NOTIFY-API-NODE-CLIENT/' + version
      }
    };
    
    if(this.proxy !== null) options.proxy = this.proxy;

    return restClient(options);
  },

  /**
   *
   * @param {String} url
   */
  setProxy: function(url){
    this.proxy = url;
  }
});

module.exports = ApiClient;
