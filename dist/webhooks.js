"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksClient = exports.webhookEventScopes = exports.webhookSystemEvents = exports.WebhookStatus = exports.WebhookEvent = exports.WebhookSystem = void 0;
const common_1 = require("./common");
const ReadTokenScopes = ['data:read'];
const WriteTokenScopes = ['data:read', 'data:write'];
/**
 * Available webhook systems.
 */
var WebhookSystem;
(function (WebhookSystem) {
    WebhookSystem["Data"] = "data";
    WebhookSystem["Derivative"] = "derivative";
    WebhookSystem["RevitCloudWorksharing"] = "adsk.c4r";
    WebhookSystem["FusionLifecycle"] = "adsk.flc.production";
})(WebhookSystem = exports.WebhookSystem || (exports.WebhookSystem = {}));
/**
 * Available webhook events.
 * Note that only certain events can be used with specific systems, for example,
 * `WebhookEvent.Data*` values can only be used with `WebhookSystem.Data`.
 */
var WebhookEvent;
(function (WebhookEvent) {
    WebhookEvent["DataVersionAdded"] = "dm.version.added";
    WebhookEvent["DataVersionModified"] = "dm.version.modified";
    WebhookEvent["DataVersionDeleted"] = "dm.version.deleted";
    WebhookEvent["DataVersionMoved"] = "dm.version.moved";
    WebhookEvent["DataVersionCopied"] = "dm.version.copied";
    WebhookEvent["DataFolderAdded"] = "dm.folder.added";
    WebhookEvent["DataFolderModified"] = "dm.folder.modified";
    WebhookEvent["DataFolderDeleted"] = "dm.folder.deleted";
    WebhookEvent["DataFolderMoved"] = "dm.folder.moved";
    WebhookEvent["DataFolderCopied"] = "dm.folder.copied";
    WebhookEvent["DerivativeExtractionFinished"] = "extraction.finished";
    WebhookEvent["DerivativeExtractionUpdated"] = "extraction.updated";
    WebhookEvent["RevitModelPublish"] = "model.publish";
    WebhookEvent["RevitModelSync"] = "model.sync";
    WebhookEvent["FusionItemClone"] = "item.clone";
    WebhookEvent["FusionItemCreate"] = "item.create";
    WebhookEvent["FusionItemLock"] = "item.lock";
    WebhookEvent["FusionItemRelease"] = "item.release";
    WebhookEvent["FusionItemUnlock"] = "item.unlock";
    WebhookEvent["FusionItemUpdate"] = "item.update";
    WebhookEvent["FusionWorkflowTransition"] = "workflow.transition";
})(WebhookEvent = exports.WebhookEvent || (exports.WebhookEvent = {}));
/**
 * Webhook status.
 */
var WebhookStatus;
(function (WebhookStatus) {
    WebhookStatus["Active"] = "active";
    WebhookStatus["Inactive"] = "inactive";
})(WebhookStatus = exports.WebhookStatus || (exports.WebhookStatus = {}));
/**
 * List all event types available for specific webhook system.
 * @param {WebhookSystem} system Webhook system (e.g. "data").
 * @returns {WebhookEvent[]} List of webhook events.
 */
function webhookSystemEvents(system) {
    switch (system) {
        case WebhookSystem.Data:
            return [
                WebhookEvent.DataFolderAdded,
                WebhookEvent.DataFolderCopied,
                WebhookEvent.DataFolderDeleted,
                WebhookEvent.DataFolderModified,
                WebhookEvent.DataFolderMoved,
                WebhookEvent.DataVersionAdded,
                WebhookEvent.DataVersionCopied,
                WebhookEvent.DataVersionDeleted,
                WebhookEvent.DataVersionModified,
                WebhookEvent.DataVersionMoved
            ];
        case WebhookSystem.Derivative:
            return [
                WebhookEvent.DerivativeExtractionUpdated,
                WebhookEvent.DerivativeExtractionFinished
            ];
        case WebhookSystem.FusionLifecycle:
            return [
                WebhookEvent.FusionItemClone,
                WebhookEvent.FusionItemCreate,
                WebhookEvent.FusionItemLock,
                WebhookEvent.FusionItemRelease,
                WebhookEvent.FusionItemUnlock,
                WebhookEvent.FusionItemUpdate,
                WebhookEvent.FusionWorkflowTransition
            ];
        case WebhookSystem.RevitCloudWorksharing:
            return [
                WebhookEvent.RevitModelPublish,
                WebhookEvent.RevitModelSync
            ];
    }
}
exports.webhookSystemEvents = webhookSystemEvents;
/**
 * List all scope keys available for specific webhook event.
 * @param {WebhookEvent} event Webhook event (e.g., "dm.folder.moved").
 * @returns {string[]} List of scope names that can be used when creating or updating a webhook.
 */
