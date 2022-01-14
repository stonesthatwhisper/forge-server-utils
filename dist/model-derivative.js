"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelDerivativeClient = exports.ManifestHelper = exports.ThumbnailSize = exports.urnify = void 0;
const stream_1 = require("stream");
const common_1 = require("./common");
const isNullOrUndefined = (value) => value === null || value === undefined;
const RootPath = 'modelderivative/v2';
const ReadTokenScopes = ['data:read'];
const WriteTokenScopes = ['data:read', 'data:write', 'data:create'];
/**
 * Converts ID of an object to base64-encoded URN expected by {@link ModelDerivativeClient}.
 * @param {string} id Object ID.
 * @returns {string} base64-encoded object URN.
 * @example
 * urnify('urn:adsk.objects:os.object:my-bucket/my-file.dwg');
 * // Returns 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bXktYnVja2V0L215LWZpbGUuZHdn'
 */
function urnify(id) {
    return Buffer.from(id).toString('base64').replace(/=/g, '');
}
exports.urnify = urnify;
var ThumbnailSize;
(function (ThumbnailSize) {
    ThumbnailSize[ThumbnailSize["Small"] = 100] = "Small";
    ThumbnailSize[ThumbnailSize["Medium"] = 200] = "Medium";
    ThumbnailSize[ThumbnailSize["Large"] = 400] = "Large";
})(ThumbnailSize = exports.ThumbnailSize || (exports.ThumbnailSize = {}));
/**
 * Utility class for querying {@see IDerivativeManifest}.
 */
class ManifestHelper {
    constructor(manifest) {
        this.manifest = manifest;
    }
    /**
     * Finds manifest derivatives with matching 'guid', 'type', or 'role' properties.
     * @param {object} query Dictionary of the requested properties and values.
     * @returns {DerivativeChild[]} Matching derivatives.
     */
    search(query) {
        let matches = [];
        this.traverse((child) => {
            if ((isNullOrUndefined(query.guid) || child.guid === query.guid)
                && (isNullOrUndefined(query.type) || child.type === query.type)
                && (isNullOrUndefined(query.role) || child.role === query.role)) {
                matches.push(child);
            }
            return true;
        });
        return matches;
    }
    /**
     * Traverses all derivatives, executing the input callback for each one.
     * @param {(child: DerivativeChild) => boolean} callback Function to be called for each derivative,
     * returning a bool indicating whether the traversal should recurse deeper in the manifest hierarchy.
     */
    traverse(callback) {
        function process(node, callback) {
            const proceed = callback(node);
            if (proceed && node.children) {
                for (const child of node.children) {
                    process(child, callback);
                }
            }
        }
        for (const derivative of this.manifest.derivatives) {
            if (derivative.children) {
                for (const child of derivative.children) {
                    process(child, callback);
                }
            }
        }
    }
}
exports.ManifestHelper = ManifestHelper;
/**
 * Client providing access to Autodesk Forge
 * {@link https://forge.autodesk.com/en/docs/model-derivative/v2|model derivative APIs}.
 * @tutorial model-derivative
 */
