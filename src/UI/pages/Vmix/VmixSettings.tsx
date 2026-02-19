import { useState, useEffect } from "react";
import { useVmix } from "./useVmix";
import { ButtonContained, TextInput } from "../../components";

export const VmixSettings = () => {
    const { settings, updateSettings, checkConnection, connectionStatus } = useVmix();
    const [formState, setFormState] = useState({
        host: "127.0.0.1",
        port: 8088,
        enabled: false,
        overlayCameraChannel: 1,
        overlayCT: "",
        overlayT: "",
        overlayBomb: "",
    });
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormState({
                host: settings.host,
                port: settings.port,
                enabled: settings.enabled === 1,
                overlayCameraChannel: settings.overlayCameraChannel,
                overlayCT: settings.overlayCT,
                overlayT: settings.overlayT,
                overlayBomb: settings.overlayBomb,
            });
        }
    }, [settings]);

    const handleChange = (field: string, value: any) => {
        setFormState((prev) => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleSave = async () => {
        await updateSettings({
            ...formState,
            enabled: formState.enabled ? 1 : 0,
        });
        setIsDirty(false);
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-background-secondary p-6 shadow-md">
            <h2 className="text-xl font-semibold border-b border-border pb-2">vMix Connection</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                    label="IP Address"
                    value={formState.host}
                    onChange={(e) => handleChange("host", e.target.value)}
                />
                <TextInput
                    label="Port"
                    value={String(formState.port)}
                    onChange={(e) => handleChange("port", parseInt(e.target.value) || 8088)}
                />
            </div>

            <div className="flex items-center gap-2 py-2">
                <input
                    type="checkbox"
                    id="enabled"
                    checked={formState.enabled}
                    onChange={(e) => handleChange("enabled", e.target.checked)}
                    className="size-5 rounded border-gray-600 bg-gray-700 text-primary focus:ring-primary"
                />
                <label htmlFor="enabled" className="text-text font-medium">Enable vMix Integration</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <h3 className="col-span-full font-semibold px-1">Global Overlays (vMix Input Names)</h3>
                <TextInput
                    label="Camera Overlay Channel (1-4)"
                    value={String(formState.overlayCameraChannel)}
                    onChange={(e) => handleChange("overlayCameraChannel", parseInt(e.target.value) || 1)}
                />
                {/* Spacer */}
                <div></div>

                <TextInput
                    label="CT Win Overlay Input"
                    value={formState.overlayCT}
                    onChange={(e) => handleChange("overlayCT", e.target.value)}
                />
                <TextInput
                    label="T Win Overlay Input"
                    value={formState.overlayT}
                    onChange={(e) => handleChange("overlayT", e.target.value)}
                />
                <TextInput
                    label="Bomb Overlay Input"
                    value={formState.overlayBomb}
                    onChange={(e) => handleChange("overlayBomb", e.target.value)}
                />
            </div>

            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <div className="flex-1 flex items-center">
                    {connectionStatus && (
                        <span className={connectionStatus.connected ? "text-green-500" : "text-red-500"}>
                            {connectionStatus.connected ? "Connected" : `Error: ${connectionStatus.error}`}
                        </span>
                    )}
                </div>
                <ButtonContained onClick={checkConnection} color="secondary">
                    Test Connection
                </ButtonContained>
                <ButtonContained onClick={handleSave} disabled={!isDirty}>
                    Save Settings
                </ButtonContained>
            </div>
        </div>
    );
};
