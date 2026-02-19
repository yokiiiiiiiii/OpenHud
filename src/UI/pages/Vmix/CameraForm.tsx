import { useState, useEffect } from "react";
import {
    ButtonContained,
    Container,
    TextInput,
    Dialog,
} from "../../components";
import { usePlayers } from "../../hooks";
import { Camera } from "../Cameras/cameraApi";
import { useCamerasContext } from "../Cameras/CamerasContext";

interface CameraFormProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedCamera?: Camera | null;
}

export const CameraForm = ({ open, setOpen, selectedCamera }: CameraFormProps) => {
    const { createCamera, updateCamera } = useCamerasContext();
    const { players } = usePlayers();

    const [steamid, setSteamId] = useState("");
    const [url, setUrl] = useState("");
    const [overlayName, setOverlayName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (selectedCamera) {
            setSteamId(selectedCamera.steamid);
            setUrl(selectedCamera.url);
            setOverlayName(selectedCamera.overlayName || "");
        } else {
            setSteamId("");
            setUrl("");
            setOverlayName("");
        }
    }, [selectedCamera, open]);

    const handleSubmit = async () => {
        if (!steamid || !url) return;

        setIsSubmitting(true);
        try {
            if (selectedCamera && selectedCamera._id) {
                await updateCamera(selectedCamera._id, { steamid, url, overlayName });
            } else {
                await createCamera({ steamid, url, overlayName });
            }
            setOpen(false);
        } catch (error) {
            console.error("Error submitting camera:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSteamIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSteamId(e.target.value);
    }

    return (
        <Dialog onClose={() => setOpen(false)} open={open}>
            <h1 className="mb-4">{selectedCamera ? "Edit Mapping" : "New Mapping"}</h1>
            <Container>
                <div className="grid w-full flex-1 gap-4 p-6">
                    <div>
                        <label className="mb-2 block font-medium text-text">Player</label>
                        <select
                            value={steamid}
                            onChange={handleSteamIdChange}
                            className="w-full rounded bg-background-light p-2 text-text"
                        >
                            <option value="">Select a player</option>
                            {players.map((player) => (
                                <option key={player.steamid} value={player.steamid}>
                                    {player.username} ({player.steamid})
                                </option>
                            ))}
                        </select>
                    </div>

                    <TextInput
                        label="SteamID64 (Manual Override)"
                        value={steamid}
                        onChange={(e) => setSteamId(e.target.value)}
                    />

                    <TextInput
                        label="Webcam URL"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />

                    <TextInput
                        label="vMix Input Name/Number"
                        value={overlayName}
                        onChange={(e) => setOverlayName(e.target.value)}
                    />
                </div>
            </Container>
            <div className="mt-4 flex justify-end gap-2 border-t border-border p-2">
                <ButtonContained onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save"}
                </ButtonContained>
                <ButtonContained onClick={() => setOpen(false)} color="secondary">
                    Cancel
                </ButtonContained>
            </div>
        </Dialog>
    );
};
