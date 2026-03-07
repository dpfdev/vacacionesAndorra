// routes/usuarios.js
import express from "express";
import {
    createUsuario,
    deleteUsuario,
    getUsuarioById,
    getUsuarios,
    loginUsuario,
    updateUsuario
} from "../controllers/usuariosController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// ==========================
// RUTAS PÚBLICAS
// ==========================

// POST registro de usuario (usuario o admin)
router.post("/register", createUsuario);

// POST login de usuario
router.post("/login", loginUsuario);

// ==========================
// RUTAS PRIVADAS
// ==========================

// GET todos los usuarios (solo admin)
router.get("/", verificarUsuario, verificarAdmin, getUsuarios);

// GET usuario por ID (propio o admin)
router.get("/:id", verificarUsuario, getUsuarioById);

// PUT actualizar usuario (propio o admin)
router.put("/:id", verificarUsuario, updateUsuario);

// DELETE usuario (solo admin)
router.delete("/:id", verificarUsuario, verificarAdmin, deleteUsuario);

export default router;