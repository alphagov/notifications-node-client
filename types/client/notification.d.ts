declare namespace _exports {
    export { NotificationType, PostageType, TemplateRef, NotificationResponse, TemplateData, ClientResponse };
}
declare namespace _exports {
    export { NotifyClient };
}
export = _exports;
type NotificationType = "sms" | "letter" | "email";
type PostageType = "first" | "second" | "economy" | "europe" | "rest-of-world";
type TemplateRef = {
    id: string;
    version: number;
    uri: string;
};
type NotificationResponse = {
    id: string;
    reference?: string;
    type: NotificationType;
    status: string;
    template: {
        id: string;
        name: string;
        version: number;
    };
    body: string;
    created_at: string;
    created_by_name?: string;
    sent_at?: string;
    completed_at?: string;
    scheduled_for?: string;
    one_click_unsubscribe?: string;
    is_cost_data_ready: boolean;
    cost_in_pounds?: number;
    cost_details?: {
        billable_sheets_of_paper?: number;
        postage?: string;
    } | {
        billable_sms_fragments?: number;
        international_rate_multiplier?: number;
        sms_rate?: number;
    };
    email_address?: string;
    phone_number?: string;
    subject?: string;
    line_1?: string;
    line_2?: string;
    line_3?: string;
    line_4?: string;
    line_5?: string;
    line_6?: string;
    line_7?: string;
    postage?: PostageType;
};
type TemplateData = {
    id: string;
    name: string;
    type: NotificationType;
    created_at: string;
    updated_at: string | null;
    created_by: string;
    version: number;
    body: string;
    subject?: string;
    letter_contact_block?: string;
    postage?: PostageType;
    personalisation?: {
        [key: string]: {
            required: boolean;
        };
    };
};
type ClientResponse<T> = Promise<import("./api_client").ClientResponse<T>>;
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
 * @property {{[key: string]: {required: boolean}}} [personalisation]
 */
/**
 * @template T
 * @typedef {Promise<import('./api_client').ClientResponse<T>} ClientResponse
 */
/**
 * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
 * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
 * @param {string} [apiKeyId] - API key (3 args)
 * @constructor
 */
