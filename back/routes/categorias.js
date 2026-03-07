import express from "express";
import {
    buscarCategorias,
    createCategoria,
    deleteCategoria,
    getCategoriaById,
    getCategorias,
    updateCategoria
} from "../controllers/categoriasController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// públicas
router.get("/", getCategorias);
router.get("/buscar", buscarCategorias);
router.get("/:id", getCategoriaById);

// admin
router.post("/", verificarUsuario, verificarAdmin, createCategoria);
router.put("/:id", verificarUsuario, verificarAdmin, updateCategoria);
router.delete("/:id", verificarUsuario, verificarAdmin, deleteCategoria);

export default router;