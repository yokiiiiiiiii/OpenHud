import { run_transaction } from "../helpers/utilities.js";
import * as CameraModel from "./cameras.data.js";
import { CameraRow } from "./cameras.data.js";

/**
 * Get all cameras.
 */
export const getAllCameras = async (): Promise<CameraRow[]> => {
    return await CameraModel.selectAll();
};

/**
 * Get a camera by steamid.
 */
export const getCameraBySteamid = async (
    steamid: string
): Promise<CameraRow | undefined> => {
    return await CameraModel.selectBySteamid(steamid);
};

/**
 * Create a new camera.
 */
export const createCamera = async (
    steamid: string,
    url: string,
    overlayName: string | null
): Promise<string> => {
    return run_transaction(async () => {
        return await CameraModel.insert(steamid, url, overlayName);
    });
};

/**
 * Update an existing camera.
 */
export const updateCamera = (
    id: string,
    steamid: string,
    url: string,
    overlayName: string | null
) => {
    return run_transaction(async () => {
        return await CameraModel.update(id, steamid, url, overlayName);
    });
};

/**
 * Remove a camera.
 */
export const removeCamera = (id: string) => {
    return run_transaction(async () => {
        return await CameraModel.remove(id);
    });
};
