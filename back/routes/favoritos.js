import express from "express";
import {
    buscarFavoritos,
    createFavorito,
    deleteFavorito,
    getFavoritoById,
    getFavoritos,
    updateFavorito
} from "../controllers/favoritosController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// públicas
router.get("/", getFavoritos);
router.get("/buscar", buscarFavoritos);
router.get("/:id", getFavoritoById);

// privadas (usuario propietario o admin)
router.post("/", verificarUsuario, createFavorito);
router.put("/:id", verificarUsuario, updateFavorito);
router.delete("/:id", verificarUsuario, verificarAdmin, deleteFavorito);

export default router;