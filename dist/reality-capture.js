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
exports.RealityCaptureClient = exports.SceneType = exports.OutputFormat = exports.GpsType = exports.FileType = exports.EngineVersion = void 0;
const form_data_1 = __importDefault(require("form-data"));
const querystring = __importStar(require("querystring"));
const common_1 = require("./common");
const ReadTokenScopes = ['data:read'];
const WriteTokenScopes = ['data:write'];
/**
 * The reconstruction engine version.
 * Default version is 3.0
 */
var EngineVersion;
(function (EngineVersion) {
    EngineVersion["VersionOne"] = "1.0";
    EngineVersion["VersionTwo"] = "2.0";
    EngineVersion["VersionThree"] = "3.0";
})(EngineVersion = exports.EngineVersion || (exports.EngineVersion = {}));
var FileType;
(function (FileType) {
    FileType["Image"] = "image";
    FileType["Survey"] = "survey";
})(FileType = exports.FileType || (exports.FileType = {}));
/**
 * Specifies the GPS coordinates type.
 * Note: This parameter is available only if scenetype is set to aerial.
 */
var GpsType;
(function (GpsType) {
    GpsType["Regular"] = "regular";
    GpsType["Precise"] = "precise";
})(GpsType = exports.GpsType || (exports.GpsType = {}));
/**
 * Enumeration for supported photoscene output formats
 * .rcm: Autodesk Recap Photo Mesh (default)
 * .rcs: Autodesk Recap Point Cloud^
 * .obj: Wavefront Object
 * .fbx: Autodesk FBX 3D asset exchange format
 * .ortho: Ortho Photo and Elevation Map^
 * .report: Quality Report^
 * ^ These parameter values are available only if scenetype is set to aerial.
 */
var OutputFormat;
(function (OutputFormat) {
    OutputFormat["RecapPhotoMesh"] = "rcm";
    OutputFormat["RecapPointCloud"] = "rcs";
    OutputFormat["WavefrontObject"] = "obj";
    OutputFormat["FBXExchangeFormat"] = "fbx";
    OutputFormat["OrthoPhotoElevationMap"] = "ortho";
    OutputFormat["QualityReport"] = "report";
})(OutputFormat = exports.OutputFormat || (exports.OutputFormat = {}));
/**
 * Specifies the subject type of the photoscene.
 */
var SceneType;
(function (SceneType) {
    SceneType["Aerial"] = "aerial";
    SceneType["Object"] = "object";
})(SceneType = exports.SceneType || (exports.SceneType = {}));
/**
 * Client providing access to Autodesk Forge {@link https://forge.autodesk.com/en/docs/reality-capture/v1/developers_guide/overview|reality capture APIs}.
 * @tutorial realitycapture
 */
