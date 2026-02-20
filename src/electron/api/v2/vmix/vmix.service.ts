import * as VmixData from "./vmix.data.js";

let cachedSettings: VmixData.VmixSettingsRow | null = null;

/**
 * Refresh the cached settings from the database.
 */
export const refreshSettings = async () => {
    cachedSettings = await VmixData.getSettings();
    return cachedSettings;
};

/**
 * Get cached settings (or fetch if not yet cached).
 */
export const getSettings = async (): Promise<VmixData.VmixSettingsRow> => {
    if (!cachedSettings) {
        cachedSettings = await VmixData.getSettings();
    }
    return cachedSettings;
};

/**
 * Build the vMix API base URL from settings.
 */
const getApiUrl = async (): Promise<string> => {
    const settings = await getSettings();
    return `http://${settings.host}:${settings.port}/api/`;
};

/**
 * Send a command to vMix Web API via HTTP GET.
 * @param functionName - vMix API function name (e.g. OverlayInput1In)
 * @param input - Optional input name/number
 */
export const sendCommand = async (
    functionName: string,
    input?: string
): Promise<boolean> => {
    const settings = await getSettings();
    if (!settings.enabled) {
        return false;
    }

    try {
        const baseUrl = await getApiUrl();
        let url = `${baseUrl}?Function=${encodeURIComponent(functionName)}`;
        if (input) {
            url += `&Input=${encodeURIComponent(input)}`;
        }

        console.log(`[vMix] Sending: ${url}`);
        const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
        if (!response.ok) {
            console.error(
                `[vMix] Command failed: ${functionName}, status: ${response.status}`
            );
            return false;
        }
        return true;
    } catch (error) {
        console.error(`[vMix] Connection error:`, error);
        return false;
    }
};

/**
 * Show an overlay (transition in).
 * @param overlayNumber - Overlay channel number (1-4)
 * @param inputName - vMix input name or number
 */
export const showOverlay = async (
    overlayNumber: number,
    inputName: string
): Promise<boolean> => {
    if (!inputName) return false;
    return sendCommand(`OverlayInput${overlayNumber}In`, inputName);
};

/**
 * Hide an overlay (transition out).
 * @param overlayNumber - Overlay channel number (1-4)
 */
export const hideOverlay = async (
    overlayNumber: number
): Promise<boolean> => {
    return sendCommand(`OverlayInput${overlayNumber}Out`);
};

/**
 * Turn off an overlay immediately (no transition).
 * @param overlayNumber - Overlay channel number (1-4)
 */
export const offOverlay = async (
    overlayNumber: number
): Promise<boolean> => {
    return sendCommand(`OverlayInput${overlayNumber}Off`);
};

/**
 * Check connection to vMix by fetching the API status (XML).
 */
export const checkConnection = async (): Promise<{
    connected: boolean;
    error?: string;
}> => {
    try {
        const baseUrl = await getApiUrl();
        const response = await fetch(baseUrl, { signal: AbortSignal.timeout(5000) });
        if (response.ok) {
            return { connected: true };
        }
        return { connected: false, error: `HTTP ${response.status}` };
    } catch (error) {
        return {
            connected: false,
            error: error instanceof Error ? error.message : "Connection failed",
        };
    }
};

/**
 * Update vMix settings in DB and refresh cache.
 */
export const updateSettings = async (
    host: string,
    port: number,
    enabled: number,
    overlayCameraChannel: number,
    overlayCT: string,
    overlayT: string,
    overlayBomb: string
) => {
    await VmixData.updateSettings(
        host,
        port,
        enabled,
        overlayCameraChannel,
        overlayCT,
        overlayT,
        overlayBomb
    );
    await refreshSettings();
};

// ============= GSI-triggered vMix actions =============

/**
 * Switch camera overlay to the specified input name.
 * Uses the overlayCameraChannel from settings.
 */
export const switchCameraOverlay = async (
    inputName: string
): Promise<boolean> => {
    const settings = await getSettings();
    if (!settings.enabled || !inputName) return false;
    return showOverlay(settings.overlayCameraChannel, inputName);
};

/**
 * Show CT round win overlay.
 */
export const showCTWinOverlay = async (): Promise<boolean> => {
    const settings = await getSettings();
    if (!settings.enabled || !settings.overlayCT) return false;
    return showOverlay(2, settings.overlayCT);
};

/**
 * Show T round win overlay.
 */
export const showTWinOverlay = async (): Promise<boolean> => {
    const settings = await getSettings();
    if (!settings.enabled || !settings.overlayT) return false;
    return showOverlay(3, settings.overlayT);
};

/**
 * Hide round win overlays.
 */
export const hideRoundOverlays = async (): Promise<void> => {
    await hideOverlay(2);
    await hideOverlay(3);
};

/**
 * Show bomb planted overlay.
 */
export const showBombOverlay = async (): Promise<boolean> => {
    const settings = await getSettings();
    if (!settings.enabled || !settings.overlayBomb) return false;
    return showOverlay(4, settings.overlayBomb);
};

/**
 * Hide bomb overlay.
 */
export const hideBombOverlay = async (): Promise<boolean> => {
    return hideOverlay(4);
};
