var restClient = require('request-promise'),
    _ = require('underscore'),
    createGovukNotifyToken = require('../client/authentication.js');

/**
 * @param urlBase
 * @param clientId
 * @param secret
 *
 * @constructor
 */
function ApiClient(urlBase, clientId, secret) {
  this.clientId = clientId;
  this.secret = secret;
  this.urlBase = urlBase;
}

/**
 *
 * @param {string} requestMethod
 * @param {string} requestPath
 * @param {string} secret
 * @param {string}clientId
 *
 * @returns {string}
 */
function createToken(requestMethod, requestPath, secret, clientId) {
  return createGovukNotifyToken(requestMethod, requestPath, secret, clientId)
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
        'Authorization': 'Bearer ' + createToken('GET', path, this.secret, this.clientId)
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
        'Authorization': 'Bearer ' + createToken('GET', path, this.secret, this.clientId)
      }
    };

    return restClient(options);
  }
});

module.exports = ApiClient;
