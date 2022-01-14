import { Region } from './common';
import { ForgeClient, IAuthOptions } from './common';
interface IHub {
    id: string;
    name?: string;
    region?: string;
    extension?: object;
}
interface IProject {
    id: string;
    name?: string;
    scopes?: string[];
    extension?: object;
}
interface IStorageLocation {
    id: string;
    resourceId?: string;
    resourceType?: string;
}
export declare enum ResourceType {
    Folders = "folders",
    Items = "items"
}
interface IFolder {
    id: string;
    name?: string;
    displayName?: string;
    objectCount?: number;
    createTime?: string;
    createUserId?: string;
    createUserName?: string;
    lastModifiedTime?: string;
    lastModifiedUserId?: string;
    lastModifiedUserName?: string;
    hidden?: boolean;
    extension?: object;
}
interface IItem {
    id: string;
    type: string;
    extension?: object;
}
interface IItemDetails {
    id: string;
    type: string;
    displayName?: string;
    createTime?: string;
    createUserId?: string;
    createUserName?: string;
    lastModifiedTime?: string;
    lastModifiedUserId?: string;
    lastModifiedUserName?: string;
    hidden?: boolean;
    reserved?: boolean;
    reservedTime?: string;
    reservedUserId?: string;
    reservedUserName?: string;
    pathInProject?: string;
    extension?: object;
    folder?: string;
    derivative?: string;
    storage?: string;
    versionNumber?: number;
}
interface IVersion {
    id: string;
    type: string;
    name?: string;
    displayName?: string;
    derivative?: string;
    versionNumber?: number;
    mimeType?: string;
    fileType?: string;
    storage?: number;
    storageSize?: number;
    createTime?: string;
    createUserId?: string;
    createUserName?: string;
    lastModifiedTime?: string;
    lastModifiedUserId?: string;
    lastModifiedUserName?: string;
    extension?: object;
}
interface IIssue {
    id: string;
    answer?: string;
    answered_at?: string;
    answered_by?: string;
    assigned_to_type?: string;
    assigned_to?: string;
    attachment_count?: number;
    attachments_attributes?: any[];
    close_version?: string;
    closed_at?: string;
    closed_by?: string;
    collection_urn?: string;
    comment_count?: number;
    comments_attributes?: any[];
    created_at?: string;
    created_by?: string;
    custom_attributes?: any[];
    description?: string;
    due_date?: string;
    identifier?: number;
    issue_sub_type?: number;
    issue_type_id?: string;
    issue_type?: number;
    lbs_location?: string;
    location_description?: string;
    markup_metadata?: string;
    ng_issue_subtype_id?: string;
    ng_issue_type_id?: string;
    owner?: string;
    permitted_attributes?: any[];
    permitted_statuses?: any[];
    pushpin_attributes?: object;
    quality_urns?: object;
    resource_urns?: object;
    root_cause_id?: string;
    root_cause?: string;
    sheet_metadata?: object;
    snapshot_urn?: string;
    starting_version?: number;
    status?: string;
    synced_at?: string;
    tags?: object;
    target_urn_page?: string;
    target_urn?: string;
    title?: string;
    trades?: any[];
    updated_at?: string;
}
interface INewIssue {
    title: string;
    ng_issue_subtype_id: string;
    ng_issue_type_id: string;
    description?: string;
    status?: string;
    starting_version?: number;
    due_date?: string;
    location_description?: string;
    created_at?: string;
    lbs_location?: string;
    assigned_to_type?: string;
    assigned_to?: string;
    owner?: string;
    root_cause_id?: string;
    quality_urns?: object;
}
interface IUpdateIssue {
    title: string;
    ng_issue_subtype_id?: string;
    ng_issue_type_id?: string;
    description?: string;
    status?: string;
    starting_version?: number;
    due_date?: string;
    location_description?: string;
    created_at?: string;
    lbs_location?: string;
    assigned_to_type?: string;
    assigned_to?: string;
    owner?: string;
    root_cause_id?: string;
    quality_urns?: object;
}
interface IIssueComment {
    id: string;
    body?: string;
    created_at?: string;
    created_by?: string;
    issue_id?: string;
    synced_at?: string;
    updated_at?: string;
}
interface IIssueAttachment {
    id: string;
    created_at?: string;
    synced_at?: string;
    updated_at?: string;
    attachment_type?: string;
    created_by?: string;
    issue_id?: string;
    markup_metadata?: object;
    name?: string;
    resource_urns?: any[];
    url?: string;
    urn?: string;
    urn_page?: string;
    urn_type?: string;
    urn_version?: number;
    permitted_actions?: any[];
}
interface INewIssueAttachment {
    name: string;
    urn: string;
    urn_type: string;
    issue_id: string;
}
interface IIssueRootCause {
    key: string;
    title: string;
}
interface IIssueType {
    id: string;
    containerId?: string;
    title?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    statusSet?: string;
    isActive?: boolean;
    orderIndex?: number;
    isReadOnly?: boolean;
    permittedActions?: any[];
    permittedAttributes?: any[];
    subtypes?: any[];
}
interface IIssueFilter {
    status?: string;
    owner?: string;
    target_urn?: string;
    due_date?: Date | [Date, Date];
    synced_after?: Date;
    created_at?: Date | [Date, Date];
    created_by?: string;
    assigned_to?: string;
    ng_issue_type_id?: string;
    ng_issue_subtype_id?: string;
}
interface IPage {
    offset: number;
    limit: number;
}
interface IUser {
    id: string;
    account_id?: string;
    role?: string;
    status?: string;
    company_id?: string;
    company_name?: string;
    last_sign_in?: string;
    email?: string;
    name?: string;
    nickname?: string;
    first_name?: string;
    last_name?: string;
    uid?: string;
    image_url?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state_or_province?: string;
    postal_code?: string;
    country?: string;
    phone?: string;
    company?: string;
    job_title?: string;
    industry?: string;
    about_me?: string;
    created_at?: string;
    updated_at?: string;
}
interface IUserFilter {
    name?: string;
    email?: string;
    company_name?: string;
    operator?: string;
    partial?: boolean;
}
interface ILocationNode {
    id: string;
    parentId?: string;
    type?: string;
    name?: string;
    description?: string;
    barcode?: string;
    order?: number;
    documentCount?: number;
    areaDefined?: boolean;
    path?: string[];
}
/**
 * Client providing access to Autodesk Forge
 * {@link https://forge.autodesk.com/en/docs/bim360/v1|BIM360 APIs}.
 */
