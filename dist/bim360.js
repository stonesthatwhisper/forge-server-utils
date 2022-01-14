"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BIM360Client = exports.ResourceType = void 0;
const common_1 = require("./common");
const common_2 = require("./common");
const ReadTokenScopes = ['data:read', 'account:read'];
const WriteTokenScopes = ['data:create', 'data:write'];
const PageSize = 64;
var ResourceType;
(function (ResourceType) {
    ResourceType["Folders"] = "folders";
    ResourceType["Items"] = "items";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
/**
 * Client providing access to Autodesk Forge
 * {@link https://forge.autodesk.com/en/docs/bim360/v1|BIM360 APIs}.
 */
class BIM360Client extends common_2.ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    constructor(auth, host, region) {
        super('', auth, host, region);
    }
    // #region Hubs
    /**
     * Gets a list of all hubs accessible to given credentials
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-GET}).
     * @async
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IHub[]>} List of hubs.
     */
    async listHubs(xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`project/v1/hubs`, headers, ReadTokenScopes);
        let results = response.data;
        while (response.links && response.links.next) {
            response = await this.get(response.links.next.href, headers, ReadTokenScopes);
            results = results.concat(response.data);
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Gets details of specific hub
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IHub>} Hub details or null if there isn't one.
     */
    async getHubDetails(hubId, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const response = await this.get(`project/v1/hubs/${encodeURIComponent(hubId)}`, headers, ReadTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    // #endregion
    // #region Projects
    /**
     * Gets a list of all projects in a hub
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IProject[]>} List of projects.
     */
    async listProjects(hubId, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`project/v1/hubs/${encodeURIComponent(hubId)}/projects`, headers, ReadTokenScopes);
        let results = response.data;
        while (response.links && response.links.next) {
            response = await this.get(response.links.next.href, headers, ReadTokenScopes);
            results = results.concat(response.data);
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Gets details of specific project
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-project_id-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IProject>} Hub details or null if there isn't one.
     */
    async getProjectDetails(hubId, projectId, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const response = await this.get(`project/v1/hubs/${encodeURIComponent(hubId)}/projects/${encodeURIComponent(projectId)}`, headers, ReadTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    /**
     * Gets a list of top folders in a project
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-project_id-topFolders-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IFolder[]>} List of folder records.
     */
    async listTopFolders(hubId, projectId, xUserId) {
        const headers = {};
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`project/v1/hubs/${encodeURIComponent(hubId)}/projects/${encodeURIComponent(projectId)}/topFolders`, headers, ReadTokenScopes);
        let results = response.data;
        while (response.links && response.links.next) {
            response = await this.get(response.links.next.href, headers, ReadTokenScopes);
            results = results.concat(response.data);
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Creates a storage location in the OSS where data can be uploaded to.
     * @async
     * @param {string} projectId Project Id.
     * @param {string} fileName Displayable name of the resource.
     * @param {ResourceType} resourceType The type of this resource. Possible values: folders, items.
     * @param {string} resourceId Id of the resource.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IStorageLocation>} A storage location.
     */
    async createStorageLocation(projectId, fileName, resourceType, resourceId, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const params = {
            jsonapi: {
                version: '1.0'
            },
            data: {
                type: 'objects',
                attributes: {
                    name: fileName
                },
                relationships: {
                    target: {
                        data: {
                            type: resourceType,
                            id: resourceId
                        }
                    }
                }
            }
        };
        const response = await this.post(`data/v1/projects/${encodeURIComponent(projectId)}/storage`, params, headers, WriteTokenScopes);
        return Object.assign(response.data.id, { id: response.data.id });
    }
    // #endregion
    // #region Folders
    /**
     * Gets contents of a folder
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-folders-folder_id-contents-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} folderId Folder ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IItem[]>} List of folder contents.
     */
    async listContents(projectId, folderId, xUserId) {
        const headers = {};
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`data/v1/projects/${encodeURIComponent(projectId)}/folders/${encodeURIComponent(folderId)}/contents`, headers, ReadTokenScopes);
        let results = response.data;
        while (response.links && response.links.next) {
            response = await this.get(response.links.next.href, headers, ReadTokenScopes);
            results = results.concat(response.data);
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id, type: result.type }));
    }
    /**
     * Returns the folder by ID for any folder within a given project.
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-folders-folder_id-GET/}).
     * @param {string} projectId Project ID.
     * @param {string} folderId Folder ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IFolder>} Folder details.
     */
    async getFolder(projectId, folderId, xUserId) {
        const headers = {};
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`data/v1/projects/${encodeURIComponent(projectId)}/folders/${encodeURIComponent(folderId)}`, headers, ReadTokenScopes);
        return Object.assign(response.data.attributes, {
            id: response.data.id
        });
    }
    // #endregion
    // #region Items
    /**
     * Gets details of an item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IItemDetails>} Item details.
     */
    async getItemDetails(projectId, itemId, xUserId) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const headers = {};
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`data/v1/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}`, headers, ReadTokenScopes);
        if (response.included && response.included.length > 0) {
            const included = response.included[0];
            return Object.assign(response.data.attributes, {
                id: response.data.id,
                type: response.data.type,
                folder: (_c = (_b = (_a = response.data.relationships) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id,
                derivative: (_f = (_e = (_d = included === null || included === void 0 ? void 0 : included.relationships) === null || _d === void 0 ? void 0 : _d.derivatives) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.id,
                storage: (_j = (_h = (_g = included === null || included === void 0 ? void 0 : included.relationships) === null || _g === void 0 ? void 0 : _g.storage) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.id,
                versionNumber: (_k = included === null || included === void 0 ? void 0 : included.attributes) === null || _k === void 0 ? void 0 : _k.versionNumber
            });
        }
        else {
            return Object.assign(response.data.attributes, {
                id: response.data.id,
                type: response.data.type,
                folder: (_o = (_m = (_l = response.data.relationships) === null || _l === void 0 ? void 0 : _l.parent) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.id
            });
        }
    }
    /**
     * Gets versions of a folder item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-versions-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion[]>} List of item versions.
     */
    async listVersions(projectId, itemId, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        let response = await this.get(`data/v1/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}/versions`, headers, ReadTokenScopes);
        let results = response.data;
        while (response.links && response.links.next) {
            response = await this.get(response.links.next.href, headers, ReadTokenScopes);
            results = results.concat(response.data);
        }
        return results.map((result) => {
            var _a, _b, _c, _d, _e, _f;
            return Object.assign(result.attributes, {
                id: result.id,
                type: result.type,
                derivative: (_c = (_b = (_a = result === null || result === void 0 ? void 0 : result.relationships) === null || _a === void 0 ? void 0 : _a.derivatives) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.id,
                storage: (_f = (_e = (_d = result === null || result === void 0 ? void 0 : result.relationships) === null || _d === void 0 ? void 0 : _d.storage) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.id
            });
        });
    }
    /**
     * Gets "tip" version of a folder item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-tip-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Tip version of the item.
     */
    async getTipVersion(projectId, itemId, xUserId) {
        const headers = {};
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const response = await this.get(`data/v1/projects/${encodeURIComponent(projectId)}/items/${encodeURIComponent(itemId)}/tip`, headers, ReadTokenScopes);
        return response.data;
    }
    // #endregion
    // #region Versions
    /**
     * Gets specific version of a folder item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-versions-version_id-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID (@deprecated, will be removed in next major version).
     * @param {string} versionId Version ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Specific version of folder item.
     */
    async getVersionDetails(projectId, itemId, versionId, xUserId) {
        const headers = {};
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const response = await this.get(`data/v1/projects/${encodeURIComponent(projectId)}/versions/${encodeURIComponent(versionId)}`, headers, ReadTokenScopes);
        return response.data;
    }
    /**
     * Creates versions of uploaded files (items) and makes copies of existing files.
     * @param {string} projectId The project Id.
     * @param {string} fileName Displayable name of an item.
     * @param {string} folderId The folder Id.
     * @param {string} storageId The storage location Id.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Specific version of an item.
     */
    async createVersion(projectId, fileName, folderId, storageId, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const params = {
            jsonapi: {
                version: '1.0'
            },
            data: {
                type: 'items',
                attributes: {
                    displayName: fileName,
                    extension: {
                        type: 'items:autodesk.bim360:File',
                        version: '1.0'
                    }
                },
                relationships: {
                    tip: {
                        data: {
                            type: 'versions',
                            id: '1'
                        }
                    },
                    parent: {
                        data: {
                            type: 'folders',
                            id: folderId
                        }
                    }
                }
            },
            included: [
                {
                    type: 'versions',
                    id: '1',
                    attributes: {
                        name: fileName,
                        extension: {
                            type: 'versions:autodesk.bim360:File',
                            version: '1.0'
                        }
                    },
                    relationships: {
                        storage: {
                            data: {
                                type: 'objects',
                                id: storageId
                            }
                        }
                    }
                }
            ]
        };
        const response = await this.post(`data/v1/projects/${encodeURIComponent(projectId)}/items`, params, headers, WriteTokenScopes);
        if (response.included.length === 1) {
            return Object.assign(response.included[0].id, { id: response.included[0].id, type: 'versions' });
        }
        else {
            return null;
        }
    }
    /**
     * Creates next version of uploaded files (items).
     * @param {string} projectId The project Id.
     * @param {string} fileName  The name of the file.
     * @param {string} itemId The ID of the item.
     * @param {string} storageId The storage location Id.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Specific version of an item.
     */
    async createNextVersion(projectId, fileName, itemId, storageId, urns, xUserId) {
        const headers = {};
        headers['Content-Type'] = 'application/vnd.api+json';
        if (!!xUserId) {
            headers['x-user-id'] = xUserId;
        }
        const xrefs = urns.map(function (urn) {
            const xref = {
                type: 'versions',
                id: urn,
                meta: {
                    refType: 'xrefs',
                    direction: 'from',
                    extension: {
                        type: 'xrefs:autodesk.core:Xref',
                        version: '1.1',
                        data: {
                            nestedType: 'overlay'
                        }
                    }
                }
            };
            return xref;
        });
        const params = {
            jsonapi: {
                version: '1.0'
            },
            data: {
                type: 'versions',
                attributes: {
                    name: fileName,
                    extension: {
                        type: 'versions:autodesk.bim360:File',
                        version: '1.0'
                    }
                },
                relationships: {
                    item: {
                        data: {
                            type: 'items',
                            id: itemId
                        }
                    },
                    storage: {
                        data: {
                            type: 'objects',
                            id: storageId
                        }
                    },
                    refs: {
                        data: xrefs
                    }
                }
            }
        };
        const response = await this.post(`data/v1/projects/${encodeURIComponent(projectId)}/versions`, params, headers, WriteTokenScopes);
        return Object.assign(response.data.id, { id: response.data.id });
    }
    // #endregion
    // #region Issues
    /**
     * Retrieves ID of container for issues of specific BIM360 project.
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @returns {Promise<string|null>} Issue container ID if there is one, otherwise null.
     */
    async getIssueContainerID(hubId, projectId) {
        var _a, _b, _c, _d;
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const response = await this.get(`project/v1/hubs/${encodeURIComponent(hubId)}/projects/${encodeURIComponent(projectId)}`, headers, ReadTokenScopes);
        return (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.relationships) === null || _b === void 0 ? void 0 : _b.issues) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id;
    }
    /**
     * Lists all issues in a BIM360 project.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {IIssueFilter} [filter] Optional set of filters.
     * @param {IPage} [page] Optional page of issues to retrieve. If not defined, *all* issues will be listed.
     * @returns {Promise<IIssue[]>} List of matching issues.
     */
    async listIssues(containerId, filter, page) {
        // TODO: 'include', and 'fields' params
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        let url = page
            ? `issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues?page[limit]=${page.limit}&page[offset]=${page.offset}`
            : `issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues?page[limit]=${PageSize}`;
        if (filter) {
            if (filter.status) {
                url += '&filter[status]=' + filter.status;
            }
            if (filter.owner) {
                url += '&filter[owner]=' + filter.owner;
            }
            if (filter.target_urn) {
                url += '&filter[target_urn]=' + filter.target_urn;
            }
            if (filter.due_date) {
                url += '&filter[due_date]=' + (Array.isArray(filter.due_date)
                    ? filter.due_date[0].toISOString() + '...' + filter.due_date[1].toISOString()
                    : filter.due_date.toISOString());
            }
            if (filter.synced_after) {
                url += '&filter[synced_after]=' + filter.synced_after.toISOString();
            }
            if (filter.created_at) {
                url += '&filter[created_at]=' + (Array.isArray(filter.created_at)
                    ? filter.created_at[0].toISOString() + '...' + filter.created_at[1].toISOString()
                    : filter.created_at.toISOString());
            }
            if (filter.created_by) {
                url += '&filter[created_by]=' + filter.created_by;
            }
            if (filter.assigned_to) {
                url += '&filter[assigned_to]=' + filter.assigned_to;
            }
            if (filter.ng_issue_type_id) {
                url += '&filter[ng_issue_type_id]=' + filter.ng_issue_type_id;
            }
            if (filter.ng_issue_subtype_id) {
                url += '&filter[ng_issue_subtype_id]=' + filter.ng_issue_subtype_id;
            }
        }
        let response = await this.get(url, headers, ReadTokenScopes);
        let results = response.data;
        if (!page) {
            while (response.links && response.links.next) {
                response = await this.get(response.links.next.href, headers, ReadTokenScopes);
                results = results.concat(response.data);
            }
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Obtains detail information about BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-:id-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId Issue ID.
     * @returns {Promise<IIssue>} Issue details.
    */
    async getIssueDetails(containerId, issueId) {
        // TODO: support 'include', and 'fields' params
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const response = await this.get(`issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues/${encodeURIComponent(issueId)}`, headers, ReadTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    /**
     * Creates new BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-POST}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {INewIssue} attributes New issue attributes.
     * @returns {Promise<IIssue>} New issue details.
     */
    async createIssue(containerId, attributes) {
        // TODO: support 'fields' param
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const params = {
            data: {
                type: 'quality_issues',
                attributes
            }
        };
        const response = await this.post(`issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues`, params, headers, WriteTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    /**
     * Updates existing BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-:id-PATCH}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId ID of updated issue.
     * @param {IUpdateIssue} attributes Issue attributes to update.
     * @returns {Promise<IIssue>} Updated issue details.
     */
    async updateIssue(containerId, issueId, attributes) {
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const params = {
            data: {
                type: 'quality_issues',
                id: issueId,
                attributes
            }
        };
        const response = await this.patch(`issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues/${encodeURIComponent(issueId)}`, params, headers, WriteTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    /**
     * Lists all comments associated with a BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-:id-comments-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId Issue ID.
     * @param {IPage} [page] Optional page of issue comments. If not defined, *all* comments will be listed.
     * @returns {Promise<IIssueComment[]>} Issue comments.
     */
    async listIssueComments(containerId, issueId, page) {
        // TODO: support 'filter', 'include', or 'fields' params
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const url = page
            ? `issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues/${encodeURIComponent(issueId)}/comments?page[limit]=${page.limit}&page[offset]=${page.offset}`
            : `issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues/${encodeURIComponent(issueId)}/comments?page[limit]=${PageSize}`;
        let response = await this.get(url, headers, ReadTokenScopes);
        let results = response.data;
        if (!page) {
            while (response.links && response.links.next) {
                response = await this.get(response.links.next.href, headers, ReadTokenScopes);
                results = results.concat(response.data);
            }
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Creates new comment associated with a BIM360 issue.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-comments-POST}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId Issue ID.
     * @returns {Promise<IIssueComment>} New issue comment.
     */
    async createIssueComment(containerId, issueId, body) {
        // TODO: support 'fields' param
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const params = {
            data: {
                type: 'comments',
                attributes: {
                    issue_id: issueId,
                    body
                }
            }
        };
        const response = await this.post(`issues/v1/containers/${encodeURIComponent(containerId)}/comments`, params, headers, WriteTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    /**
     * Lists all attachments associated with a BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-attachments-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId Issue ID.
     * @param {IPage} [page] Optional page of issue attachments. If not defined, *all* attachments will be listed.
     * @returns {Promise<IIssueAttachment[]>} Issue attachments.
     */
    async listIssueAttachments(containerId, issueId, page) {
        // TODO: support 'filter', 'include', or 'fields' params
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const url = page
            ? `issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues/${encodeURIComponent(issueId)}/attachments?page[limit]=${page.limit}&page[offset]=${page.offset}`
            : `issues/v1/containers/${encodeURIComponent(containerId)}/quality-issues/${encodeURIComponent(issueId)}/attachments?page[limit]=${PageSize}`;
        let response = await this.get(url, headers, ReadTokenScopes);
        let results = response.data;
        if (!page) {
            while (response.links && response.links.next) {
                response = await this.get(response.links.next.href, headers, ReadTokenScopes);
                results = results.concat(response.data);
            }
        }
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Creates new attachment associated with a BIM360 issue.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-attachments-POST}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @returns {Promise<IIssueAttachment>} New issue attachment.
     */
    async createIssueAttachment(containerId, attributes) {
        // TODO: support 'fields' param
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const params = {
            data: {
                type: 'attachments',
                attributes
            }
        };
        const response = await this.post(`issues/v1/containers/${encodeURIComponent(containerId)}/attachments`, params, headers, WriteTokenScopes);
        return Object.assign(response.data.attributes, { id: response.data.id });
    }
    /**
     * Retrieves a list of supported root causes that you can allocate to an issue.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/root-causes-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {IPage} [page] Optional page of records. If not defined, *all* records will be listed.
     * @returns {Promise<IIssueRootCause[]>} Issue root causes.
     */
    async listIssueRootCauses(containerId, page) {
        // TODO: support 'filter', 'include', or 'fields' params
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const url = page
            ? `issues/v1/containers/${encodeURIComponent(containerId)}/root-causes?page[limit]=${page.limit}&page[offset]=${page.offset}`
            : `issues/v1/containers/${encodeURIComponent(containerId)}/root-causes?page[limit]=${PageSize}`;
        let response = await this.get(url, headers, ReadTokenScopes);
        let results = response.data;
        return results.map((result) => Object.assign(result.attributes, { id: result.id }));
    }
    /**
     * Lists issue types in specific container.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/ng-issue-types-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @returns {Promise<IIssueType[]>} List of issues types.
     */
    async listIssueTypes(containerId, includeSubtypes) {
        // TODO: support 'filter', 'include', or 'fields' params
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        let response = await this.get(`issues/v1/containers/${encodeURIComponent(containerId)}/ng-issue-types?limit=${PageSize}${includeSubtypes ? '&include=subtypes' : ''}`, headers, ReadTokenScopes);
        let results = response.results;
        while (response.pagination && response.pagination.offset + response.pagination.limit < response.pagination.totalResults) {
            response = await this.get(`issues/v1/containers/${encodeURIComponent(containerId)}/ng-issue-types?offset=${response.pagination.offset + response.pagination.limit}&limit=${PageSize}${includeSubtypes ? '&include=subtypes' : ''}`, headers, ReadTokenScopes);
            results = results.concat(response.results);
        }
        return results;
    }
    async listIssueAttributeDefinitions(containerId) {
        // TODO: support 'filter', 'include', or 'fields' params
        const headers = {};
        let response = await this.get(`issues/v2/containers/${encodeURIComponent(containerId)}/issue-attribute-definitions?limit=${PageSize}`, headers, ReadTokenScopes);
        let results = response.results;
        while (response.pagination && response.pagination.offset + response.pagination.limit < response.pagination.totalResults) {
            response = await this.get(`issues/v2/containers/${encodeURIComponent(containerId)}/issue-attribute-definitions?offset=${response.pagination.offset + response.pagination.limit}&limit=${PageSize}`, headers, ReadTokenScopes);
            results = results.concat(response.results);
        }
        return results;
    }
    async listIssueAttributeMappings(containerId) {
        // TODO: support 'filter', 'include', or 'fields' params
        const headers = {};
        let response = await this.get(`issues/v2/containers/${encodeURIComponent(containerId)}/issue-attribute-mappings?limit=${PageSize}`, headers, ReadTokenScopes);
        let results = response.results;
        while (response.pagination && response.pagination.offset + response.pagination.limit < response.pagination.totalResults) {
            response = await this.get(`issues/v2/containers/${encodeURIComponent(containerId)}/issue-attribute-mappings?offset=${response.pagination.offset + response.pagination.limit}&limit=${PageSize}`, headers, ReadTokenScopes);
            results = results.concat(response.results);
        }
        return results;
    }
    // #endregion
    // #region Account Admin
    /**
     * Lists all users in BIM 360 account, or just users matching specific criteria.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-GET}.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-search-GET}.
     * @async
     * @param {string} accountId The account ID of the users. This corresponds to hub ID in the Data Management API. To convert a hub ID into an account ID you need to remove the “b.” prefix. For example, a hub ID of b.c8b0c73d-3ae9 translates to an account ID of c8b0c73d-3ae9.
     * @returns {Promise<IUser[]>} List of users.
     */
    async listUsers(accountId, filter) {
        let url = this.region === common_1.Region.US
            ? `hq/v1/accounts/${encodeURIComponent(accountId)}/users`
            : `hq/v1/regions/eu/accounts/${encodeURIComponent(accountId)}/users`;
        if (filter) {
            url += `/search?limit=${PageSize}`;
            for (const key of Object.keys(filter)) {
                url += `&${key}=${filter[key]}`;
            }
        }
        else {
            url += `?limit=${PageSize}`;
        }
        let results = [];
        let offset = 0;
        let response = await this.get(url, {}, ReadTokenScopes);
        while (response.length) {
            results = results.concat(response);
            offset += PageSize;
            response = await this.get(url + `&offset=${offset}`, {}, ReadTokenScopes);
        }
        return results;
    }
    /**
     * Query the details of a specific user.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-:user_id-GET}.
     * @param {string} accountId The account ID of the users. This corresponds to hub ID in the Data Management API. To convert a hub ID into an account ID you need to remove the “b.” prefix. For example, a hub ID of b.c8b0c73d-3ae9 translates to an account ID of c8b0c73d-3ae9.
     * @param {string} userId User ID.
     * @returns {Promise<IUser>} User details.
    */
    async getUserDetails(accountId, userId) {
        const url = this.region === common_1.Region.US
            ? `hq/v1/accounts/${encodeURIComponent(accountId)}/users/${encodeURIComponent(userId)}`
            : `hq/v1/regions/eu/accounts/${encodeURIComponent(accountId)}/users/${encodeURIComponent(userId)}`;
        const response = await this.get(url, {}, ReadTokenScopes);
        return response;
    }
    // #endregion
    // #region Locations
    /**
     * Retrieves ID of container for locations of specific BIM360 project.
     * Note: this API is not yet officially documented and supported!
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @returns {Promise<string|null>} Location container ID if there is one, otherwise null.
     */
    async getLocationContainerID(hubId, projectId) {
        var _a, _b, _c, _d;
        const headers = { 'Content-Type': 'application/vnd.api+json' };
        const response = await this.get(`project/v1/hubs/${encodeURIComponent(hubId)}/projects/${encodeURIComponent(projectId)}`, headers, ReadTokenScopes);
        return (_d = (_c = (_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.relationships) === null || _b === void 0 ? void 0 : _b.locations) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.id;
    }
    /**
     * Retrieves details about the locations (nodes) for a project.
     * Note: this API is not yet officially documented and supported!
     * @async
     * @param {string} containerId Location container ID retrieved using {@link getLocationContainerID}.
     * @param {IPage} [page] Optional page of locations to retrieve. If not defined, *all* issues will be listed.
     * @returns {Promise<ILocationNode[]>} Location nodes.
     */
    async listLocationNodes(containerId, page) {
        const headers = {};
        const treeId = 'default';
        const url = page
            ? `bim360/locations/v2/containers/${encodeURIComponent(containerId)}/trees/${encodeURIComponent(treeId)}/nodes?offset=${page.offset}&limit=${page.limit}`
            : `bim360/locations/v2/containers/${encodeURIComponent(containerId)}/trees/${encodeURIComponent(treeId)}/nodes?limit=${PageSize}`;
        let response = await this.get(url, headers, ReadTokenScopes);
        let results = response.results;
        if (!page) {
            while (response.pagination && response.pagination.offset + response.pagination.limit < response.pagination.totalResults) {
                response = await this.get(`bim360/locations/v2/containers/${encodeURIComponent(containerId)}/trees/${encodeURIComponent(treeId)}/nodes?offset=${response.pagination.offset + response.pagination.limit}&limit=${PageSize}`, headers, ReadTokenScopes);
                results = results.concat(response.results);
            }
        }
        return results;
    }
}
exports.BIM360Client = BIM360Client;
