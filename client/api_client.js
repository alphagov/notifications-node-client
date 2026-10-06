var defaultRestClient = require('undici').fetch,
    createGovukNotifyToken = require('../client/authentication.js'),
    notifyProductionAPI = 'https://api.notifications.service.gov.uk',
    version = require('../package.json').version;

function requireApiKey(apiKey) {
  if (typeof apiKey !== 'string' || apiKey.length === 0) {
    throw new Error('API key is required and must be a string');
  }
}

/**
 * @template T
 * @typedef {import('undici').Response & {data: T}} ClientResponse
 */

/**
 * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
 * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
 * @param {string} [apiKeyId] - API key (3 args)
 * @constructor
 */
function ApiClient(apiKeyOrUrl, serviceIdOrApiKey, apiKeyId) {

  this.proxy = null;
  /** @type {import('undici').fetch} */
  this.restClient = defaultRestClient;

  if (arguments.length === 1) {
    requireApiKey(arguments[0]);
    this.urlBase = notifyProductionAPI;
    this.apiKeyId = arguments[0].substring(arguments[0].length - 36, arguments[0].length);
    this.serviceId = arguments[0].substring(arguments[0].length - 73, arguments[0].length - 37);
  }

  if (arguments.length === 2) {

    if (typeof arguments[0] === 'string' && arguments[0].startsWith('http')) {
      requireApiKey(arguments[1]);
      this.urlBase = arguments[0];
      this.apiKeyId = arguments[1].substring(arguments[1].length - 36, arguments[1].length);
      this.serviceId = arguments[1].substring(arguments[1].length - 73, arguments[1].length - 37);
    } else {
      requireApiKey(arguments[1]);
      this.urlBase = notifyProductionAPI;
      this.serviceId = arguments[0];
      this.apiKeyId = arguments[1].substring(arguments[1].length - 36, arguments[1].length);
    }

  }

  if (arguments.length === 3) {
    requireApiKey(arguments[2]);
    this.urlBase = arguments[0];
    this.serviceId = arguments[1];
    this.apiKeyId = arguments[2].substring(arguments[2].length - 36, arguments[2].length);
  }

  if (arguments.length === 0) {
    requireApiKey(undefined);
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
 * @template T return type
 * @param {string} path
 * @param {import('undici').RequestInit} [additionalOptions]
 * @returns {Promise<ClientResponse<T>>}
 */
ApiClient.prototype.get = function(path, additionalOptions) {
  /** @type {import('undici').RequestInit} */
  var options = {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId),
      'Content-Type': 'application/json',
      'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
    }
  };
  Object.assign(options, additionalOptions)

  return this._makeRequest(path, options);
};

/**
 * @template T return type
 * @param {string} path
 * @param {object} data
 * @returns {Promise<ClientResponse<T>>}
 */
ApiClient.prototype.post = function(path, data){
  /** @type {import('undici').RequestInit} */
  var options = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Authorization': 'Bearer ' + createToken('GET', path, this.apiKeyId, this.serviceId),
      'Content-Type': 'application/json',
      'User-Agent': 'NOTIFY-API-NODE-CLIENT/' + version
    }
  };

  return this._makeRequest(path, options);
};

/**
 * Make a request with the configured client (and proxy)
 * Parse the response as per the returned content-type
 *
 * @template T return type
 * @param {string} path
 * @param {import('undici').RequestInit} options
 * @returns {Promise<ClientResponse<T>>}
 * @private
 */
ApiClient.prototype._makeRequest = function(path, options) {
  if(this.proxy !== null) options.dispatcher = this.proxy;

  return this.restClient(this.urlBase + path, options)
      .then(async res => {
        // parse the response - even for errors
        const contentType = res.headers?.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          // most notify response are JSON
          res.data = await res.json();
        } else if (contentType.includes('application/pdf')) {
          // getting a letter as a PDF will return the PDF, not JSON
          res.data = await res.arrayBuffer();
        } else {
          // fallback
          res.data = await res.text();
        }

        if (!res.ok) {
          // throw for non-2xx responses
          var error = new Error(
              'Request failed with status code ' + res.status
          );
          error.response = res;
          throw error;
        }

        return res;
      });
}

/**
 * @param {import('undici').Dispatcher} proxyConfig
 * @returns {void}
 */
ApiClient.prototype.setProxy = function(proxyConfig){
  this.proxy = proxyConfig
};

/**
 * @param {import('undici').fetch} restClient
 * @returns {void}
 */
ApiClient.prototype.setClient = function(restClient){
  this.restClient = restClient;
};

module.exports = ApiClient;
