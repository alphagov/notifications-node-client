export = ApiClient;
/**
 * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
 * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
 * @param {string} [apiKeyId] - API key (3 args)
 * @constructor
 */
declare function ApiClient(apiKeyOrUrl: string, serviceIdOrApiKey?: string, apiKeyId?: string, ...args: any[]): void;
declare class ApiClient {
    /**
     * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
     * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
     * @param {string} [apiKeyId] - API key (3 args)
     * @constructor
     */
    constructor(apiKeyOrUrl: string, serviceIdOrApiKey?: string, apiKeyId?: string, ...args: any[]);
    proxy: import("axios").AxiosProxyConfig;
    restClient: import("axios").AxiosStatic;
    urlBase: any;
    apiKeyId: any;
    serviceId: any;
    /**
     * @param {string} path
     * @param {import('axios').AxiosRequestConfig} [additionalOptions]
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    get(path: string, additionalOptions?: import("axios").AxiosRequestConfig): Promise<import("axios").AxiosResponse>;
    /**
     * @param {string} path
     * @param {object} data
     * @returns {Promise<import('axios').AxiosResponse>}
     */
    post(path: string, data: object): Promise<import("axios").AxiosResponse>;
    /**
     * @param {import('axios').AxiosProxyConfig} proxyConfig
     * @returns {void}
     */
    setProxy(proxyConfig: import("axios").AxiosProxyConfig): void;
    /**
     * @param {import('axios').AxiosInstance} restClient
     * @returns {void}
     */
    setClient(restClient: import("axios").AxiosInstance): void;
}
