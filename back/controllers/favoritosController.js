import connection from "../config/db.js";

// Helper para manejar errores de forma consistente
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje, status });
};

// ==========================
// GET todos los favoritos (público)
// ==========================
export const getFavoritos = (req, res) => {
    connection.query("SELECT * FROM favoritos", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener favoritos");
        res.json(results);
    });
};

// ==========================
// GET favoritos filtrados (público o privado)
// ==========================
export const buscarFavoritos = (req, res) => {
    const { id_favorito, id_usuario, tipo_objeto, id_objeto } = req.query;

    let condiciones = [];
    let valores = [];

    if (id_favorito) { condiciones.push("id_favorito = ?"); valores.push(id_favorito); }
    if (id_usuario) { condiciones.push("id_usuario = ?"); valores.push(id_usuario); }
    if (tipo_objeto) { condiciones.push("tipo_objeto = ?"); valores.push(tipo_objeto); }
    if (id_objeto) { condiciones.push("id_objeto = ?"); valores.push(id_objeto); }

    let sql = "SELECT * FROM favoritos";
    if (condiciones.length > 0) sql += " WHERE " + condiciones.join(" AND ");

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar favoritos");
        res.json(results);
    });
};

// ==========================
// GET favorito por ID (propio o admin)
// ==========================
export const getFavoritoById = (req, res) => {
    const id = parseInt(req.params.id);

    connection.query(
        "SELECT * FROM favoritos WHERE id_favorito = ?",
        [id],
        (error, results) => {
            if (error) return responderError(res, error, "Error al obtener favorito");
            if (results.length === 0) return res.status(404).json({ error: "Favorito no encontrado" });
            res.json(results[0]);
        }
    );
};

// ==========================
// POST crear favorito (solo usuario autenticado)
// ==========================
export const createFavorito = (req, res) => {
    const { tipo_objeto, id_objeto } = req.body;
    const id_usuario = req.usuario.id; // JWT

    if (!tipo_objeto || !id_objeto) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const sql = "INSERT INTO favoritos (id_usuario, tipo_objeto, id_objeto, fecha_agregado) VALUES (?, ?, ?, NOW())";
    connection.query(sql, [id_usuario, tipo_objeto, id_objeto], (error, result) => {
        if (error) return responderError(res, error, "Error al crear favorito");
        res.status(201).json({ mensaje: "Favorito creado", id: result.insertId });
    });
};

// ==========================
// PUT actualizar favorito (solo usuario propietario o admin)
// ==========================
export const updateFavorito = (req, res) => {
    const id = parseInt(req.params.id);
    const { tipo_objeto, id_objeto } = req.body;

    // Primero verificamos propietario
    connection.query("SELECT * FROM favoritos WHERE id_favorito = ?", [id], (err, results) => {
        if (err) return responderError(res, err, "Error al buscar favorito");
        if (results.length === 0) return res.status(404).json({ error: "Favorito no encontrado" });

        const favorito = results[0];
        if (req.usuario.rol !== "admin" && req.usuario.id !== favorito.id_usuario) {
            return res.status(403).json({ error: "Acceso denegado" });
        }

        let campos = [];
        let valores = [];

        if (tipo_objeto) { campos.push("tipo_objeto = ?"); valores.push(tipo_objeto); }
        if (id_objeto) { campos.push("id_objeto = ?"); valores.push(id_objeto); }

        if (campos.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" });

        valores.push(id);
        const sql = `UPDATE favoritos SET ${campos.join(", ")} WHERE id_favorito = ?`;

        connection.query(sql, valores, (error, result) => {
            if (error) return responderError(res, error, "Error al actualizar favorito");
            res.json({ mensaje: "Favorito actualizado" });
        });
    });
};

// ==========================
// DELETE favorito (solo admin)
// ==========================
export const deleteFavorito = (req, res) => {
    const id = parseInt(req.params.id);

    connection.query("DELETE FROM favoritos WHERE id_favorito = ?", [id], (error, result) => {
        if (error) return responderError(res, error, "Error al eliminar favorito");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Favorito no encontrado" });
        res.json({ mensaje: "Favorito eliminado" });
    });
};