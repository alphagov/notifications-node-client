var defaultRestClient = require('axios').default,
    createGovukNotifyToken = require('../client/authentication.js'),
    notifyProductionAPI = 'https://api.notifications.service.gov.uk',
    version = require('../package.json').version;

/**
 * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
 * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
 * @param {string} [apiKeyId] - API key (3 args)
 * @constructor
 */
function ApiClient(apiKeyOrUrl, serviceIdOrApiKey, apiKeyId) {

  this.proxy = null;
  this.restClient = defaultRestClient;

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

/**
 * @param {string} path
 * @param {import('axios').AxiosRequestConfig} [additionalOptions]
 * @returns {Promise<import('axios').AxiosResponse>}
 */
ApiClient.prototype.get = function(path, additionalOptions) {
  var options = {
    method: 'get',
    url: this.urlBase + path,
    headers: {
      'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId),
      'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
    }
  };
  Object.assign(options, additionalOptions)
  if(this.proxy !== null) options.proxy = this.proxy;

  return this.restClient(options);
};

/**
 * @param {string} path
 * @param {object} data
 * @returns {Promise<import('axios').AxiosResponse>}
 */
ApiClient.prototype.post = function(path, data){
  var options = {
    method: 'post',
    url: this.urlBase + path,
    data: data,
    headers: {
      'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId),
      'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
    }
  };

  if(this.proxy !== null) options.proxy = this.proxy;

  return this.restClient(options);
};

/**
 * @param {import('axios').AxiosProxyConfig} proxyConfig
 * @returns {void}
 */
ApiClient.prototype.setProxy = function(proxyConfig){
  this.proxy = proxyConfig
};

/**
 * @param {import('axios').AxiosInstance} restClient
 * @returns {void}
 */
ApiClient.prototype.setClient = function(restClient){
  this.restClient = restClient;
};

module.exports = ApiClient;
