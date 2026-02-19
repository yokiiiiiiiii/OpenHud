import { apiUrl as API_BASE_URL } from "../../api/api";

export interface Camera {
    _id?: string;
    steamid: string;
    url: string;
    overlayName?: string;
}

export const cameraApi = {
    getAll: async (): Promise<Camera[]> => {
        const response = await fetch(`${API_BASE_URL}/camera`);
        if (!response.ok) throw new Error("Failed to fetch cameras");
        return response.json();
    },

    getBySteamid: async (steamid: string): Promise<Camera> => {
        const response = await fetch(`${API_BASE_URL}/camera/steamid/${steamid}`);
        if (!response.ok) throw new Error(`Failed to fetch camera for steamid: ${steamid}`);
        return response.json();
    },

    create: async (camera: Camera): Promise<{ _id: string }> => {
        const response = await fetch(`${API_BASE_URL}/camera`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(camera),
        });
        if (!response.ok) throw new Error("Failed to create camera");
        return response.json();
    },

    update: async (id: string, camera: Camera): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/camera/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(camera),
        });
        if (!response.ok) throw new Error("Failed to update camera");
    },

    remove: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/camera/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Failed to remove camera");
    },
};
