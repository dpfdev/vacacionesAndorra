import connection from "../config/db.js";

// ==========================
// Helper de errores
// ==========================
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje });
};

// ==========================
// GET todos los hoteles
// ==========================
export const getHoteles = (req, res) => {

    const sql = "SELECT * FROM hoteles WHERE activo = 1";

    connection.query(sql, (error, results) => {

        if (error) return responderError(res, error, "Error al obtener hoteles");

        res.json(results);

    });

};

// ==========================
// GET hotel por ID
// ==========================
export const getHotelById = (req, res) => {

    const id = req.params.id;

    const sql = "SELECT * FROM hoteles WHERE id_hotel = ?";

    connection.query(sql, [id], (error, results) => {

        if (error) return responderError(res, error, "Error al obtener hotel");

        if (results.length === 0) {
            return res.status(404).json({ error: "Hotel no encontrado" });
        }

        res.json(results[0]);

    });

};

// ==========================
// BUSCAR hoteles
// ==========================
export const buscarHoteles = (req, res) => {

    const {
        nombre,
        ciudad,
        pais,
        estrellas,
        precioMin,
        precioMax
    } = req.query;

    let condiciones = [];
    let valores = [];

    if (nombre) {
        condiciones.push("nombre LIKE ?");
        valores.push(`%${nombre}%`);
    }

    if (ciudad) {
        condiciones.push("ciudad LIKE ?");
        valores.push(`%${ciudad}%`);
    }

    if (pais) {
        condiciones.push("pais LIKE ?");
        valores.push(`%${pais}%`);
    }

    if (estrellas) {
        condiciones.push("categoria_estrellas = ?");
        valores.push(estrellas);
    }

    if (precioMin) {
        condiciones.push("precio_base_noche >= ?");
        valores.push(precioMin);
    }

    if (precioMax) {
        condiciones.push("precio_base_noche <= ?");
        valores.push(precioMax);
    }

    let sql = "SELECT * FROM hoteles";

    if (condiciones.length > 0) {
        sql += " WHERE " + condiciones.join(" AND ");
    }

    connection.query(sql, valores, (error, results) => {

        if (error) return responderError(res, error, "Error al buscar hoteles");

        res.json(results);

    });

};

// ==========================
// POST crear hotel (ADMIN)
// ==========================
export const createHotel = (req, res) => {

    const {
        nombre,
        descripcion,
        categoria_estrellas,
        direccion,
        ciudad,
        estado,
        pais,
        codigo_postal,
        latitud,
        longitud,
        telefono,
        email,
        sitio_web,
        precio_base_noche,
        moneda,
        activo
    } = req.body;

    // validación mínima
    if (!nombre || !categoria_estrellas || !direccion || !ciudad || !pais || !precio_base_noche) {
        return res.status(400).json({
            error: "Faltan campos obligatorios"
        });
    }

    const sql = `
    INSERT INTO hoteles (
        nombre,
        descripcion,
        categoria_estrellas,
        direccion,
        ciudad,
        estado,
        pais,
        codigo_postal,
        latitud,
        longitud,
        telefono,
        email,
        sitio_web,
        precio_base_noche,
        moneda,
        activo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        nombre,
        descripcion || null,
        categoria_estrellas,
        direccion,
        ciudad,
        estado || null,
        pais,
        codigo_postal || null,
        latitud || null,
        longitud || null,
        telefono || null,
        email || null,
        sitio_web || null,
        precio_base_noche,
        moneda || "USD",
        activo ?? 1
    ];

    connection.query(sql, valores, (error, result) => {

        if (error) return responderError(res, error, "Error al crear hotel");

        res.status(201).json({
            mensaje: "Hotel creado",
            id: result.insertId
        });

    });

};

// ==========================
// PUT actualizar hotel (ADMIN)
// ==========================
export const updateHotel = (req, res) => {

    const id = req.params.id;

    const {
        nombre,
        descripcion,
        categoria_estrellas,
        direccion,
        ciudad,
        estado,
        pais,
        codigo_postal,
        latitud,
        longitud,
        telefono,
        email,
        sitio_web,
        precio_base_noche,
        moneda,
        activo
    } = req.body;

    let campos = [];
    let valores = [];

    if (nombre) { campos.push("nombre = ?"); valores.push(nombre); }
    if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }
    if (categoria_estrellas) { campos.push("categoria_estrellas = ?"); valores.push(categoria_estrellas); }
    if (direccion) { campos.push("direccion = ?"); valores.push(direccion); }
    if (ciudad) { campos.push("ciudad = ?"); valores.push(ciudad); }
    if (estado !== undefined) { campos.push("estado = ?"); valores.push(estado); }
    if (pais) { campos.push("pais = ?"); valores.push(pais); }
    if (codigo_postal !== undefined) { campos.push("codigo_postal = ?"); valores.push(codigo_postal); }
    if (latitud !== undefined) { campos.push("latitud = ?"); valores.push(latitud); }
    if (longitud !== undefined) { campos.push("longitud = ?"); valores.push(longitud); }
    if (telefono !== undefined) { campos.push("telefono = ?"); valores.push(telefono); }
    if (email !== undefined) { campos.push("email = ?"); valores.push(email); }
    if (sitio_web !== undefined) { campos.push("sitio_web = ?"); valores.push(sitio_web); }
    if (precio_base_noche) { campos.push("precio_base_noche = ?"); valores.push(precio_base_noche); }
    if (moneda !== undefined) { campos.push("moneda = ?"); valores.push(moneda); }
    if (activo !== undefined) { campos.push("activo = ?"); valores.push(activo); }

    if (campos.length === 0) {
        return res.status(400).json({
            error: "Debe enviar al menos un campo para actualizar"
        });
    }

    valores.push(id);

    const sql = `UPDATE hoteles SET ${campos.join(", ")} WHERE id_hotel = ?`;

    connection.query(sql, valores, (error, result) => {

        if (error) return responderError(res, error, "Error al actualizar hotel");

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Hotel no encontrado" });
        }

        res.json({ mensaje: "Hotel actualizado" });

    });

};

// ==========================
// DELETE hotel (ADMIN)
// ==========================
export const deleteHotel = (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM hoteles WHERE id_hotel = ?";

    connection.query(sql, [id], (error, result) => {

        if (error) return responderError(res, error, "Error al eliminar hotel");

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Hotel no encontrado" });
        }

        res.json({ mensaje: "Hotel eliminado" });

    });

};







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

// públicas
router.get("/", getHoteles);
router.get("/buscar", buscarHoteles);
router.get("/:id", getHotelById);

// admin
router.post("/", verificarUsuario, verificarAdmin, createHotel);
router.put("/:id", verificarUsuario, verificarAdmin, updateHotel);
router.delete("/:id", verificarUsuario, verificarAdmin, deleteHotel);

export default router;