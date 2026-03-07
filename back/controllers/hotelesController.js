import connection from "../config/db.js";

// Helper para manejar errores de forma consistente
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje, details: error.sqlMessage || error.message });
};

// ==========================
// GET todos los hoteles (público)
// ==========================
export const getHoteles = (req, res) => {
    connection.query("SELECT * FROM hoteles WHERE activo = 1", (error, results) => {
        if (error) return responderError(res, error, "Error al obtener hoteles");
        res.json(results);
    });
};

// ==========================
// GET hoteles filtrados (público)
// ==========================
export const buscarHoteles = (req, res) => {
    const { id_hotel, nombre, ciudad, precioMin, precioMax, categoria_estrellas } = req.query;

    let condiciones = ["activo = 1"];
    let valores = [];

    if (id_hotel) { condiciones.push("id_hotel = ?"); valores.push(id_hotel); }
    if (nombre) { condiciones.push("nombre LIKE ?"); valores.push(`%${nombre}%`); }
    if (ciudad) { condiciones.push("ciudad LIKE ?"); valores.push(`%${ciudad}%`); }
    if (precioMin) { condiciones.push("precio_base_noche >= ?"); valores.push(precioMin); }
    if (precioMax) { condiciones.push("precio_base_noche <= ?"); valores.push(precioMax); }
    if (categoria_estrellas) { condiciones.push("categoria_estrellas = ?"); valores.push(categoria_estrellas); }

    const sql = `SELECT * FROM hoteles WHERE ${condiciones.join(" AND ")}`;

    connection.query(sql, valores, (error, results) => {
        if (error) return responderError(res, error, "Error al buscar hoteles");
        res.json(results);
    });
};

// ==========================
// GET hotel por ID (público)
// ==========================
export const getHotelById = (req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM hoteles WHERE id_hotel = ? AND activo = 1", [id], (error, results) => {
        if (error) return responderError(res, error, "Error al obtener hotel");
        if (results.length === 0) return res.status(404).json({ error: "Hotel no encontrado" });
        res.json(results[0]);
    });
};

// ==========================
// POST crear hotel (solo admin)
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
        activo = 1
    } = req.body;

    if (!nombre || !categoria_estrellas || !direccion || !ciudad || !pais || !precio_base_noche) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const sql = `INSERT INTO hoteles
        (nombre, descripcion, categoria_estrellas, direccion, ciudad, estado, pais, codigo_postal, latitud, longitud, telefono, email, sitio_web, precio_base_noche, moneda, activo)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
        activo
    ];

    connection.query(sql, valores, (error, result) => {
        if (error) return responderError(res, error, "Error al crear hotel");
        res.status(201).json({ mensaje: "Hotel creado", id: result.insertId });
    });
};

// ==========================
// PUT actualizar hotel (solo admin)
// ==========================
export const updateHotel = (req, res) => {
    const id = req.params.id;
    const campos = [];
    const valores = [];

    const allowedFields = [
        "nombre",
        "descripcion",
        "categoria_estrellas",
        "direccion",
        "ciudad",
        "estado",
        "pais",
        "codigo_postal",
        "latitud",
        "longitud",
        "telefono",
        "email",
        "sitio_web",
        "precio_base_noche",
        "moneda",
        "activo"
    ];

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            campos.push(`${field} = ?`);
            valores.push(req.body[field]);
        }
    });

    if (campos.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" });

    valores.push(id);
    const sql = `UPDATE hoteles SET ${campos.join(", ")} WHERE id_hotel = ?`;

    connection.query(sql, valores, (error, result) => {
        if (error) return responderError(res, error, "Error al actualizar hotel");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Hotel no encontrado" });
        res.json({ mensaje: "Hotel actualizado" });
    });
};

// ==========================
// DELETE hotel (solo admin)
// ==========================
export const deleteHotel = (req, res) => {
    const id = req.params.id;
    connection.query("DELETE FROM hoteles WHERE id_hotel = ?", [id], (error, result) => {
        if (error) return responderError(res, error, "Error al eliminar hotel");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Hotel no encontrado" });
        res.json({ mensaje: "Hotel eliminado" });
    });
};