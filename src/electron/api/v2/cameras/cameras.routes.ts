import { Router } from "express";
import * as CamerasController from "./cameras.controller.js";

export const cameraRoutes = Router();

/* ================== GETs ===================== */
cameraRoutes.get("/", CamerasController.getAllCamerasHandler);
cameraRoutes.get(
  "/steamid/:steamid",
  CamerasController.getCameraBySteamidHandler
);

/* ================== POSTs ===================== */
cameraRoutes.post("/", CamerasController.createCameraHandler);

/* ================== PUTs ===================== */
cameraRoutes.put("/:id", CamerasController.updateCameraHandler);

/* ================== DELETEs ===================== */
cameraRoutes.delete("/:id", CamerasController.removeCameraHandler);