function webhookEventScopes(event) {
    switch (event) {
        case WebhookEvent.DataVersionAdded:
        case WebhookEvent.DataVersionModified:
        case WebhookEvent.DataVersionDeleted:
        case WebhookEvent.DataVersionMoved:
        case WebhookEvent.DataVersionCopied:
        case WebhookEvent.DataFolderAdded:
        case WebhookEvent.DataFolderModified:
        case WebhookEvent.DataFolderDeleted:
        case WebhookEvent.DataFolderMoved:
        case WebhookEvent.DataFolderCopied:
            return [
                'folder'
            ];
        case WebhookEvent.DerivativeExtractionFinished:
        case WebhookEvent.DerivativeExtractionUpdated:
            return [
                'workflow'
            ];
        case WebhookEvent.RevitModelPublish:
        case WebhookEvent.RevitModelSync:
            return [
                'folder'
            ];
        case WebhookEvent.FusionItemClone:
        case WebhookEvent.FusionItemCreate:
        case WebhookEvent.FusionItemLock:
        case WebhookEvent.FusionItemRelease:
        case WebhookEvent.FusionItemUnlock:
        case WebhookEvent.FusionItemUpdate:
            return [
                'workspace'
            ];
        case WebhookEvent.FusionWorkflowTransition:
            return [
                'workflow.transition'
            ];
    }
}
exports.webhookEventScopes = webhookEventScopes;
/**
 * Client providing access to Autodesk Forge {@link https://forge.autodesk.com/en/docs/webhooks/v1/developers_guide/overview|webhooks APIs}.
 * @tutorial webhooks
 */