export declare class BIM360Client extends ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region ("US" or "EMEA").
     */
    constructor(auth: IAuthOptions, host?: string, region?: Region);
    /**
     * Gets a list of all hubs accessible to given credentials
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-GET}).
     * @async
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IHub[]>} List of hubs.
     */
    listHubs(xUserId?: string): Promise<IHub[]>;
    /**
     * Gets details of specific hub
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IHub>} Hub details or null if there isn't one.
     */
    getHubDetails(hubId: string, xUserId?: string): Promise<IHub>;
    /**
     * Gets a list of all projects in a hub
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IProject[]>} List of projects.
     */
    listProjects(hubId: string, xUserId?: string): Promise<IProject[]>;
    /**
     * Gets details of specific project
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-project_id-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IProject>} Hub details or null if there isn't one.
     */
    getProjectDetails(hubId: string, projectId: string, xUserId?: string): Promise<IProject>;
    /**
     * Gets a list of top folders in a project
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/hubs-hub_id-projects-project_id-topFolders-GET}).
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IFolder[]>} List of folder records.
     */
    listTopFolders(hubId: string, projectId: string, xUserId?: string): Promise<IFolder[]>;
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
    createStorageLocation(projectId: string, fileName: string, resourceType: ResourceType, resourceId: string, xUserId?: string): Promise<IStorageLocation>;
    /**
     * Gets contents of a folder
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-folders-folder_id-contents-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} folderId Folder ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IItem[]>} List of folder contents.
     */
    listContents(projectId: string, folderId: string, xUserId?: string): Promise<IItem[]>;
    /**
     * Returns the folder by ID for any folder within a given project.
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-folders-folder_id-GET/}).
     * @param {string} projectId Project ID.
     * @param {string} folderId Folder ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IFolder>} Folder details.
     */
    getFolder(projectId: string, folderId: string, xUserId?: string): Promise<IFolder>;
    /**
     * Gets details of an item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IItemDetails>} Item details.
     */
    getItemDetails(projectId: string, itemId: string, xUserId?: string): Promise<IItemDetails>;
    /**
     * Gets versions of a folder item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-versions-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion[]>} List of item versions.
     */
    listVersions(projectId: string, itemId: string, xUserId?: string): Promise<IVersion[]>;
    /**
     * Gets "tip" version of a folder item
     * ({@link https://forge.autodesk.com/en/docs/data/v2/reference/http/projects-project_id-items-item_id-tip-GET}).
     * @async
     * @param {string} projectId Project ID.
     * @param {string} itemId Item ID.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Tip version of the item.
     */
    getTipVersion(projectId: string, itemId: string, xUserId?: string): Promise<IVersion>;
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
    getVersionDetails(projectId: string, itemId: string, versionId: string, xUserId?: string): Promise<IVersion>;
    /**
     * Creates versions of uploaded files (items) and makes copies of existing files.
     * @param {string} projectId The project Id.
     * @param {string} fileName Displayable name of an item.
     * @param {string} folderId The folder Id.
     * @param {string} storageId The storage location Id.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Specific version of an item.
     */
    createVersion(projectId: string, fileName: string, folderId: string, storageId: string, xUserId?: string): Promise<IVersion | null>;
    /**
     * Creates next version of uploaded files (items).
     * @param {string} projectId The project Id.
     * @param {string} fileName  The name of the file.
     * @param {string} itemId The ID of the item.
     * @param {string} storageId The storage location Id.
     * @param {string} [xUserId] Optional API will act on behalf of specified user Id.
     * @returns {Promise<IVersion>} Specific version of an item.
     */
    createNextVersion(projectId: string, fileName: string, itemId: string, storageId: string, urns: string[], xUserId?: string): Promise<IVersion | null>;
    /**
     * Retrieves ID of container for issues of specific BIM360 project.
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @returns {Promise<string|null>} Issue container ID if there is one, otherwise null.
     */
    getIssueContainerID(hubId: string, projectId: string): Promise<string | null>;
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
    listIssues(containerId: string, filter?: IIssueFilter, page?: IPage): Promise<IIssue[]>;
    /**
     * Obtains detail information about BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-:id-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId Issue ID.
     * @returns {Promise<IIssue>} Issue details.
    */
    getIssueDetails(containerId: string, issueId: string): Promise<IIssue>;
    /**
     * Creates new BIM360 issue.
     * Requires 3-legged token.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-POST}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {INewIssue} attributes New issue attributes.
     * @returns {Promise<IIssue>} New issue details.
     */
    createIssue(containerId: string, attributes: INewIssue): Promise<IIssue>;
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
    updateIssue(containerId: string, issueId: string, attributes: IUpdateIssue): Promise<IIssue>;
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
    listIssueComments(containerId: string, issueId: string, page?: IPage): Promise<IIssueComment[]>;
    /**
     * Creates new comment associated with a BIM360 issue.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-comments-POST}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {string} issueId Issue ID.
     * @returns {Promise<IIssueComment>} New issue comment.
     */
    createIssueComment(containerId: string, issueId: string, body: string): Promise<IIssueComment>;
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
    listIssueAttachments(containerId: string, issueId: string, page?: IPage): Promise<IIssueAttachment[]>;
    /**
     * Creates new attachment associated with a BIM360 issue.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/field-issues-attachments-POST}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @returns {Promise<IIssueAttachment>} New issue attachment.
     */
    createIssueAttachment(containerId: string, attributes: INewIssueAttachment): Promise<IIssueAttachment>;
    /**
     * Retrieves a list of supported root causes that you can allocate to an issue.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/root-causes-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @param {IPage} [page] Optional page of records. If not defined, *all* records will be listed.
     * @returns {Promise<IIssueRootCause[]>} Issue root causes.
     */
    listIssueRootCauses(containerId: string, page?: IPage): Promise<IIssueRootCause[]>;
    /**
     * Lists issue types in specific container.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/ng-issue-types-GET}.
     * @async
     * @param {string} containerId ID of container storing all issues for a specific projects.
     * @returns {Promise<IIssueType[]>} List of issues types.
     */
    listIssueTypes(containerId: string, includeSubtypes?: boolean): Promise<IIssueType[]>;
    listIssueAttributeDefinitions(containerId: string): Promise<any[]>;
    listIssueAttributeMappings(containerId: string): Promise<any[]>;
    /**
     * Lists all users in BIM 360 account, or just users matching specific criteria.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-GET}.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-search-GET}.
     * @async
     * @param {string} accountId The account ID of the users. This corresponds to hub ID in the Data Management API. To convert a hub ID into an account ID you need to remove the “b.” prefix. For example, a hub ID of b.c8b0c73d-3ae9 translates to an account ID of c8b0c73d-3ae9.
     * @returns {Promise<IUser[]>} List of users.
     */
    listUsers(accountId: string, filter?: IUserFilter): Promise<IUser[]>;
    /**
     * Query the details of a specific user.
     * {@link https://forge.autodesk.com/en/docs/bim360/v1/reference/http/users-:user_id-GET}.
     * @param {string} accountId The account ID of the users. This corresponds to hub ID in the Data Management API. To convert a hub ID into an account ID you need to remove the “b.” prefix. For example, a hub ID of b.c8b0c73d-3ae9 translates to an account ID of c8b0c73d-3ae9.
     * @param {string} userId User ID.
     * @returns {Promise<IUser>} User details.
    */
    getUserDetails(accountId: string, userId: string): Promise<IUser>;
    /**
     * Retrieves ID of container for locations of specific BIM360 project.
     * Note: this API is not yet officially documented and supported!
     * @async
     * @param {string} hubId Hub ID.
     * @param {string} projectId Project ID.
     * @returns {Promise<string|null>} Location container ID if there is one, otherwise null.
     */
    getLocationContainerID(hubId: string, projectId: string): Promise<string | null>;
    /**
     * Retrieves details about the locations (nodes) for a project.
     * Note: this API is not yet officially documented and supported!
     * @async
     * @param {string} containerId Location container ID retrieved using {@link getLocationContainerID}.
     * @param {IPage} [page] Optional page of locations to retrieve. If not defined, *all* issues will be listed.
     * @returns {Promise<ILocationNode[]>} Location nodes.
     */
    listLocationNodes(containerId: string, page?: IPage): Promise<ILocationNode[]>;
}
export {};
//# sourceMappingURL=bim360.d.ts.map