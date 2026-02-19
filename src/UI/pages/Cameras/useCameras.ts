import { useState, useEffect, useCallback } from "react";
import { Camera, cameraApi } from "./cameraApi";

export const useCameras = () => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCameras = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await cameraApi.getAll();
            setCameras(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const createCamera = async (camera: Camera) => {
        setIsLoading(true);
        try {
            await cameraApi.create(camera);
            await fetchCameras();
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCamera = async (id: string, camera: Camera) => {
        setIsLoading(true);
        try {
            await cameraApi.update(id, camera);
            await fetchCameras();
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const removeCamera = async (id: string) => {
        setIsLoading(true);
        try {
            await cameraApi.remove(id);
            await fetchCameras();
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const getCameraBySteamid = (steamid: string) => {
        return cameras.find((c) => c.steamid === steamid);
    };

    useEffect(() => {
        fetchCameras();
    }, [fetchCameras]);

    return {
        cameras,
        isLoading,
        fetchCameras,
        createCamera,
        updateCamera,
        removeCamera,
        getCameraBySteamid,
    };
};