class WebhooksClient extends common_1.ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    constructor(auth, host, region) {
        super('webhooks/v1', auth, host, region);
    }
    // Iterates (asynchronously) over pages of paginated results
    async *_pager(endpoint) {
        let response = await this.get(endpoint, {}, ReadTokenScopes);
        yield response.data;
        while (response.links && response.links.next) {
            const next = new URL(response.links.next);
            const pageState = next.searchParams.get('pageState') || '';
            response = await this.get(`${endpoint}${endpoint.indexOf('?') === -1 ? '?' : '&'}pageState=${pageState}`, {}, ReadTokenScopes);
            yield response.data;
        }
    }
    // Collects all pages of paginated results
    async _collect(endpoint) {
        let response = await this.get(endpoint, {}, ReadTokenScopes);
        let results = response.data;
        while (response.links && response.links.next) {
            const next = new URL(response.links.next);
            const pageState = next.searchParams.get('pageState') || '';
            response = await this.get(`${endpoint}${endpoint.indexOf('?') === -1 ? '?' : '&'}pageState=${pageState}`, {}, ReadTokenScopes);
            results = results.concat(response.items);
        }
        return results;
    }
    /**
     * Iterates over all webhooks, webhooks for specific system, or webhooks for specific system and event
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/hooks-GET|docs},
     * {@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-hooks-GET|docs},
     * {@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-GET|docs}).
     * @async
     * @generator
     * @param {WebhookSystem} [system] Optional webhook system (e.g., "data") to filter the results.
     * @param {WebhookEvent} [event] Optional webhook event (e.g., "dm.version.copied") to filter the results.
     * @yields {AsyncIterable<IWebhook[]>} Single page of webhooks.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async *iterateHooks(system, event) {
        let endpoint = `hooks?region=${this.region}`;
        if (system && event) {
            endpoint = `systems/${system}/events/${event}/` + endpoint;
        }
        else if (system) {
            endpoint = `systems/${system}/` + endpoint;
        }
        for await (const hooks of this._pager(endpoint)) {
            yield hooks;
        }
    }
    /**
     * Lists all webhooks, webhooks for specific system, or webhooks for specific system and event
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/hooks-GET|docs},
     * {@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-hooks-GET|docs},
     * {@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-GET|docs}).
     * @async
     * @param {WebhookSystem} [system] Optional webhook system (e.g., "data") to filter the results.
     * @param {WebhookEvent} [event] Optional webhook event (e.g., "dm.version.copied") to filter the results.
     * @returns {Promise<IWebhook[]>} List of all webhooks.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async listHooks(system, event) {
        let endpoint = `hooks?region=${this.region}`;
        if (system && event) {
            endpoint = `systems/${system}/events/${event}/` + endpoint;
        }
        else if (system) {
            endpoint = `systems/${system}/` + endpoint;
        }
        return this._collect(endpoint);
    }
    /**
     * Provides details about a specific webhook
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-hook_id-GET|docs}).
     * @async
     * @param {WebhookSystem} system Webhook system (e.g., "data").
     * @param {WebhookEvent} event Webhook event (e.g., "dm.version.copied").
     * @param {string} id Webhook ID.
     * @returns {Promise<IWebhook>} Webhook details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getHookDetails(system, event, id) {
        const hook = await this.get(`systems/${system}/events/${event}/hooks/${id}?region=${this.region}`, {}, ReadTokenScopes);
        return hook;
    }
    /**
     * Creates new webhook, either for entire webhook system, or for a specific event
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-hooks-POST|docs},
     * {@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-POST|docs}).
     * @param {WebhookSystem} system Webhook system (e.g., "data").
     * @param {WebhookEvent | undefined} event Optional webhook event (e.g., "dm.version.copied").
     * If undefined, the webhook will be defined for the entire webhook system.
     * @param {ICreateWebhookParams} params Parameters of the new webhook.
     * @returns {Promise<string | IWebhook[]>} Webhook ID (when both `system` and `event` parameters are provided).
     * or a list of webhooks (when only `system` is specified).
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async createHook(system, event, params) {
        const endpoint = event
            ? `systems/${system}/events/${event}/hooks?region=${this.region}`
            : `systems/${system}/hooks?region=${this.region}`;
        const config = {};
        await this.setAuthorization(config, WriteTokenScopes);
        const response = await this.axios.post(endpoint, params, config);
        if (response.data.hooks) {
            return response.data.hooks;
        }
        else {
            const location = response.headers['location'] || response.headers['Location'];
            const tokens = location.split('/');
            return tokens[tokens.length - 1];
        }
    }
    /**
     * Updates an existing webhook
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-hook_id-PATCH|docs}).
     * @async
     * @param {WebhookSystem} system Webhook system (e.g., "data").
     * @param {WebhookEvent} event Webhook event (e.g., "dm.version.copied").
     * @param {string} id Webhook ID.
     * @param {IUpdateWebhookParams} params Parameters to update. Undefined properties are ignored,
     * and "null" values can be used to clear the specific configuration of the webhook.
     */
    async updateHook(system, event, id, params) {
        await this.patch(`systems/${system}/events/${event}/hooks/${id}?region=${this.region}`, params, {}, WriteTokenScopes);
    }
    /**
     * Deletes a webhook
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-hook_id-DELETE|docs}).
     * @async
     * @param {WebhookSystem} system Webhook system (e.g., "data").
     * @param {WebhookEvent} event Webhook event (e.g., "dm.version.copied").
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async deleteHook(system, event, id) {
        await this.delete(`systems/${system}/events/${event}/hooks/${id}?region=${this.region}`, {}, WriteTokenScopes);
    }
}
exports.WebhooksClient = WebhooksClient;
