import express from "express";
import {
    buscarImagenes,
    createImagen,
    deleteImagen,
    getImagenById,
    getImagenes,
    updateImagen
} from "../controllers/imagenesController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// públicas
router.get("/", getImagenes);
router.get("/buscar", buscarImagenes);
router.get("/:id", getImagenById);

// admin
router.post("/", verificarUsuario, verificarAdmin, createImagen);
router.put("/:id", verificarUsuario, verificarAdmin, updateImagen);
router.delete("/:id", verificarUsuario, verificarAdmin, deleteImagen);

export default router;