"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationClient = void 0;
const querystring = __importStar(require("querystring"));
const axios_1 = __importDefault(require("axios"));
const RootPath = `authentication/v1`;
/**
 * Client providing access to Autodesk Forge {@link https://forge.autodesk.com/en/docs/oauth/v2|authentication APIs}.
 * @tutorial authentication
 */
class AuthenticationClient {
    /**
     * Initializes new client with specific Forge app credentials.
     * @param {string} client_id Forge application client ID.
     * @param {string} client_secret Forge application client secret.
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     */
    constructor(client_id, client_secret, host = 'https://developer.api.autodesk.com') {
        this.client_id = client_id;
        this.client_secret = client_secret;
        this.host = host;
        this._cached = {};
    }
    get clientId() { return this.client_id; }
    // Helper method for POST requests with urlencoded params
    async post(endpoint, params) {
        return axios_1.default.post(this.host + '/' + RootPath + '/' + endpoint, querystring.stringify(params));
    }
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
    authenticate(scopes, force = false) {
        // Check if there's a cached token, unexpired, and with the same scopes
        const key = 'two-legged/' + scopes.join('/');
        if (!force && key in this._cached) {
            const cache = this._cached[key];
            if (cache.expires_at > Date.now()) {
                return cache.promise.then((token) => ({
                    access_token: token,
                    expires_in: Math.floor((cache.expires_at - Date.now()) / 1000)
                }));
            }
        }
        // Otherwise request a new token and cache it
        const params = {
            'client_id': this.client_id,
            'client_secret': this.client_secret,
            'grant_type': 'client_credentials',
            'scope': scopes.join(' ')
        };
        const cache = this._cached[key] = {
            expires_at: Number.MAX_VALUE,
            promise: this.post('authenticate', params).then((resp) => {
                const { data } = resp;
                this._cached[key].expires_at = Date.now() + data.expires_in * 1000;
                return data.access_token;
            })
        };
        return cache.promise.then((token) => ({
            access_token: token,
            expires_in: Math.floor((cache.expires_at - Date.now()) / 1000)
        }));
    }
    /**
     * Generates a URL for 3-legged authentication.
     * @param {string[]} scopes List of requested {@link https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/scopes|scopes}.
     * @param {string} redirectUri Same redirect URI as defined by the Forge app.
     * @returns {string} Autodesk login URL.
     */
    getAuthorizeRedirect(scopes, redirectUri) {
        return `${this.host}/${RootPath}/authorize?response_type=code&client_id=${this.client_id}&redirect_uri=${redirectUri}&scope=${scopes.join(' ')}`;
    }
    /**
     * Exchanges 3-legged authentication code for an access token
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/gettoken-POST|docs}).
     * @async
     * @param {string} code Authentication code returned from the Autodesk login process.
     * @param {string} redirectUri Same redirect URI as defined by the Forge app.
     * @returns {Promise<IThreeLeggedToken>} Promise of 3-legged authentication object containing
     * 'access_token', 'refresh_token', and 'expires_in' with expiration time (in seconds).
     */
    async getToken(code, redirectUri) {
        const params = {
            'client_id': this.client_id,
            'client_secret': this.client_secret,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': redirectUri
        };
        const resp = await this.post(`gettoken`, params);
        return resp.data;
    }
    /**
     * Refreshes 3-legged access token
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/refreshtoken-POST}).
     * @async
     * @param {string[]} scopes List of requested {@link https://forge.autodesk.com/en/docs/oauth/v2/developers_guide/scopes|scopes}.
     * @param {string} refreshToken Refresh token.
     * @returns {Promise<IThreeLeggedToken>} Promise of 3-legged authentication object containing
     * 'access_token', 'refresh_token', and 'expires_in' with expiration time (in seconds).
     */
    async refreshToken(scopes, refreshToken) {
        const params = {
            'client_id': this.client_id,
            'client_secret': this.client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken,
            'scope': scopes.join(' ')
        };
        const resp = await this.post(`refreshtoken`, params);
        return resp.data;
    }
    /**
     * Gets profile information for a user based on their 3-legged auth token
     * ({@link https://forge.autodesk.com/en/docs/oauth/v2/reference/http/users-@me-GET|docs}).
     * @async
     * @param {string} token 3-legged authentication token.
     * @returns {Promise<IUserProfile>} User profile information.
     */
    async getUserProfile(token) {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };
        const resp = await axios_1.default.get(this.host + '/userprofile/v1/users/@me', config);
        return resp.data;
    }
}
exports.AuthenticationClient = AuthenticationClient;
