/// <reference types="node" />
import { ForgeClient, IAuthOptions } from './common';
/**
 * The reconstruction engine version.
 * Default version is 3.0
 */
export declare enum EngineVersion {
    VersionOne = "1.0",
    VersionTwo = "2.0",
    VersionThree = "3.0"
}
export declare enum FileType {
    Image = "image",
    Survey = "survey"
}
/**
 * Specifies the GPS coordinates type.
 * Note: This parameter is available only if scenetype is set to aerial.
 */
export declare enum GpsType {
    Regular = "regular",
    Precise = "precise"
}
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
export declare enum OutputFormat {
    RecapPhotoMesh = "rcm",
    RecapPointCloud = "rcs",
    WavefrontObject = "obj",
    FBXExchangeFormat = "fbx",
    OrthoPhotoElevationMap = "ortho",
    QualityReport = "report"
}
/**
 * Specifies the subject type of the photoscene.
 */
export declare enum SceneType {
    Aerial = "aerial",
    Object = "object"
}
export interface IFile {
    fileid: string;
    filename: string;
    filesize: string;
    msg: string;
}
export interface IFiles {
    photosceneid: string;
    Files: {
        file: IFile[];
    };
}
export interface IPhotoScene {
    Photoscene: {
        photosceneid: string;
    };
}
export interface IPhotoSceneCancelDelete {
    msg: string;
}
export interface IPhotoSceneError {
    code: number;
    msg: string;
}
export interface IPhotoSceneOptions {
    scenename: string;
    callback?: string;
    format?: OutputFormat;
    scenetype?: SceneType;
    gpstype?: GpsType;
    hubprojectid?: string;
    hubfolderid?: string;
    version?: EngineVersion;
    metadataname?: string[];
    metadatavalue?: string[];
}
export interface IPhotoSceneOutput {
    Photoscene: {
        filesize: string;
        photosceneid: string;
        progress: string;
        progressmsg: string;
        resultmsg: string;
        scenelink: string;
        urn: string;
    };
}
export interface IPhotoSceneProcess {
    msg: string;
    Photoscene: {
        photosceneid: string;
    };
}
export interface IPhotoSceneProgress {
    photosceneid: string;
    progressmsg: string;
    progress: string;
}
/**
 * Client providing access to Autodesk Forge {@link https://forge.autodesk.com/en/docs/reality-capture/v1/developers_guide/overview|reality capture APIs}.
 * @tutorial realitycapture
 */
export declare class RealityCaptureClient extends ForgeClient {
    /**
     * Initializes new client with specific authentication method
     * @param {IAuthOptions} auth Authentication object,
     * containing `client_id` and `client_secret` properties (for 2-legged authentication).
     * @param {string} [host="https://developer.api.autodesk.com"] Forge API host.
     */
    constructor(auth: IAuthOptions, host?: string);
    /**
     * Creates new photoscene
     * {@link https://forge.autodesk.com/en/docs/reality-capture/v1/reference/http/photoscene-POST|docs}.
     * @async
     * @param {IPhotoSceneOptions} options Specifies the parameters for the new photoscene.
     * @returns {Promise<IPhotoScene>} A JSON object containing details of the photoscene that was created, with property 'photosceneid' ID of the photoscene that was created.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    createPhotoScene(options: IPhotoSceneOptions): Promise<IPhotoScene>;
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
    addImages(photosceneid: string, type: FileType, files: Buffer[]): Promise<IFiles[] | IPhotoSceneError>;
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
    addImageURLs(photosceneid: string, type: FileType, files: string[]): Promise<IFiles[] | IPhotoSceneError>;
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
    processPhotoScene(photosceneid: string): Promise<IPhotoSceneProcess | IPhotoSceneError>;
    /**
     * Returns the processing progress and status of a photoscene.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to retrieve status
     * @returns {Promise<IPhotoSceneProgress|IPhotoSceneError>} A JSON object containing details of current progress status.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    getPhotoSceneProgress(photosceneid: string): Promise<IPhotoSceneProgress | IPhotoSceneError>;
    /**
     * Returns a time-limited HTTPS link to an output file of the specified format.
     * Note: The link will expire 30 days after the date of processing completion.
     * @async
     * @param {string} photosceneid Specifies the ID of the photoscene to download the output
     * @returns {Promise<IPhotoSceneOutput|IPhotoSceneError>} A JSON object containing time-bound HTTPS link to the output file.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    getPhotoScene(photosceneid: string, format: OutputFormat): Promise<IPhotoSceneOutput | IPhotoSceneError>;
    /**
     * Aborts the processing of a photoscene and marks it as cancelled.
     * @async
     * @param {string} photosceneid Specifices the ID of the photoscene to cancel.
     * @returns {IPhotoSceneCancelDelete|IPhotoSceneError} A JSON object containing information on cancelled job.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    cancelPhotoScene(photosceneid: string): Promise<IPhotoSceneCancelDelete | IPhotoSceneError>;
    /**
     * Deletes a photoscene and its associated assets (images, output files, ...).
     * @async
     * @param {string} photosceneid Specifices the ID of the photoscene to delete.
     * @returns {IPhotoSceneCancelDelete|IPhotoSceneError} A JSON object containing information on deleted job.
     * @throws Error when the request fails, for example, due to invalid request.
     */
    deletePhotoScene(photosceneid: string): Promise<IPhotoSceneCancelDelete | IPhotoSceneError>;
}
//# sourceMappingURL=reality-capture.d.ts.map