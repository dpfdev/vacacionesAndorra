import express from "express";
import { loginUsuario } from "../controllers/usuariosController.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", loginUsuario);

export default router;