import express from "express";
import {
    buscarEventos,
    createEvento,
    deleteEvento,
    getEventoById,
    getEventos,
    updateEvento
} from "../controllers/eventosController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";

const router = express.Router();

// ==========================
// RUTAS PÚBLICAS
// ==========================
router.get("/", getEventos);
router.get("/buscar", buscarEventos);
router.get("/:id", getEventoById);

// ==========================
// RUTAS ADMIN
// ==========================
router.post("/", verificarAdmin, createEvento);
router.put("/:id", verificarAdmin, updateEvento);
router.delete("/:id", verificarAdmin, deleteEvento);

export default router;