class ModelDerivativeClient extends common_1.ForgeClient {
    /**
     * Initializes new client with specific authentication method.
     * @param {IAuthOptions} auth Authentication object,
     * containing either `client_id` and `client_secret` properties (for 2-legged authentication),
     * or a single `token` property (for 2-legged or 3-legged authentication with pre-generated access token).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     * @param {Region} [region="US"] Forge availability region.
     */
    constructor(auth, host, region) {
        super(RootPath, auth, host, region);
    }
    /**
     * Gets a list of supported translation formats
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/formats-GET|docs}).
     * @async
     * @yields {Promise<IDerivativeFormats>} Dictionary of all supported output formats
     * mapped to arrays of formats these outputs can be obtained from.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async formats() {
        const response = await this.get('designdata/formats', {}, ReadTokenScopes);
        return response.formats;
    }
    /**
     * Submits a translation job
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/job-POST|docs}).
     * @async
     * @param {string} urn Document to be translated.
     * @param {IDerivativeOutputType[]} outputs List of requested output formats.
     * @param {string} [pathInArchive] Optional relative path to root design if the translated file is an archive.
     * @param {boolean} [force] Force translation even if a derivative already exists.
     * @param {string} [workflowId] Optional workflow ID to be used with Forge Webhooks.
     * @param {object} [workflowAttr] Optional workflow attributes to be used with Forge Webhooks.
     * @returns {Promise<IJob>} Translation job details, with properties 'result',
     * 'urn', and 'acceptedJobs'.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async submitJob(urn, outputs, pathInArchive, force, workflowId, workflowAttr) {
        const params = {
            input: {
                urn: urn
            },
            output: {
                formats: outputs,
                destination: {
                    region: this.region
                }
            }
        };
        if (pathInArchive) {
            params.input.compressedUrn = true;
            params.input.rootFilename = pathInArchive;
        }
        if (workflowId) {
            params.misc = {
                workflow: workflowId
            };
            if (workflowAttr) {
                params.misc.workflowAttribute = workflowAttr;
            }
        }
        const headers = {};
        if (force) {
            headers['x-ads-force'] = 'true';
        }
        return this.post('designdata/job', params, headers, WriteTokenScopes);
    }
    /**
     * Retrieves manifest of a derivative
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @returns {Promise<IDerivativeManifest>} Document derivative manifest.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getManifest(urn) {
        return this.get(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/manifest` : `designdata/${urn}/manifest`, {}, ReadTokenScopes, true);
    }
    /**
     * Deletes manifest
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-DELETE|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async deleteManifest(urn) {
        return this.delete(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/manifest` : `designdata/${urn}/manifest`, {}, WriteTokenScopes);
    }
    /**
     * Downloads content of a specific model derivative
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-derivativeurn-GET/|docs}).
     * @async
     * @param {string} modelUrn Model URN.
     * @param {string} derivativeUrn Derivative URN.
     * @returns {Promise<ArrayBuffer>} Derivative content.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getDerivative(modelUrn, derivativeUrn) {
        return this.getBuffer(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${modelUrn}/manifest/${derivativeUrn}` : `designdata/${modelUrn}/manifest/${derivativeUrn}`, {}, ReadTokenScopes);
    }
    /**
     * Downloads content of a specific model derivative
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-derivativeurn-GET/|docs}).
     * @async
     * @param {string} modelUrn Model URN.
     * @param {string} derivativeUrn Derivative URN.
     * @returns {Promise<ReadableStream>} Derivative content stream.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getDerivativeStream(modelUrn, derivativeUrn) {
        return this.getStream(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${modelUrn}/manifest/${derivativeUrn}` : `designdata/${modelUrn}/manifest/${derivativeUrn}`, {}, ReadTokenScopes);
    }
    /**
     * Downloads content of a specific model derivative asset in chunks
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-manifest-derivativeurn-GET/|docs}).
     * @param {string} modelUrn Model URN.
     * @param {string} derivativeUrn Derivative URN.
     * @param {number} [maxChunkSize=1<<24] Maximum size (in bytes) of a single downloaded chunk.
     * @returns {Readable} Readable stream with the content of the downloaded derivative asset.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    getDerivativeChunked(modelUrn, derivativeUrn, maxChunkSize = 1 << 24) {
        const url = this.region === common_1.Region.EMEA ? `regions/eu/designdata/${modelUrn}/manifest/${derivativeUrn}` : `designdata/${modelUrn}/manifest/${derivativeUrn}`;
        const client = this;
        async function* read() {
            const config = {};
            await client.setAuthorization(config, ReadTokenScopes);
            let resp = await client.axios.head(url, config);
            const contentLength = parseInt(resp.headers['content-length']);
            let streamedBytes = 0;
            while (streamedBytes < contentLength) {
                const chunkSize = Math.min(maxChunkSize, contentLength - streamedBytes);
                await client.setAuthorization(config, ReadTokenScopes);
                const buff = await client.getBuffer(url, { Range: `bytes=${streamedBytes}-${streamedBytes + chunkSize - 1}` }, ReadTokenScopes);
                yield buff;
                streamedBytes += chunkSize;
            }
        }
        return stream_1.Readable.from(read());
    }
    /**
     * Retrieves metadata of a derivative
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @returns {Promise<IDerivativeMetadata>} Document derivative metadata.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getMetadata(urn) {
        return this.get(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/metadata` : `designdata/${urn}/metadata`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves metadata of a derivative as a readable stream
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @returns {Promise<ReadableStream>} Document derivative metadata.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getMetadataStream(urn) {
        return this.getStream(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/metadata` : `designdata/${urn}/metadata`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves object tree of a specific viewable
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-guid-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {string} guid Viewable GUID.
     * @param {boolean} [force] Force query even when exceeding the size limit (20MB).
     * @returns {Promise<IDerivativeTree>} Viewable object tree.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getViewableTree(urn, guid, force) {
        return this.get(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/metadata/${guid}${force ? '?forceget=true' : ''}` : `designdata/${urn}/metadata/${guid}${force ? '?forceget=true' : ''}`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves object tree of a specific viewable as a readable stream
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-guid-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {string} guid Viewable GUID.
     * @param {boolean} [force] Force query even when exceeding the size limit (20MB).
     * @returns {Promise<ReadableStream>} Readable stream.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getViewableTreeStream(urn, guid, force) {
        let url = this.region === common_1.Region.EMEA
            ? `regions/eu/designdata/${urn}/metadata/${guid}`
            : `designdata/${urn}/metadata/${guid}`;
        if (force) {
            url += '?forceget=true';
        }
        return this.getStream(url, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves properties of a specific viewable
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-guid-properties-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {string} guid Viewable GUID.
     * @param {boolean} [force] Force query even when exceeding the size limit (20MB).
     * @returns {Promise<IDerivativeProps>} Viewable properties.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getViewableProperties(urn, guid, force) {
        return this.get(this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/metadata/${guid}/properties${force ? '?forceget=true' : ''}` : `designdata/${urn}/metadata/${guid}/properties${force ? '?forceget=true' : ''}`, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves properties of a specific viewable as a readable stream
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-metadata-guid-properties-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {string} guid Viewable GUID.
     * @param {boolean} [force] Force query even when exceeding the size limit (20MB).
     * @returns {Promise<ReadableStream>} Readable stream.
     * @throws Error when the request fails, for example, due to insufficient rights.
     */
    async getViewablePropertiesStream(urn, guid, force) {
        let url = this.region === common_1.Region.EMEA
            ? `regions/eu/designdata/${urn}/metadata/${guid}/properties`
            : `designdata/${urn}/metadata/${guid}/properties`;
        if (force) {
            url += '?forceget=true';
        }
        return this.getStream(url, {}, ReadTokenScopes, true);
    }
    /**
     * Retrieves derivative thumbnail
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-thumbnail-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {ThumbnailSize} [size=ThumbnailSize.Medium] Thumbnail size (small: 100x100 px, medium: 200x200 px, or large: 400x400 px).
     * @returns {Promise<ArrayBuffer>} Thumbnail data.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getThumbnail(urn, size = ThumbnailSize.Medium) {
        const endpoint = this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/thumbnail` : `designdata/${urn}/thumbnail`;
        return this.getBuffer(endpoint + '?width=' + size, {}, ReadTokenScopes);
    }
    /**
     * Retrieves derivative thumbnail stream
     * ({@link https://forge.autodesk.com/en/docs/model-derivative/v2/reference/http/urn-thumbnail-GET|docs}).
     * @async
     * @param {string} urn Document derivative URN.
     * @param {ThumbnailSize} [size=ThumbnailSize.Medium] Thumbnail size (small: 100x100 px, medium: 200x200 px, or large: 400x400 px).
     * @returns {Promise<ReadableStream>} Thumbnail data stream.
     * @throws Error when the request fails, for example, due to insufficient rights, or incorrect scopes.
     */
    async getThumbnailStream(urn, size = ThumbnailSize.Medium) {
        const endpoint = this.region === common_1.Region.EMEA ? `regions/eu/designdata/${urn}/thumbnail` : `designdata/${urn}/thumbnail`;
        return this.getStream(endpoint + '?width=' + size, {}, ReadTokenScopes);
    }
}
exports.ModelDerivativeClient = ModelDerivativeClient;
