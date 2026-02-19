import { Router } from "express";
import * as VmixController from "./vmix.controller.js";

export const vmixRoutes = Router();

/* ================== GETs ===================== */
vmixRoutes.get("/settings", VmixController.getSettingsHandler);
vmixRoutes.get("/status", VmixController.checkConnectionHandler);

/* ================== PUTs ===================== */
vmixRoutes.put("/settings", VmixController.updateSettingsHandler);

/* ================== POSTs ===================== */
vmixRoutes.post("/command", VmixController.sendCommandHandler);
