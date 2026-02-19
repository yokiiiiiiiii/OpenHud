import { database } from "../../../configs/database.js";
import { v4 as uuidv4 } from "uuid";

export interface CameraRow {
    _id: string;
    steamid: string;
    url: string;
    overlayName: string | null;
}

/**
 * Select all cameras.
 */
export const selectAll = (): Promise<CameraRow[]> => {
    return new Promise((resolve, reject) => {
        const statement = "SELECT * FROM cameras ORDER BY overlayName ASC";
        database.all(statement, [], (error: Error, rows: CameraRow[]) => {
            if (error) {
                console.error("Error getting all cameras:", error);
                reject(error);
            } else resolve(rows || []);
        });
    });
};

/**
 * Select a camera by steamid.
 */
export const selectBySteamid = (steamid: string): Promise<CameraRow | undefined> => {
    return new Promise((resolve, reject) => {
        const statement = "SELECT * FROM cameras WHERE steamid = ?";
        database.get(statement, [steamid], (error: Error, row: CameraRow) => {
            if (error) {
                console.error(`Error finding camera for steamid: ${steamid}`, error);
                reject(error);
            } else resolve(row);
        });
    });
};

/**
 * Select a camera by id.
 */
export const selectById = (id: string): Promise<CameraRow | undefined> => {
    return new Promise((resolve, reject) => {
        const statement = "SELECT * FROM cameras WHERE _id = ?";
        database.get(statement, [id], (error: Error, row: CameraRow) => {
            if (error) {
                console.error(`Error finding camera with id: ${id}`, error);
                reject(error);
            } else resolve(row);
        });
    });
};

/**
 * Insert a new camera.
 */
export const insert = (
    steamid: string,
    url: string,
    overlayName: string | null
): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!steamid) return reject(new Error("steamid is required"));
        if (!url) return reject(new Error("url is required"));

        const id = uuidv4();
        const statement =
            "INSERT INTO cameras (_id, steamid, url, overlayName) VALUES (?, ?, ?, ?)";
        database.run(
            statement,
            [id, steamid, url, overlayName || null],
            (error: Error) => {
                if (error) {
                    console.error("Error creating camera:", error);
                    return reject(error);
                }
                resolve(id);
            }
        );
    });
};

/**
 * Update an existing camera.
 */
export const update = (
    id: string,
    steamid: string,
    url: string,
    overlayName: string | null
): Promise<string> => {
    return new Promise((resolve, reject) => {
        if (!id) return reject(new Error("id is required to update camera"));

        const statement =
            "UPDATE cameras SET steamid = ?, url = ?, overlayName = ? WHERE _id = ?";
        database.run(
            statement,
            [steamid, url, overlayName || null, id],
            (error: Error) => {
                if (error) {
                    console.error("Error updating camera:", error);
                    return reject(error);
                }
                resolve(id);
            }
        );
    });
};

/**
 * Remove a camera by id.
 */
export const remove = (id: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const statement = "DELETE FROM cameras WHERE _id = ?";
        database.run(statement, [id], (error: Error) => {
            if (error) {
                console.error("Error removing camera:", error);
                reject(error);
            } else resolve(id);
        });
    });
};
