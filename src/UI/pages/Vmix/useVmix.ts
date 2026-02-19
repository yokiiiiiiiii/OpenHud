import { useState, useEffect, useCallback } from "react";
import { vmixApi, VmixSettings } from "./vmixApi";

export const useVmix = () => {
    const [settings, setSettings] = useState<VmixSettings | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<{
        connected: boolean;
        error?: string;
    } | null>(null);

    const fetchSettings = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await vmixApi.getSettings();
            setSettings(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateSettings = async (newSettings: Partial<VmixSettings>) => {
        setIsLoading(true);
        try {
            const updated = await vmixApi.updateSettings(newSettings);
            setSettings(updated);
            return updated;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const checkConnection = async () => {
        setIsLoading(true);
        try {
            const status = await vmixApi.checkConnection();
            setConnectionStatus(status);
            return status;
        } catch (error) {
            console.error(error);
            setConnectionStatus({ connected: false, error: "Check failed" });
            return { connected: false, error: "Check failed" };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    return {
        settings,
        isLoading,
        connectionStatus,
        fetchSettings,
        updateSettings,
        checkConnection,
        sendCommand: vmixApi.sendCommand,
    };
};
