import express from "express";
import {
    buscarActividades,
    createActividad,
    deleteActividad,
    getActividadById,
    getActividades,
    updateActividad
} from "../controllers/actividadesController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// públicas
router.get("/", getActividades);
router.get("/buscar", buscarActividades);
router.get("/:id", getActividadById);

// admin
router.post("/", verificarUsuario, verificarAdmin, createActividad);
router.put("/:id", verificarUsuario, verificarAdmin, updateActividad);
router.delete("/:id", verificarUsuario, verificarAdmin, deleteActividad);

export default router;