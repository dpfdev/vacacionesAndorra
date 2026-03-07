import connection from "../config/db.js";

// Helper para manejar errores de forma consistente
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje, status });
};

// ==========================
// GET todos los eventos (público)
// ==========================
export const getEventos = (req, res) => {
    connection.query("SELECT * FROM eventos", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener eventos");
        res.json(results);
    });
};

// ==========================
// GET eventos filtrados (público)
// ==========================
export const buscarEventos = (req, res) => {
    const { id_evento, nombre, ciudad, precioMin, precioMax, fecha } = req.query;

    let condiciones = [];
    let valores = [];

    if (id_evento) { condiciones.push("id_evento = ?"); valores.push(id_evento); }
    if (nombre) { condiciones.push("nombre LIKE ?"); valores.push(`%${nombre}%`); }
    if (ciudad) { condiciones.push("ciudad LIKE ?"); valores.push(`%${ciudad}%`); }
    if (precioMin) { condiciones.push("precio >= ?"); valores.push(precioMin); }
    if (precioMax) { condiciones.push("precio <= ?"); valores.push(precioMax); }
    if (fecha) { condiciones.push("fecha = ?"); valores.push(fecha); }

    let sql = "SELECT * FROM eventos";
    if (condiciones.length > 0) sql += " WHERE " + condiciones.join(" AND ");

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar eventos");
        res.json(results);
    });
};

// ==========================
// GET evento por ID (público)
// ==========================
export const getEventoById = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM eventos WHERE id_evento = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener evento");
        if (results.length === 0) return res.status(404).json({ error: "Evento no encontrado" });
        res.json(results[0]);
    });
};

// ==========================
// POST crear evento (solo admin)
// ==========================
export const createEvento = (req, res) => {
    const { nombre, ciudad, fecha, precio, descripcion } = req.body;

    if (!nombre || !ciudad || !fecha || precio === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const sql = "INSERT INTO eventos (nombre, ciudad, fecha, precio, descripcion) VALUES (?, ?, ?, ?, ?)";
    connection.query(sql, [nombre, ciudad, fecha, precio, descripcion || null], (error, result) => {
        if (error) return responderError(res, error, "Error al crear evento");
        res.status(201).json({ mensaje: "Evento creado", id: result.insertId });
    });
};

// ==========================
// PUT actualizar evento (solo admin)
// ==========================
export const updateEvento = (req, res) => {
    const id = req.params.id;
    const { nombre, ciudad, fecha, precio, descripcion } = req.body;

    let campos = [];
    let valores = [];

    if (nombre) { campos.push("nombre = ?"); valores.push(nombre); }
    if (ciudad) { campos.push("ciudad = ?"); valores.push(ciudad); }
    if (fecha) { campos.push("fecha = ?"); valores.push(fecha); }
    if (precio !== undefined) { campos.push("precio = ?"); valores.push(precio); }
    if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }

    if (campos.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" });

    valores.push(id);
    const sql = `UPDATE eventos SET ${campos.join(", ")} WHERE id_evento = ?`;

    connection.query(sql, valores, (error, result) => {
        if (error) return responderError(res, error, "Error al actualizar evento");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Evento no encontrado" });
        res.json({ mensaje: "Evento actualizado" });
    });
};

// ==========================
// DELETE evento (solo admin)
// ==========================
export const deleteEvento = (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM eventos WHERE id_evento = ?", [id], (error, result) => {
        if (error) return responderError(res, error, "Error al eliminar evento");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Evento no encontrado" });
        res.json({ mensaje: "Evento eliminado" });
    });
};