declare function NotifyClient(apiKeyOrUrl: string, serviceIdOrApiKey?: string, apiKeyId?: string, ...args: any[]): void;
declare class NotifyClient {
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
     * @property {{[key: string]: {required: boolean}}} [personalisation]
     */
    /**
     * @template T
     * @typedef {Promise<import('./api_client').ClientResponse<T>} ClientResponse
     */
    /**
     * @param {string} apiKeyOrUrl - API key (1 arg), or base URL (2-3 args)
     * @param {string} [serviceIdOrApiKey] - API key (2 args), or service ID (3 args)
     * @param {string} [apiKeyId] - API key (3 args)
     * @constructor
     */
    constructor(apiKeyOrUrl: string, serviceIdOrApiKey?: string, apiKeyId?: string, ...args: any[]);
    /** @type {ApiClient} */
    apiClient: ApiClient;
    /**
     * @param {string} templateId
     * @param {string} emailAddress
     * @param {{personalisation?: Object, reference?: string, emailReplyToId?: string, oneClickUnsubscribeURL?: string, sanitiseContentFor?: string[]}} [options]
     * @returns {ClientResponse<{id: string, reference?: string, content: {body: string, subject: string, from_email: string, one_click_unsubscribe_url?: string}, sanitised_content: Record<string, Record<string, string>>, uri: string, template: TemplateRef}>}
     */
    sendEmail(templateId: string, emailAddress: string, options?: {
        personalisation?: any;
        reference?: string;
        emailReplyToId?: string;
        oneClickUnsubscribeURL?: string;
        sanitiseContentFor?: string[];
    }): ClientResponse<{
        id: string;
        reference?: string;
        content: {
            body: string;
            subject: string;
            from_email: string;
            one_click_unsubscribe_url?: string;
        };
        sanitised_content: Record<string, Record<string, string>>;
        uri: string;
        template: TemplateRef;
    }>;
    /**
     * @param {string} templateId
     * @param {string} phoneNumber
     * @param {{personalisation?: Object, reference?: string, smsSenderId?: string}} [options]
     * @returns {ClientResponse<{id: string, reference?: string, content: {body: string, from_number: string}, uri: string, template: TemplateRef}>}
     */
    sendSms(templateId: string, phoneNumber: string, options?: {
        personalisation?: any;
        reference?: string;
        smsSenderId?: string;
    }): ClientResponse<{
        id: string;
        reference?: string;
        content: {
            body: string;
            from_number: string;
        };
        uri: string;
        template: TemplateRef;
    }>;
    /**
     * @param {string} templateId
     * @param {{personalisation?: Object, reference?: string}} [options]
     * @returns {ClientResponse<{id: string, reference?: string, content: {body: string, subject: string}, uri: string, template: TemplateRef, scheduled_for: string | null}>}
     */
    sendLetter(templateId: string, options?: {
        personalisation?: any;
        reference?: string;
    }): ClientResponse<{
        id: string;
        reference?: string;
        content: {
            body: string;
            subject: string;
        };
        uri: string;
        template: TemplateRef;
        scheduled_for: string | null;
    }>;
    /**
     * @param {string} reference
     * @param {Buffer | string} pdf_file
     * @param {"first" | "second" | "economy" | "europe" | "rest-of-world"} [postage]
     * @returns {ClientResponse<{id: string, reference: string, postage: PostageType}>}
     */
    sendPrecompiledLetter(reference: string, pdf_file: Buffer | string, postage?: "first" | "second" | "economy" | "europe" | "rest-of-world"): ClientResponse<{
        id: string;
        reference: string;
        postage: PostageType;
    }>;
    /**
     * @param {string} notificationId
     * @returns {ClientResponse<NotificationResponse>}
     */
    getNotificationById(notificationId: string): ClientResponse<NotificationResponse>;
    /**
     * @param {string} [templateType]
     * @param {string} [status]
     * @param {string} [reference]
     * @param {string} [olderThanId]
     * @returns {ClientResponse<{notifications: NotificationResponse[], links: {current: string, next: string}}>}
     */
    getNotifications(templateType?: string, status?: string, reference?: string, olderThanId?: string): ClientResponse<{
        notifications: NotificationResponse[];
        links: {
            current: string;
            next: string;
        };
    }>;
    /**
     * @param {string} notificationId
     * @returns {Promise<Buffer>}
     */
    getPdfForLetterNotification(notificationId: string): Promise<Buffer>;
    /**
     * @param {string} templateId
     * @returns {ClientResponse<TemplateData>}
     */
    getTemplateById(templateId: string): ClientResponse<TemplateData>;
    /**
     * @param {string} templateId
     * @param {number} version
     * @returns {ClientResponse<TemplateData>}
     */
    getTemplateByIdAndVersion(templateId: string, version: number): ClientResponse<TemplateData>;
    /**
     * @param {NotificationType} [templateType]
     * @returns {ClientResponse<{templates: TemplateData[]}>}
     */
    getAllTemplates(templateType?: NotificationType): ClientResponse<{
        templates: TemplateData[];
    }>;
    /**
     * @param {string} templateId
     * @param {Object} [personalisation]
     * @returns {ClientResponse<{id: string, type: NotificationType, version: number, body: string, html?: string, subject?: string, postage?: PostageType}>}
     */
    previewTemplateById(templateId: string, personalisation?: any): ClientResponse<{
        id: string;
        type: NotificationType;
        version: number;
        body: string;
        html?: string;
        subject?: string;
        postage?: PostageType;
    }>;
    /**
     * @param {string} [olderThan]
     * @returns {ClientResponse<{received_text_messages: Array<{id: string, user_number: string, notify_number: string, created_at: string, service_id: string, content: string}>, links: {current: string, next: string}}>}
     */
    getReceivedTexts(olderThan?: string): ClientResponse<{
        received_text_messages: Array<{
            id: string;
            user_number: string;
            notify_number: string;
            created_at: string;
            service_id: string;
            content: string;
        }>;
        links: {
            current: string;
            next: string;
        };
    }>;
    /**
     * @param {import('undici').Dispatcher} proxyConfig
     * @returns {void}
     */
    setProxy(proxyConfig: import("undici").Dispatcher): void;
    /**
     * @param {import('undici').fetch} client
     * @returns {void}
     */
    setClient(client: typeof import("undici").fetch): void;
    /**
     * @param {Buffer | string} fileData
     * @param {{filename?: string, confirmEmailBeforeDownload?: boolean, retentionPeriod?: string}} [options]
     * @returns {{file: string, filename: string | null, confirm_email_before_download: boolean | null, retention_period: string | null}}
     */
    prepareUpload(fileData: Buffer | string, options?: {
        filename?: string;
        confirmEmailBeforeDownload?: boolean;
        retentionPeriod?: string;
    }): {
        file: string;
        filename: string | null;
        confirm_email_before_download: boolean | null;
        retention_period: string | null;
    };
}
import ApiClient = require("./api_client");
