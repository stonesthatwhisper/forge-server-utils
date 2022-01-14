export interface ITwoLeggedToken {
    access_token: string;
    expires_in: number;
}
export interface IThreeLeggedToken extends ITwoLeggedToken {
    refresh_token: string;
}
export interface IUserProfile {
    userId: string;
    userName: string;
    emailId: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    '2FaEnabled': boolean;
    countryCode: string;
    language: string;
    optin: boolean;
    lastModified: string;
    websiteUrl: string;
    profileImages: {
        [key: string]: string;
    };
}
/**
 * Client providing access to Autodesk Forge {@link https://forge.autodesk.com/en/docs/oauth/v2|authentication APIs}.
 * @tutorial authentication
 */
export declare class AuthenticationClient {
    private client_id;
    private client_secret;
    private host;
    private _cached;
    get clientId(): string;
    /**
     * Initializes new client with specific Forge app credentials.
     * @param {string} client_id Forge application client ID.
     * @param {string} client_secret Forge application client secret.
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     */
    constructor(client_id: string, client_secret: string, host?: string);
    protected post(endpoint: string, params: any): Promise<import("axios").AxiosResponse<any>>;
    /**
     * Retrieves 2-legged access token for a specific set of scopes
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/authenticate-POST|docs}).
     * Unless the {@see force} parameter is used, the access tokens are cached
     * based on their scopes and the 'expires_in' field in the response.
     * @param {string[]} scopes List of requested {@link https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/scopes|scopes}.
     * @param {boolean} [force] Skip cache, if there is any, and retrieve a new token.
     * @returns {Promise<ITwoLeggedToken>} Promise of 2-legged authentication object containing two fields,
     * 'access_token' with the actual token, and 'expires_in' with expiration time (in seconds).
     */
    authenticate(scopes: string[], force?: boolean): Promise<ITwoLeggedToken>;
    /**
     * Generates a URL for 3-legged authentication.
     * @param {string[]} scopes List of requested {@link https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/scopes|scopes}.
     * @param {string} redirectUri Same redirect URI as defined by the Forge app.
     * @returns {string} Autodesk login URL.
     */
    getAuthorizeRedirect(scopes: string[], redirectUri: string): string;
    /**
     * Exchanges 3-legged authentication code for an access token
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/gettoken-POST|docs}).
     * @async
     * @param {string} code Authentication code returned from the Autodesk login process.
     * @param {string} redirectUri Same redirect URI as defined by the Forge app.
     * @returns {Promise<IThreeLeggedToken>} Promise of 3-legged authentication object containing
     * 'access_token', 'refresh_token', and 'expires_in' with expiration time (in seconds).
     */
    getToken(code: string, redirectUri: string): Promise<IThreeLeggedToken>;
    /**
     * Refreshes 3-legged access token
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/refreshtoken-POST}).
     * @async
     * @param {string[]} scopes List of requested {@link https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/scopes|scopes}.
     * @param {string} refreshToken Refresh token.
     * @returns {Promise<IThreeLeggedToken>} Promise of 3-legged authentication object containing
     * 'access_token', 'refresh_token', and 'expires_in' with expiration time (in seconds).
     */
    refreshToken(scopes: string[], refreshToken: string): Promise<IThreeLeggedToken>;
    /**
     * Gets profile information for a user based on their 3-legged auth token
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/users-@me-GET|docs}).
     * @async
     * @param {string} token 3-legged authentication token.
     * @returns {Promise<IUserProfile>} User profile information.
     */
    getUserProfile(token: string): Promise<IUserProfile>;
}
//# sourceMappingURL=authentication.d.ts.map