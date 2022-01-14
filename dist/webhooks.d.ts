import { ForgeClient, IAuthOptions, Region } from './common';
/**
 * Available webhook systems.
 */
export declare enum WebhookSystem {
    Data = "data",
    Derivative = "derivative",
    RevitCloudWorksharing = "adsk.c4r",
    FusionLifecycle = "adsk.flc.production"
}
/**
 * Available webhook events.
 * Note that only certain events can be used with specific systems, for example,
 * `WebhookEvent.Data*` values can only be used with `WebhookSystem.Data`.
 */
export declare enum WebhookEvent {
    DataVersionAdded = "dm.version.added",
    DataVersionModified = "dm.version.modified",
    DataVersionDeleted = "dm.version.deleted",
    DataVersionMoved = "dm.version.moved",
    DataVersionCopied = "dm.version.copied",
    DataFolderAdded = "dm.folder.added",
    DataFolderModified = "dm.folder.modified",
    DataFolderDeleted = "dm.folder.deleted",
    DataFolderMoved = "dm.folder.moved",
    DataFolderCopied = "dm.folder.copied",
    DerivativeExtractionFinished = "extraction.finished",
    DerivativeExtractionUpdated = "extraction.updated",
    RevitModelPublish = "model.publish",
    RevitModelSync = "model.sync",
    FusionItemClone = "item.clone",
    FusionItemCreate = "item.create",
    FusionItemLock = "item.lock",
    FusionItemRelease = "item.release",
    FusionItemUnlock = "item.unlock",
    FusionItemUpdate = "item.update",
    FusionWorkflowTransition = "workflow.transition"
}
/**
 * Webhook status.
 */
export declare enum WebhookStatus {
    Active = "active",
    Inactive = "inactive"
}
export declare type WebhookScope = {
    folder: string;
} | {
    workflow: string;
} | {
    workspace: string;
} | {
    'workflow.transition': string;
};
/**
 * List all event types available for specific webhook system.
 * @param {WebhookSystem} system Webhook system (e.g. "data").
 * @returns {WebhookEvent[]} List of webhook events.
 */
export declare function webhookSystemEvents(system: WebhookSystem): WebhookEvent[];
/**
 * List all scope keys available for specific webhook event.
 * @param {WebhookEvent} event Webhook event (e.g., "dm.folder.moved").
 * @returns {string[]} List of scope names that can be used when creating or updating a webhook.
 */
export declare function webhookEventScopes(event: WebhookEvent): string[];
/**
 * Webhook descriptor.
 */
export interface IWebhook {
    hookId: string;
    tenant: string;
    callbackUrl: string;
    createdBy: string;
    event: string;
    createdDate: string;
    system: string;
    creatorType: string;
    status: WebhookStatus;
    scope: WebhookScope;
    urn: string;
}
/**
 * Parameters when creating a webhook.
 */
export interface ICreateWebhookParams {
    /**
     * Callback URL registered for the webhook.
     */
    callbackUrl: string;
    /**
     * An object that represents the extent to where the event is monitored.
     * For example, if the scope is folder, the webhooks service generates a notification
     * for the specified event occurring in any sub folder or item within that folder.
     */
    scope: WebhookScope;
    /**
     * A user-defined JSON object, which you can use to store/set some custom information.
     * The maximum size of the JSON object (content) should be less than 1KB.
     */
    hookAttribute?: object;
    /**
     * JsonPath expression (for example, "$[?(@.ext=='txt')]") that can be used
     * to filter the callbacks you receive.
     */
    filter?: string;
}
/**
 * Parameters when updating a webhook.
 * Undefined properties are ignored, and null values
 * can be used to clear the configuration property of webhook.
 */
export interface IUpdateWebhookParams {
    /**
     * Webhook status (can be either 'active' or 'inactive').
     */
    status?: WebhookStatus;
    /**
     * JsonPath expression (for example, "$[?(@.ext=='txt')]") that can be used
     * to filter the callbacks you receive.
     */
    filter?: string | null;
    /**
     * A user-defined JSON object, which you can use to store/set some custom information.
     * The maximum size of the JSON object (content) should be less than 1KB.
     */
    hookAttribute?: object | null;
}
/**
 * Client providing access to Autodesk Forge {@link https://forge.autodesk.com/en/docs/webhooks/v1/developers_guide/overview|webhooks APIs}.
 * @tutorial webhooks
 */
export declare class WebhooksClient extends ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    constructor(auth: IAuthOptions, host?: string, region?: Region);
    private _pager;
    private _collect;
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
    iterateHooks(system?: WebhookSystem, event?: WebhookEvent): AsyncIterable<IWebhook[]>;
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
    listHooks(system?: WebhookSystem, event?: WebhookEvent): Promise<IWebhook[]>;
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
    getHookDetails(system: WebhookSystem, event: WebhookEvent, id: string): Promise<IWebhook>;
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
    createHook(system: WebhookSystem, event: WebhookEvent | undefined, params: ICreateWebhookParams): Promise<string | IWebhook[]>;
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
    updateHook(system: WebhookSystem, event: WebhookEvent, id: string, params: IUpdateWebhookParams): Promise<void>;
    /**
     * Deletes a webhook
     * ({@link https://forge.autodesk.com/en/docs/webhooks/v1/reference/http/systems-system-events-event-hooks-hook_id-DELETE|docs}).
     * @async
     * @param {WebhookSystem} system Webhook system (e.g., "data").
     * @param {WebhookEvent} event Webhook event (e.g., "dm.version.copied").
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    deleteHook(system: WebhookSystem, event: WebhookEvent, id: string): Promise<void>;
}
//# sourceMappingURL=webhooks.d.ts.map