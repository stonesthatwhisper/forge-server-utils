/// <reference types="node" />
import * as fs from 'fs';
import { ForgeClient, IAuthOptions, Region } from './common';
export declare enum DesignAutomationRegion {
    US_WEST = "us-west",
    US_EAST = "us-east"
}
export interface IEngineDetail {
    productVersion: string;
    description: string;
    version: number;
    id: string;
}
export interface IAppBundleCommon {
    engine: string;
    settings?: {
        [key: string]: any;
    };
    description?: string;
}
export interface ICreateAppBundleConfig extends IAppBundleCommon {
    id: string;
}
export interface IUpdateAppBundleConfig extends IAppBundleCommon {
}
export interface IAppBundleDetail extends IAppBundleCommon {
    id: string;
    version: number;
    package: string;
}
export interface IAppBundleUploadParams extends IAppBundleCommon {
    id: string;
    version: number;
    uploadParameters: {
        formData: {
            [key: string]: string;
        };
        endpointURL: string;
    };
}
export interface IAlias {
    id: string;
    version: number;
    receiver?: string;
}
export interface ICodeOnEngineStringSetting {
    name: string;
    value: string;
    isEnvironmentVariable: boolean;
}
export interface ICodeOnEngineUrlSetting {
    name: string;
    url: string;
    headers?: object;
    verb?: string;
}
export interface IActivityParam {
    name: string;
    verb?: string;
    description?: string;
    localName?: string;
    required?: boolean;
    zip?: boolean;
    ondemand?: boolean;
}
export interface IActivityCommon {
    engine: string;
    commandLine: string[];
    description?: string;
    appbundles?: string[];
    parameters?: {
        [name: string]: IActivityParam;
    };
    settings?: any;
}
export interface ICreateActivityConfig extends IActivityCommon {
    id: string;
}
export interface IUpdateActivityConfig extends IActivityCommon {
}
export interface IActivityDetail extends IActivityCommon {
    id: string;
    version: number;
}
export interface IWorkItemConfig {
    activityId: string;
    arguments?: {
        [name: string]: IWorkItemParam;
    };
    signatures?: {
        activityId?: string;
        baseUrls?: {
            url: string;
            signature: string;
        };
    };
    limitProcessingTimeSec?: number;
}
export interface IWorkItemDetail {
    id: string;
    status: string;
    progress: string;
    reportUrl: string;
    stats: any;
}
export interface IWorkItemParam {
    url: string;
    localName?: string;
    optional?: boolean;
    pathInZip?: string;
    headers?: object;
    verb?: string;
}
/**
 * Helper class for working with Design Automation
 * {@link https://forge.autodesk.com/en/docs/design-automation/v3/developers_guide/aliases-and-ids|aliases and IDs}.
 */
export declare class DesignAutomationID {
    owner: string;
    id: string;
    alias: string;
    /**
     * Parses fully qualified ID.
     * @param {string} str Fully qualified ID.
     * @returns {DesignAutomationID|null} Parsed ID or null if the format was not correct.
     */
    static parse(str: string): DesignAutomationID | null;
    /**
     * Creates new fully qualified ID.
     * @param {string} owner Owner part of the fully qualified ID. Must consist of a-z, A-Z, 0-9 and _ characters only.
     * @param {string} id ID part of the fully qualified ID. Must consist of a-z, A-Z, 0-9 and _ characters only.
     * @param {string} alias Alias part of the fully qualified ID. Must consist of a-z, A-Z, 0-9 and _ characters only.
     */
    constructor(owner: string, id: string, alias: string);
    /**
     * Outputs the fully qualified ID in a form expected by Design Automation endpoints.
     */
    toString(): string;
}
/**
 * Client providing access to Autodesk Forge
 * {@link https://forge.autodesk.com/en/docs/design-automation/v3|design automation APIs}.
 * @tutorial design-automation
 */
