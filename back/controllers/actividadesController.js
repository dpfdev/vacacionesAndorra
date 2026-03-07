import connection from "../config/db.js";

// Helper para manejar errores de forma consistente
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje });
};

// ==========================
// GET todos los hoteles (público)
// ==========================
export const getActividades = (req, res) => {
    connection.query("SELECT * FROM actividades", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener actividades");
        res.json(results);
    });
};

// ==========================
// GET actividades filtradas (público)
// ==========================
export const buscarActividades = (req, res) => {
    const { id, nombre, ciudad, precioMin, precioMax, mediaMin, mediaMax } = req.query;

    let condiciones = [];
    let valores = [];

    if (id) { condiciones.push("id_actividad = ?"); valores.push(id); }
    if (nombre) { condiciones.push("nombre LIKE ?"); valores.push(`%${nombre}%`); }
    if (ciudad) { condiciones.push("ciudad LIKE ?"); valores.push(`%${ciudad}%`); }
    if (precioMin) { condiciones.push("precio >= ?"); valores.push(precioMin); }
    if (precioMax) { condiciones.push("precio <= ?"); valores.push(precioMax); }
    if (mediaMin) { condiciones.push("media >= ?"); valores.push(mediaMin); }
    if (mediaMax) { condiciones.push("media <= ?"); valores.push(mediaMax); }

    let sql = "SELECT * FROM actividades";
    if (condiciones.length > 0) sql += " WHERE " + condiciones.join(" AND ");

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar actividades");
        res.json(results);
    });
};

// ==========================
// GET actividad por ID (público)
// ==========================
export const getActividadById = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM actividades WHERE id_actividad = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener actividad");
        if (results.length === 0) return res.status(404).json({ error: "Actividad no encontrada" });
        res.json(results[0]);
    });
};

// ==========================
// POST crear actividad (solo admin)
// ==========================
export const createActividad = (req, res) => {
    const { nombre, ciudad, precio, descripcion } = req.body;

    // Validación
    if (!nombre || !ciudad || precio === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    if (isNaN(precio) || precio <= 0) {
        return res.status(400).json({ error: "Precio inválido" });
    }

    const sql = "INSERT INTO actividades (nombre, ciudad, precio, descripcion) VALUES (?, ?, ?, ?)";
    connection.query(sql, [nombre, ciudad, precio, descripcion || null], (error, result) => {
        if (error) return responderError(res, error, "Error al crear actividad");
        res.status(201).json({ mensaje: "Actividad creada", id: result.insertId });
    });
};

// ==========================
// PUT actualizar actividad (solo admin)
// ==========================
export const updateActividad = (req, res) => {
    const id = req.params.id;
    const { nombre, ciudad, precio, descripcion } = req.body;

    if (!nombre && !ciudad && !precio && !descripcion) {
        return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    let campos = [];
    let valores = [];

    if (nombre) { campos.push("nombre = ?"); valores.push(nombre); }
    if (ciudad) { campos.push("ciudad = ?"); valores.push(ciudad); }
    if (precio !== undefined) {
        if (isNaN(precio) || precio <= 0) {
            return res.status(400).json({ error: "Precio inválido" });
        }
        campos.push("precio = ?"); valores.push(precio);
    }
    if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }

    valores.push(id); // para WHERE

    const sql = `UPDATE actividades SET ${campos.join(", ")} WHERE id_actividad = ?`;
    connection.query(sql, valores, (error, result) => {
        if (error) return responderError(res, error, "Error al actualizar actividad");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Actividad no encontrada" });
        res.json({ mensaje: "Actividad actualizada" });
    });
};

// ==========================
// DELETE actividad (solo admin)
// ==========================
export const deleteActividad = (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM actividades WHERE id_actividad = ?", [id], (error, result) => {
        if (error) return responderError(res, error, "Error al eliminar actividad");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Actividad no encontrada" });
        res.json({ mensaje: "Actividad eliminada" });
    });
};