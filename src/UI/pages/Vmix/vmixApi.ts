import { apiUrl as API_BASE_URL } from "../../api/api";

export interface VmixSettings {
    _id: string;
    host: string;
    port: number;
    enabled: number; // 0 or 1
    overlayCameraChannel: number;
    overlayCT: string;
    overlayT: string;
    overlayBomb: string;
}

export const vmixApi = {
    getSettings: async (): Promise<VmixSettings> => {
        const response = await fetch(`${API_BASE_URL}/vmix/settings`);
        if (!response.ok) throw new Error("Failed to fetch vMix settings");
        return response.json();
    },

    updateSettings: async (settings: Partial<VmixSettings>): Promise<VmixSettings> => {
        const response = await fetch(`${API_BASE_URL}/vmix/settings`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error("Failed to update vMix settings");
        return response.json();
    },

    checkConnection: async (): Promise<{ connected: boolean; error?: string }> => {
        const response = await fetch(`${API_BASE_URL}/vmix/status`);
        if (!response.ok) throw new Error("Failed to check connection");
        return response.json();
    },

    sendCommand: async (functionName: string, input?: string): Promise<{ success: boolean }> => {
        const response = await fetch(`${API_BASE_URL}/vmix/command`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ functionName, input }),
        });
        if (!response.ok) throw new Error("Failed to send command");
        return response.json();
    },
};
