import express from "express";

import {
    buscarHoteles,
    createHotel,
    deleteHotel,
    getHotelById,
    getHoteles,
    updateHotel
} from "../controllers/hotelesController.js";

import { verificarAdmin } from "../middleware/verificarAdmin.js";
import { verificarUsuario } from "../middleware/verificarUsuario.js";

const router = express.Router();

// ==========================
// RUTAS PÚBLICAS
// ==========================

// GET todos los hoteles
router.get("/", getHoteles);

// GET hoteles filtrados (por query: nombre, ciudad, precioMin, precioMax, categoria_estrellas)
router.get("/buscar", buscarHoteles);

// GET hotel por ID
router.get("/:id", getHotelById);

// ==========================
// RUTAS SOLO ADMIN
// ==========================

// POST crear hotel
router.post("/", verificarUsuario, verificarAdmin, createHotel);

// PUT actualizar hotel
router.put("/:id", verificarUsuario, verificarAdmin, updateHotel);

// DELETE eliminar hotel
router.delete("/:id", verificarUsuario, verificarAdmin, deleteHotel);

export default router;