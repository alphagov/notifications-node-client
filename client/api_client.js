var restClient = require('request-promise'),
    _ = require('underscore'),
    createGovukNotifyToken = require('../client/authentication.js');

/**
 * @param urlBase
 * @param serviceId
 * @param apiKeyId
 *
 * @constructor
 */
function ApiClient(urlBase, serviceId, apiKeyId) {
  this.serviceId = serviceId;
  this.apiKeyId = apiKeyId;
  this.urlBase = urlBase;
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
  return createGovukNotifyToken(requestMethod, requestPath, apiKeyId, serviceId)
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
        'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId)
      }
    };

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
        'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId)
      }
    };

    return restClient(options);
  }
});

module.exports = ApiClient;
