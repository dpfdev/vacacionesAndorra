import connection from "../config/db.js";

// Helper para manejar errores de forma consistente
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje });
};

// ==========================
// GET todas las imágenes (público)
// ==========================
export const getImagenes = (req, res) => {
    connection.query("SELECT * FROM imagenes", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener imágenes");
        res.json(results);
    });
};

// ==========================
// GET imágenes filtradas (público)
// ==========================
export const buscarImagenes = (req, res) => {
    const { id_imagen, tipo_objeto, id_objeto } = req.query;

    let condiciones = [];
    let valores = [];

    if (id_imagen) { condiciones.push("id_imagen = ?"); valores.push(id_imagen); }
    if (tipo_objeto) { condiciones.push("tipo_objeto LIKE ?"); valores.push(`%${tipo_objeto}%`); }
    if (id_objeto) { condiciones.push("id_objeto = ?"); valores.push(id_objeto); }

    let sql = "SELECT * FROM imagenes";
    if (condiciones.length > 0) sql += " WHERE " + condiciones.join(" AND ");

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar imágenes");
        res.json(results);
    });
};

// ==========================
// GET imagen por ID (público)
// ==========================
export const getImagenById = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM imagenes WHERE id_imagen = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener imagen");
        if (results.length === 0) return res.status(404).json({ error: "Imagen no encontrada" });
        res.json(results[0]);
    });
};

// ==========================
// POST crear imagen (solo admin)
// ==========================
export const createImagen = (req, res) => {
    const { tipo_objeto, id_objeto, url, descripcion } = req.body;

    // Validación
    if (!tipo_objeto || !id_objeto || !url) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const sql = "INSERT INTO imagenes (tipo_objeto, id_objeto, url, descripcion, fecha_subida) VALUES (?, ?, ?, ?, NOW())";
    connection.query(sql, [tipo_objeto, id_objeto, url, descripcion || null], (error, result) => {
        if (error) return responderError(res, error, "Error al crear imagen");
        res.status(201).json({ mensaje: "Imagen creada", id: result.insertId });
    });
};

// ==========================
// PUT actualizar imagen (solo admin)
// ==========================
export const updateImagen = (req, res) => {
    const id = req.params.id;
    const { tipo_objeto, id_objeto, url, descripcion } = req.body;

    if (!tipo_objeto && !id_objeto && !url && !descripcion) {
        return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    let campos = [];
    let valores = [];

    if (tipo_objeto) { campos.push("tipo_objeto = ?"); valores.push(tipo_objeto); }
    if (id_objeto) { campos.push("id_objeto = ?"); valores.push(id_objeto); }
    if (url) { campos.push("url = ?"); valores.push(url); }
    if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }

    valores.push(id); // para WHERE

    const sql = `UPDATE imagenes SET ${campos.join(", ")} WHERE id_imagen = ?`;
    connection.query(sql, valores, (error, result) => {
        if (error) return responderError(res, error, "Error al actualizar imagen");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Imagen no encontrada" });
        res.json({ mensaje: "Imagen actualizada" });
    });
};

// ==========================
// DELETE imagen (solo admin)
// ==========================
export const deleteImagen = (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM imagenes WHERE id_imagen = ?", [id], (error, result) => {
        if (error) return responderError(res, error, "Error al eliminar imagen");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Imagen no encontrada" });
        res.json({ mensaje: "Imagen eliminada" });
    });
};