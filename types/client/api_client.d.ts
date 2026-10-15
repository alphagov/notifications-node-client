export = ApiClient;
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
declare function ApiClient(apiKeyOrUrl: string, serviceIdOrApiKey?: string, apiKeyId?: string, ...args: any[]): void;
declare class ApiClient {
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
    constructor(apiKeyOrUrl: string, serviceIdOrApiKey?: string, apiKeyId?: string, ...args: any[]);
    proxy: import("undici").Dispatcher;
    /** @type {import('undici').fetch} */
    restClient: typeof defaultRestClient;
    urlBase: any;
    apiKeyId: any;
    serviceId: any;
    /**
     * @template T return type
     * @param {string} path
     * @param {import('undici').RequestInit} [additionalOptions]
     * @returns {Promise<ClientResponse<T>>}
     */
    get<T>(path: string, additionalOptions?: import("undici").RequestInit): Promise<ClientResponse<T>>;
    /**
     * @template T return type
     * @param {string} path
     * @param {object} data
     * @returns {Promise<ClientResponse<T>>}
     */
    post<T>(path: string, data: object): Promise<ClientResponse<T>>;
    private _makeRequest;
    /**
     * @param {import('undici').Dispatcher} proxyConfig
     * @returns {void}
     */
    setProxy(proxyConfig: import("undici").Dispatcher): void;
    /**
     * @param {import('undici').fetch} restClient
     * @returns {void}
     */
    setClient(restClient: typeof defaultRestClient): void;
}
declare namespace ApiClient {
    export { ClientResponse };
}
import defaultRestClient_1 = require("undici/types/fetch.js");
import defaultRestClient = defaultRestClient_1.fetch;
type ClientResponse<T> = import("undici").Response & {
    data: T;
};
