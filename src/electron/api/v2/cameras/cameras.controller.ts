import { Request, Response } from "express";
import * as CameraService from "./cameras.service.js";

/**
 * Get all cameras.
 */
export const getAllCamerasHandler = async (_req: Request, res: Response) => {
    try {
        const cameras = await CameraService.getAllCameras();
        res.status(200).json(cameras);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Get a camera by steamid.
 */
export const getCameraBySteamidHandler = async (
    req: Request,
    res: Response
) => {
    try {
        const camera = await CameraService.getCameraBySteamid(req.params.steamid);
        if (!camera) {
            res.status(404).json({ error: "Camera not found" });
            return;
        }
        res.status(200).json(camera);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Create a camera.
 */
export const createCameraHandler = async (req: Request, res: Response) => {
    try {
        const { steamid, url, overlayName } = req.body;
        const id = await CameraService.createCamera(
            steamid,
            url,
            overlayName || null
        );
        res.status(201).json({ _id: id });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Update a camera.
 */
export const updateCameraHandler = async (req: Request, res: Response) => {
    try {
        const { steamid, url, overlayName } = req.body;
        const updatedId = await CameraService.updateCamera(
            req.params.id,
            steamid,
            url,
            overlayName || null
        );
        res.status(200).json({ _id: updatedId });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Remove a camera.
 */
export const removeCameraHandler = async (req: Request, res: Response) => {
    try {
        const removedId = await CameraService.removeCamera(req.params.id);
        res.status(200).json({ _id: removedId });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};