export declare class DesignAutomationClient extends ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [_region] @deprecated Will be removed in next major version.
     * @param {DesignAutomationRegion} [region] Design Automation specific availability region.
     */
    constructor(auth: IAuthOptions, host?: string, _region?: Region, region?: DesignAutomationRegion);
    /**
     * Resets client to specific authentication method, Forge host, and availability region.
     * @param {IAuthOptions} [auth] Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [_region] @deprecated Will be removed in next major version.
     * @param {DesignAutomationRegion} [region] Design Automation specific availability region.
     */
    reset(auth?: IAuthOptions, host?: string, _region?: Region, region?: DesignAutomationRegion): void;
    private _pager;
    private _collect;
    /**
     * Gets current nickname for all your Design Automation entities
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/design-automation-forgeapps-id-GET|docs}).
     * @async
     * @returns {Promise<string>} Current nickname.
     */
    getNickname(): Promise<string>;
    /**
     * Sets new nickname for all your Design Automation entities
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/design-automation-forgeapps-id-PATCH|docs}).
     * @async
     * @param {string} nickname New nickname.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    setNickname(nickname: string): Promise<any>;
    /**
     * Removes current nickname for all your Design Automation entities
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/design-automation-forgeapps-id-DELETE|docs}).
     * @async
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    deleteNickname(): Promise<any>;
    /**
     * Iterates over all engines in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/engines-GET|docs}).
     * @async
     * @generator
     * @yields {AsyncIterable<string[]>} List of engine (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateEngines(): AsyncIterable<string[]>;
    /**
     * Gets a list of all engines
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/engines-GET|docs}).
     * @async
     * @returns {Promise<string[]>} List of engine (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listEngines(): Promise<string[]>;
    /**
     * Gets single engine details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/engines-id-GET|docs}).
     * @async
     * @param {string} engineId Fully qualified engine ID.
     * @returns {Promise<IEngineDetail>} Engine details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    getEngine(engineId: string): Promise<IEngineDetail>;
    /**
     * Iterates over all app bundles in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-GET|docs}).
     * @async
     * @generator
     * @yields {AsyncIterable<string[]>} List of appbundle (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateAppBundles(): AsyncIterable<string[]>;
    /**
     * Gets a list of all appbundles
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-GET|docs}).
     * @async
     * @returns {Promise<string[]>} List of appbundle (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listAppBundles(): Promise<string[]>;
    /**
     * Gets single appbundle details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-GET|docs}).
     * @async
     * @param {string} bundleId Fully qualified appbundle ID.
     * @returns {Promise<IAppBundleDetail>} Appbundle details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    getAppBundle(bundleId: string): Promise<IAppBundleDetail>;
    /**
     * Gets single appbundle version details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-version-GET|docs}).
     * @async
     * @param {string} id Short (unqualified) app bundle ID.
     * @param {number} version App bundle version.
     * @returns {Promise<IAppBundleDetail>} Appbundle details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    getAppBundleVersion(id: string, version: number): Promise<IAppBundleDetail>;
    /**
     * Creates a new app bundle
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-POST|docs}).
     * @async
     * @param {string} id Unique name of the bundle.
     * @param {string} engine ID of one of the supported {@link engines}.
     * @param {object} [settings] Additional app bundle settings.
     * @param {string} [description] App bundle description.
     * @returns {Promise<IAppBundleUploadParams>} Details of the created app bundle,
     * incl. parameters for uploading the actual zip file with app bundle binaries.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    createAppBundle(id: string, engine: string, settings?: {
        [key: string]: any;
    }, description?: string): Promise<IAppBundleUploadParams>;
    /**
     * Updates an existing app bundle, creating its new version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-POST|docs}).
     * @async
     * @param {string} id ID of the app bundle.
     * @param {string} [engine] ID of one of the supported {@link engines}.
     * @param {object} [settings] Additional app bundle settings.
     * @param {string} [description] App bundle description.
     * @returns {Promise<IAppBundleUploadParams>} Details of the created app bundle,
     * incl. parameters for uploading the actual zip file with app bundle binaries.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    updateAppBundle(id: string, engine: string, settings?: {
        [key: string]: any;
    }, description?: string): Promise<IAppBundleUploadParams>;
    /**
     * Uploads zip file with contents of a specific app bundle.
     * @async
     * @param {IAppBundleUploadParams} appBundleUploadParams App bundle upload parameters
     * (returned by {@link createAppBundle} and {@link updateAppBundle}).
     * @param {fs.ReadStream} appBundleStream Stream to read the app bundle zip from.
     * @returns {Promise<any>} Response from the file submission.
     * @example
     * const appBundle = await designAutomationClient.createAppBundle('MyAppBundle', 'Autodesk.Inventor+23', 'My App Bundle Description');
     * const appBundleStream = fs.createReadStream('./MyAppBundle.zip');
     * await designAutomationClient.uploadAppBundleArchive(appBundle, appBundleStream);
     */
    uploadAppBundleArchive(appBundleUploadParams: IAppBundleUploadParams, appBundleStream: fs.ReadStream): Promise<any>;
    /**
     * Iterates over all app bundle aliases in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of the bundle.
     * @yields {AsyncIterable<IAlias[]>} List of appbundle alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateAppBundleAliases(name: string): AsyncIterable<IAlias[]>;
    /**
     * Gets a list of all appbundle aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-GET|docs}).
     * @async
     * @param {string} name Unique name of the bundle.
     * @returns {Promise<IAlias[]>} List of appbundle alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listAppBundleAliases(name: string): Promise<IAlias[]>;
    /**
     * Iterates over all app bundle versions in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of the bundle.
     * @yields {AsyncIterable<number[]>} List of appbundle version numbers.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateAppBundleVersions(name: string): AsyncIterable<number[]>;
    /**
     * Gets a list of all appbundle versions
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-GET|docs}).
     * @async
     * @param {string} name Unique name of the bundle.
     * @returns {Promise<number[]>} List of appbundle version numbers.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listAppBundleVersions(name: string): Promise<number[]>;
    /**
     * Creates new alias for an app bundle
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-POST/|docs}).
     * @async
     * @param {string} name Name of the app bundle.
     * @param {string} alias Alias name.
     * @param {number} version Version of app bundle to link to this alias.
     * @param {string} [receiver] Optional ID of another Forge application to share this app bundle with.
     * @returns {Promise<IAlias>} Details of the created alias.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    createAppBundleAlias(name: string, alias: string, version: number, receiver?: string): Promise<IAlias>;
    /**
     * Updates existing alias for an app bundle
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-aliasId-PATCH/|docs}).
     * @async
     * @param {string} name Name of the app bundle.
     * @param {string} alias Alias name.
     * @param {number} version Version of app bundle to link to this alias.
     * @param {string} [receiver] Optional ID of another Forge application to share this app bundle with.
     * @returns {Promise<IAlias>} Details of the updated alias.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    updateAppBundleAlias(name: string, alias: string, version: number, receiver?: string): Promise<IAlias>;
    /**
     * Deletes app bundle and all its versions and aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) app bundle ID.
     */
    deleteAppBundle(shortId: string): Promise<any>;
    /**
     * Deletes app bundle alias
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-aliases-aliasId-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) app bundle ID.
     * @param {string} alias App bundle alias.
     */
    deleteAppBundleAlias(shortId: string, alias: string): Promise<any>;
    /**
     * Deletes app bundle version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/appbundles-id-versions-version-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) app bundle ID.
     * @param {number} version App bundle version.
     */
    deleteAppBundleVersion(shortId: string, version: number): Promise<any>;
    /**
     * Iterates over all activities in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-GET|docs}).
     * @async
     * @generator
     * @yields {AsyncIterable<string[]>} List of activity (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateActivities(): AsyncIterable<string[]>;
    /**
     * Gets a list of all activities
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-GET|docs}).
     * @async
     * @returns {Promise<string[]>} List of activity (full) IDs.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listActivities(): Promise<string[]>;
    /**
     * Gets single activity details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-GET|docs}).
     * @async
     * @param {string} activityId Fully qualified activity ID.
     * @returns {Promise<object>} Activity details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    getActivity(activityId: string): Promise<IActivityDetail>;
    /**
     * Gets single activity version details
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-version-GET|docs}).
     * @async
     * @param {string} id Short (unqualified) activity ID.
     * @param {number} version Activity version.
     * @returns {Promise<IActivityDetail>} Activity details.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    getActivityVersion(id: string, version: number): Promise<IActivityDetail>;
    /**
     * Creates new activity
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-POST|docs}).
     * @async
     * @param {string} id New activity ID.
     * @param {string} engine ID of one of the supported {@link engines}.
     * @param {string | string[]} commands One or more CLI commands to be executed within the activity.
     * @param {string | string[]} [appBundleIDs] Fully qualified IDs of zero or more app bundles used by the activity.
     * @param {{ [name: string]: IActivityParam }} [parameters] Input/output parameter descriptors.
     * @param {{ [key: string]: any }} [settings] Additional activity settings.
     * @param {string} [description] Activity description.
     * @returns {Promise<IActivityDetail>} Details of created activity.
     */
    createActivity(id: string, engine: string, commands: string | string[], appBundleIDs?: string | string[], parameters?: {
        [key: string]: IActivityParam;
    }, settings?: {
        [key: string]: (ICodeOnEngineStringSetting | ICodeOnEngineUrlSetting);
    }, description?: string): Promise<IActivityDetail>;
    /**
     * Updates existing activity, creating its new version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-POST|docs}).
     * @async
     * @param {string} id New activity ID.
     * @param {string} engine ID of one of the supported {@link engines}.
     * @param {string | string[]} commands One or more CLI commands to be executed within the activity.
     * @param {string | string[]} [appBundleIDs] Fully qualified IDs of zero or more app bundles used by the activity.
     * @param {{ [name: string]: IActivityParam }} [parameters] Input/output parameter descriptors.
     * @param {{ [key: string]: any }} [settings] Additional activity settings.
     * @param {string} [description] Activity description.
     * @returns {Promise<object>} Details of created activity.
     */
    updateActivity(id: string, engine: string, commands: string | string[], appBundleIDs?: string | string[], parameters?: {
        [key: string]: IActivityParam;
    }, settings?: {
        [key: string]: any;
    }, description?: string): Promise<IActivityDetail>;
    /**
     * Iterates over all activity aliases in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of activity.
     * @yields {AsyncIterable<IAlias[]>} List of activity alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateActivityAliases(name: string): AsyncIterable<IAlias[]>;
    /**
     * Gets a list of all activity aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-GET|docs}).
     * @async
     * @param {string} name Unique name of activity.
     * @returns {Promise<IAlias[]>} List of activity alias objects.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listActivityAliases(name: string): Promise<IAlias[]>;
    /**
     * Iterates over all activity versions in pages of predefined size
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-GET|docs}).
     * @async
     * @generator
     * @param {string} name Unique name of activity.
     * @yields {AsyncIterable<number[]>} List of activity versions.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    iterateActivityVersions(name: string): AsyncIterable<number[]>;
    /**
     * Gets a list of all activity versions
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-GET|docs}).
     * @async
     * @param {string} name Unique name of activity.
     * @returns {Promise<number[]>} List of activity versions.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    listActivityVersions(name: string): Promise<number[]>;
    /**
     * Creates new alias for an activity
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-POST|docs}).
     * @async
     * @param {string} id Activity ID.
     * @param {string} alias New alias name.
     * @param {number} version Activity version to link to this alias.
     * @param {string} [receiver] Optional ID of another Forge application to share this activity with.
     * @returns {Promise<IAlias>} Details of created alias.
     */
    createActivityAlias(id: string, alias: string, version: number, receiver?: string): Promise<IAlias>;
    /**
     * Updates existing alias for an activity
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-aliasId-PATCH|docs}).
     * @async
     * @param {string} id Activity ID.
     * @param {string} alias Activity alias.
     * @param {number} version Activity version to link to this alias.
     * @param {string} [receiver] Optional ID of another Forge application to share this activity with.
     * @returns {Promise<IAlias>} Details of updated alias.
     */
    updateActivityAlias(id: string, alias: string, version: number, receiver?: string): Promise<IAlias>;
    /**
     * Deletes activity and all its versions and aliases
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) activity ID.
     */
    deleteActivity(shortId: string): Promise<any>;
    /**
     * Deletes activity alias
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-aliases-aliasId-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) activity ID.
     * @param {string} alias Activity alias.
     */
    deleteActivityAlias(shortId: string, alias: string): Promise<any>;
    /**
     * Deletes activity version
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/activities-id-versions-version-DELETE|docs}).
     * @async
     * @param {string} shortId Short (unqualified) activity ID.
     * @param {number} version Activity version.
     */
    deleteActivityVersion(shortId: string, version: number): Promise<any>;
    /**
     * Gets details of a specific work item
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/workitems-id-GET|docs}).
     * @async
     * @param {string} id Work item ID.
     * @returns {Promise<IWorkItemDetail>} Work item details.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    getWorkItem(id: string): Promise<IWorkItemDetail>;
    /**
     * Creates new work item
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/workitems-POST|docs}).
     * @async
     * @param {string} activityId Activity ID.
     * @param {{ [name: string]: IWorkItemParam }} [args] Arguments to pass in as activity parameters.
     * @param {{ activityId?: string; baseUrls?: { url: string; signature: string } }} signatures Signatures.
     * @param {number} limitProcessingTimeSec limit of max processing time in seconds.
     */
    createWorkItem(activityId: string, args?: {
        [name: string]: IWorkItemParam;
    }, signatures?: {
        activityId?: string;
        baseUrls?: {
            url: string;
            signature: string;
        };
    }, limitProcessingTimeSec?: number): Promise<any>;
    /**
     * Cancels work item, removing it from waiting queue or cancelling a running job
     * ({@link https://forge.autodesk.com/en/docs/design-automation/v3/reference/http/workitems-id-DELETE|docs}).
     * @async
     * @param {string} id Work item ID.
     */
    deleteWorkItem(id: string): Promise<any>;
}
//# sourceMappingURL=design-automation.d.ts.map