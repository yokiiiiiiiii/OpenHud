import { database } from "../../../configs/database.js";

export interface VmixSettingsRow {
    _id: string;
    host: string;
    port: number;
    enabled: number;
    overlayCameraChannel: number;
    overlayCT: string;
    overlayT: string;
    overlayBomb: string;
}

/**
 * Get the vMix settings (singleton row).
 */
export const getSettings = (): Promise<VmixSettingsRow> => {
    return new Promise((resolve, reject) => {
        const statement = "SELECT * FROM vmix_settings WHERE _id = 'default'";
        database.get(statement, [], (error: Error, row: VmixSettingsRow) => {
            if (error) {
                console.error("Error getting vmix settings:", error);
                reject(error);
            } else {
                resolve(
                    row || {
                        _id: "default",
                        host: "127.0.0.1",
                        port: 8088,
                        enabled: 0,
                        overlayCameraChannel: 1,
                        overlayCT: "",
                        overlayT: "",
                        overlayBomb: "",
                    }
                );
            }
        });
    });
};

/**
 * Update vMix settings.
 */
export const updateSettings = (
    host: string,
    port: number,
    enabled: number,
    overlayCameraChannel: number,
    overlayCT: string,
    overlayT: string,
    overlayBomb: string
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const statement = `
      UPDATE vmix_settings 
      SET host = ?, port = ?, enabled = ?, overlayCameraChannel = ?,
          overlayCT = ?, overlayT = ?, overlayBomb = ?
      WHERE _id = 'default'
    `;
        database.run(
            statement,
            [host, port, enabled, overlayCameraChannel, overlayCT, overlayT, overlayBomb],
            (error: Error) => {
                if (error) {
                    console.error("Error updating vmix settings:", error);
                    reject(error);
                } else resolve();
            }
        );
    });
};
