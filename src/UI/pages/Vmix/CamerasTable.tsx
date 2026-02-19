import { useState } from "react";
import { MdDelete, MdEdit, MdAdd } from "react-icons/md";
import { PrimaryButton, ButtonContained } from "../../components";
import { useCamerasContext } from "../Cameras/CamerasContext";
import { Camera } from "../Cameras/cameraApi";
import { usePlayers } from "../../hooks";
import { CameraForm } from "./CameraForm";

export const CamerasTable = () => {
    const { cameras, removeCamera } = useCamerasContext();
    const { players } = usePlayers();
    const [openForm, setOpenForm] = useState(false);
    const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);

    const getPlayerName = (steamid: string) => {
        const player = players.find((p) => p.steamid === steamid);
        return player ? player.username : steamid;
    };

    const handleEdit = (camera: Camera) => {
        setSelectedCamera(camera);
        setOpenForm(true);
    };

    const handleCreate = () => {
        setSelectedCamera(null);
        setOpenForm(true);
    };

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-background-secondary p-6 shadow-md mt-6">
            <div className="flex items-center justify-between border-b border-border pb-2">
                <h2 className="text-xl font-semibold">Camera Mappings</h2>
                <ButtonContained onClick={handleCreate}>
                    <MdAdd className="mr-2" /> Add Mapping
                </ButtonContained>
            </div>

            <CameraForm open={openForm} setOpen={setOpenForm} selectedCamera={selectedCamera} />

            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead className="border-b border-border text-left">
                        <tr>
                            <th className="p-3">Player / Slot</th>
                            <th className="p-3">Webcam URL</th>
                            <th className="p-3">vMix Input</th>
                            <th className="p-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {cameras.map((camera) => (
                            <tr key={camera._id} className="hover:bg-background-light">
                                <td className="p-3 font-medium">
                                    {getPlayerName(camera.steamid)}
                                    <div className="text-xs text-text-secondary">{camera.steamid}</div>
                                </td>
                                <td className="p-3 truncate max-w-xs">{camera.url}</td>
                                <td className="p-3">{camera.overlayName || "-"}</td>
                                <td className="p-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <PrimaryButton onClick={() => handleEdit(camera)}>
                                            <MdEdit size={18} />
                                        </PrimaryButton>
                                        <PrimaryButton onClick={() => camera._id && removeCamera(camera._id)}>
                                            <MdDelete size={18} />
                                        </PrimaryButton>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {cameras.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center text-text-secondary">
                                    No mappings found. Add one to link a player to a camera.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
