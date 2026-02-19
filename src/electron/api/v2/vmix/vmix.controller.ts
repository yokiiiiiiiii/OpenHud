import { Request, Response } from "express";
import * as VmixService from "./vmix.service.js";

/**
 * Get current vMix settings.
 */
export const getSettingsHandler = async (_req: Request, res: Response) => {
    try {
        const settings = await VmixService.getSettings();
        res.status(200).json(settings);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Update vMix settings.
 */
export const updateSettingsHandler = async (req: Request, res: Response) => {
    try {
        const {
            host,
            port,
            enabled,
            overlayCameraChannel,
            overlayCT,
            overlayT,
            overlayBomb,
        } = req.body;
        await VmixService.updateSettings(
            host || "127.0.0.1",
            port || 8088,
            enabled ? 1 : 0,
            overlayCameraChannel || 1,
            overlayCT || "",
            overlayT || "",
            overlayBomb || ""
        );
        const updated = await VmixService.getSettings();
        res.status(200).json(updated);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Check vMix connection status.
 */
export const checkConnectionHandler = async (_req: Request, res: Response) => {
    try {
        const result = await VmixService.checkConnection();
        res.status(200).json(result);
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};

/**
 * Manually send a vMix command (for testing).
 */
export const sendCommandHandler = async (req: Request, res: Response) => {
    try {
        const { functionName, input } = req.body;
        if (!functionName) {
            res.status(400).json({ error: "functionName is required" });
            return;
        }
        const success = await VmixService.sendCommand(functionName, input);
        res.status(200).json({ success });
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: "Unknown error" });
        }
    }
};
