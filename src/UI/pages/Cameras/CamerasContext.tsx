import React, { createContext, useContext, useState, useEffect } from "react";
import { Camera, cameraApi } from "./cameraApi";

interface CamerasContextType {
    cameras: Camera[];
    isLoading: boolean;
    fetchCameras: () => Promise<void>;
    createCamera: (camera: Camera) => Promise<void>;
    updateCamera: (id: string, camera: Camera) => Promise<void>;
    removeCamera: (id: string) => Promise<void>;
}

const CamerasContext = createContext<CamerasContextType | undefined>(undefined);

export const CamerasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCameras = async () => {
        setIsLoading(true);
        try {
            const data = await cameraApi.getAll();
            setCameras(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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

    useEffect(() => {
        fetchCameras();
    }, []);

    return (
        <CamerasContext.Provider
            value={{
                cameras,
                isLoading,
                fetchCameras,
                createCamera,
                updateCamera,
                removeCamera,
            }}
        >
            {children}
        </CamerasContext.Provider>
    );
};

export const useCamerasContext = () => {
    const context = useContext(CamerasContext);
    if (!context) {
        throw new Error("useCamerasContext must be used within a CamerasProvider");
    }
    return context;
};