class RealityCaptureClient extends common_1.ForgeClient {
    /**
     * Initializes new client with specific authentication method
     * @param {IAuthOptions} auth Authentication object,
     * containing `client_id` and `client_secret` properties (for 2-legged authentication).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     */
    constructor(auth, host) {
        super('photo-to-3d/v1/', auth, host);
    }
    /**
     * Creates new photoscene
     * {@link https://forge.autodesk.com/en/docs/reality-capture/v1/reference/http/photoscene-POST|docs}.
     * @async
     * @param {IPhotoSceneOptions} options Specifies the parameters for the new photoscene.
     * @returns {Promise<IPhotoScene>} A JSON object containing details of the photoscene that was created, with property 'photosceneid' ID of the photoscene that was created.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async createPhotoScene(options) {
        const params = {
            scenename: options.scenename
        };
        if (options.callback) {
            params.callback = options.callback;
        }
        if (options.format) {
            params.format = options.format;
        }
        if (options.scenetype) {
            params.scenetype = options.scenetype;
        }
        if (options.scenetype !== 'object' && options.gpstype) {
            params.gpstype = options.gpstype;
        }
        if (options.hubprojectid && options.hubfolderid) {
            params.hubprojectid = options.hubprojectid;
            params.hubfolderid = options.hubfolderid;
        }
        if (options.version) {
            params.version = options.version;
        }
        if (options.scenetype !== 'object'
            && options.metadataname
            && options.metadatavalue
            && options.metadataname.length > 0
            && options.metadatavalue.length > 0
            && options.metadataname.length === options.metadatavalue.length) {
            for (let i = 0; i < options.metadataname.length; i++) {
                params[`metadataname[${i}]`] = options.metadataname[i];
                params[`metadatavalue[${i}]`] = options.metadatavalue[i];
            }
        }
        const headers = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return this.post('photoscene', querystring.stringify(params), headers, WriteTokenScopes);
    }
    /**
     * Adds one or more files to a photoscene.
     * Only JPEG images are supported.
     * Maximum number of files in a single request: 20
     * Maximum size of a single file: 128 MB
     * Maximum uncompressed size of image in memory: 512 MB
     * Note: Uploaded files will be deleted after 30 days.
     * {@link https://forge.autodesk.com/en/docs/reality-capture/v1/reference/http/file-POST|docs}.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to add the files to.
     * @param {FileType} type Specifies the type of file being uploaded: image (default) or survey
     * @param {Buffer[]} files Specifies the local files to be uploaded.
     * @returns {Promise<IFiles[]|IPhotoSceneError>} A JSON object containing details of the image files uploaded to the photoscene.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async addImages(photosceneid, type, files) {
        const form = new form_data_1.default();
        form.append('photosceneid', photosceneid);
        form.append('type', type);
        for (let i = 0; i < files.length; i++) {
            form.append(`file[${i}]`, files[i]);
        }
        const headers = {};
        headers['Content-Type'] = 'multipart/form-data';
        return this.post('file', form, headers, WriteTokenScopes);
    }
    /**
     * Adds one or more files to a photoscene.
     * Only JPEG images are supported.
     * Maximum number of files in a single request: 20
     * Maximum size of a single file: 128 MB
     * Maximum uncompressed size of image in memory: 512 MB
     * Note: Uploaded files will be deleted after 30 days.
     * {@link https://forge.autodesk.com/en/docs/reality-capture/v1/reference/http/file-POST|docs}.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to add the files to.
     * @param {FileType} type Specifies the type of file being uploaded: image (default) or survey
     * @param {string[]} files Specifies the file URLs to be uploaded (i.e. http://, https://). For externally stored files, please verify that the URLs are publically accessible.
     * @returns {Promise<IFiles[]|IPhotoSceneError>} A JSON object containing details of the image files uploaded to the photoscene.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async addImageURLs(photosceneid, type, files) {
        const params = {
            photosceneid,
            type
        };
        for (let i = 0; i < files.length; i++) {
            params[`file[${i}]`] = files[i];
        }
        const headers = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return this.post('file', querystring.stringify(params), headers, WriteTokenScopes);
    }
    /**
     * Starts photoscene processing.
     * The main processing steps involve: camera calibration, mesh reconstruction, texturing, and any necessary output file format conversions, in that order.
     * This method should not be called until a photoscene has been created and at least three images have been added to the photoscene.
     * Note: Progress of the processing can be monitored with the GET photoscene/:photosceneid/progress method.
     * {@link https://forge.autodesk.com/en/docs/reality-capture/v1/reference/http/photoscene-:photosceneid-POST|docs}.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to start processing.
     * @returns {Promise<IPhotoSceneProcess|IPhotoSceneError>} A JSON object containing a message for current processing job.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async processPhotoScene(photosceneid) {
        const headers = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return this.post(`photoscene/${photosceneid}`, {}, headers, WriteTokenScopes);
    }
    /**
     * Returns the processing progress and status of a photoscene.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to retrieve status
     * @returns {Promise<IPhotoSceneProgress|IPhotoSceneError>} A JSON object containing details of current progress status.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async getPhotoSceneProgress(photosceneid) {
        return this.get(`photoscene/${photosceneid}/progress`, {}, ReadTokenScopes);
    }
    /**
     * Returns a time-limited HTTPS link to an output file of the specified format.
     * Note: The link will expire 30 days after the date of processing completion.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to download the output
     * @returns {Promise<IPhotoSceneOutput|IPhotoSceneError>} A JSON object containing time-bound HTTPS link to the output file.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async getPhotoScene(photosceneid, format) {
        return this.get(`photoscene/${photosceneid}?format=${format}`, {}, ReadTokenScopes);
    }
    /**
     * Aborts the processing of a photoscene and marks it as cancelled.
     * @async
     * @param {string} photosceneid Specifices the ID of the photoscene to cancel.
     * @returns {IPhotoSceneCancelDelete|IPhotoSceneError} A JSON object containing information on cancelled job.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async cancelPhotoScene(photosceneid) {
        const headers = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return this.post(`photoscene/${photosceneid}/cancel`, {}, headers, WriteTokenScopes);
    }
    /**
     * Deletes a photoscene and its associated assets (images, output files, ...).
     * @async
     * @param {string} photosceneid Specifices the ID of the photoscene to delete.
     * @returns {IPhotoSceneCancelDelete|IPhotoSceneError} A JSON object containing information on deleted job.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    async deletePhotoScene(photosceneid) {
        const headers = {};
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
        return this.delete(`photoscene/${photosceneid}`, headers, WriteTokenScopes);
    }
}
exports.RealityCaptureClient = RealityCaptureClient;
