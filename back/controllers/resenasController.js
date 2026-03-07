import connection from "../config/db.js";

// Helper para errores consistentes
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje });
};

// ==========================
// GET todas las reseñas públicas o filtradas
// ==========================
export const getResenas = (req, res) => {
    connection.query("SELECT * FROM resenas", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener reseñas");
        res.json(results);
    });
};

// ==========================
// GET reseñas filtradas por objeto o usuario (público)
// ==========================
export const buscarResenas = (req, res) => {
    const { id_resena, id_usuario, tipo_objeto, id_objeto } = req.query;

    let condiciones = [];
    let valores = [];

    if (id_resena) { condiciones.push("id_resena = ?"); valores.push(id_resena); }
    if (id_usuario) { condiciones.push("id_usuario = ?"); valores.push(id_usuario); }
    if (tipo_objeto) { condiciones.push("tipo_objeto LIKE ?"); valores.push(`%${tipo_objeto}%`); }
    if (id_objeto) { condiciones.push("id_objeto = ?"); valores.push(id_objeto); }

    let sql = "SELECT * FROM resenas";
    if (condiciones.length > 0) sql += " WHERE " + condiciones.join(" AND ");

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar reseñas");
        res.json(results);
    });
};

// ==========================
// GET reseña por ID
// ==========================
export const getResenaById = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM resenas WHERE id_resena = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener reseña");
        if (results.length === 0) return res.status(404).json({ error: "Reseña no encontrada" });
        res.json(results[0]);
    });
};

// ==========================
// POST crear reseña (solo usuario logueado)
// ==========================
export const createResena = (req, res) => {
    const { tipo_objeto, id_objeto, puntuacion, comentario } = req.body;
    const id_usuario = req.usuario.id; // asumimos que req.usuario viene del middleware auth

    if (!tipo_objeto || !id_objeto || puntuacion === undefined) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }
    if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > 5) {
        return res.status(400).json({ error: "Puntuación inválida (1-5)" });
    }

    const sql = `INSERT INTO resenas 
        (id_usuario, tipo_objeto, id_objeto, puntuacion, comentario, fecha_creacion) 
        VALUES (?, ?, ?, ?, ?, NOW())`;

    connection.query(sql, [id_usuario, tipo_objeto, id_objeto, puntuacion, comentario || null], (error, result) => {
        if (error) return responderError(res, error, "Error al crear reseña");
        res.status(201).json({ mensaje: "Reseña creada", id: result.insertId });
    });
};

// ==========================
// PUT actualizar reseña (solo dueño o admin)
// ==========================
export const updateResena = (req, res) => {
    const id = req.params.id;
    const { puntuacion, comentario } = req.body;
    const usuario = req.usuario; // {id, rol}

    if (puntuacion === undefined && comentario === undefined) {
        return res.status(400).json({ error: "Debe enviar al menos un campo para actualizar" });
    }

    // Primero verificamos si el usuario es dueño o admin
    connection.query("SELECT * FROM resenas WHERE id_resena = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener reseña");
        if (results.length === 0) return res.status(404).json({ error: "Reseña no encontrada" });

        const resena = results[0];
        if (usuario.rol !== "admin" && resena.id_usuario !== usuario.id) {
            return res.status(403).json({ error: "No autorizado para actualizar esta reseña" });
        }

        let campos = [];
        let valores = [];

        if (puntuacion !== undefined) {
            if (isNaN(puntuacion) || puntuacion < 1 || puntuacion > 5) {
                return res.status(400).json({ error: "Puntuación inválida (1-5)" });
            }
            campos.push("puntuacion = ?"); valores.push(puntuacion);
        }
        if (comentario !== undefined) { campos.push("comentario = ?"); valores.push(comentario); }

        valores.push(id);

        const sql = `UPDATE resenas SET ${campos.join(", ")} WHERE id_resena = ?`;
        connection.query(sql, valores, (error, result) => {
            if (error) return responderError(res, error, "Error al actualizar reseña");
            res.json({ mensaje: "Reseña actualizada" });
        });
    });
};

// ==========================
// DELETE reseña (solo dueño o admin)
// ==========================
export const deleteResena = (req, res) => {
    const id = req.params.id;
    const usuario = req.usuario;

    connection.query("SELECT * FROM resenas WHERE id_resena = ?", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener reseña");
        if (results.length === 0) return res.status(404).json({ error: "Reseña no encontrada" });

        const resena = results[0];
        if (usuario.rol !== "admin" && resena.id_usuario !== usuario.id) {
            return res.status(403).json({ error: "No autorizado para eliminar esta reseña" });
        }

        connection.query("DELETE FROM resenas WHERE id_resena = ?", [id], (error, result) => {
            if (error) return responderError(res, error, "Error al eliminar reseña");
            res.json({ mensaje: "Reseña eliminada" });
        });
    });
};