import express from "express";
import {
    buscarResenas,
    createResena,
    deleteResena,
    getResenaById,
    getResenas,
    updateResena
} from "../controllers/resenasController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// públicas
router.get("/", getResenas);
router.get("/buscar", buscarResenas);
router.get("/:id", getResenaById);

// privadas (solo usuario propietario o admin)
router.post("/", verificarUsuario, createResena);
router.put("/:id", verificarUsuario, updateResena);
router.delete("/:id", verificarUsuario, verificarAdmin, deleteResena);

export default router;