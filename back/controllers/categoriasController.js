import connection from "../config/db.js";

// Helper para manejar errores de forma consistente
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje });
};

// ==========================
// GET todas las categorías (público)
// ==========================
export const getCategorias = (req, res) => {
    connection.query("SELECT * FROM categorias", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener categorías");
        res.json(results);
    });
};

// ==========================
// GET categorías filtradas (público)
// ==========================
export const buscarCategorias = (req, res) => {
    const { id_categoria, nombre } = req.query;

    let condiciones = [];
    let valores = [];

    if (id_categoria) { condiciones.push("id_categoria = ?"); valores.push(id_categoria); }
    if (nombre) { condiciones.push("nombre LIKE ?"); valores.push(`%${nombre}%`); }

    let sql = "SELECT * FROM categorias";
    if (condiciones.length > 0) sql += " WHERE " + condiciones.join(" AND ");

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar categorías");
        res.json(results);
    });
};

// ==========================
// GET categoría por ID (público)
// ==========================
export const getCategoriaById = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM categorias WHERE id_categoria = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener categoría");
        if (results.length === 0) return res.status(404).json({ error: "Categoría no encontrada" });
        res.json(results[0]);
    });
};

// ==========================
// POST crear categoría (solo admin)
// ==========================
export const createCategoria = (req, res) => {
    const { nombre, descripcion } = req.body;

    // Validación
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const sql = "INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)";
    connection.query(sql, [nombre, descripcion || null], (error, result) => {
        if (error) return responderError(res, error, "Error al crear categoría");
        res.status(201).json({ mensaje: "Categoría creada", id: result.insertId });
    });
};

// ==========================
// PUT actualizar categoría (solo admin)
// ==========================
export const updateCategoria = (req, res) => {
    const id = req.params.id;
    const { nombre, descripcion } = req.body;

    if (!nombre && !descripcion) return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });

    let campos = [];
    let valores = [];

    if (nombre) { campos.push("nombre = ?"); valores.push(nombre); }
    if (descripcion !== undefined) { campos.push("descripcion = ?"); valores.push(descripcion); }

    valores.push(id); // para WHERE

    const sql = `UPDATE categorias SET ${campos.join(", ")} WHERE id_categoria = ?`;
    connection.query(sql, valores, (error, result) => {
        if (error) return responderError(res, error, "Error al actualizar categoría");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Categoría no encontrada" });
        res.json({ mensaje: "Categoría actualizada" });
    });
};

// ==========================
// DELETE categoría (solo admin)
// ==========================
export const deleteCategoria = (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM categorias WHERE id_categoria = ?", [id], (error, result) => {
        if (error) return responderError(res, error, "Error al eliminar categoría");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Categoría no encontrada" });
        res.json({ mensaje: "Categoría eliminada" });
    });
};