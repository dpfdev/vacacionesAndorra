// controllers/usuariosController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connection from "../config/db.js";

// Helper para manejar errores
const responderError = (res, error, mensaje = "Error del servidor", status = 500) => {
    console.error(error);
    return res.status(status).json({ error: mensaje });
};

// ==========================
// REGISTRO DE USUARIO (público)
// ==========================
export const createUsuario = (req, res) => {
    const { nombre, email, contraseña, rol } = req.body;

    if (!nombre || !email || !contraseña || !rol) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    if (!["usuario", "admin"].includes(rol)) {
        return res.status(400).json({ error: "Rol inválido" });
    }

    // Revisar si el email ya existe
    connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) return responderError(res, err, "Error al verificar usuario");
        if (results.length > 0) return res.status(400).json({ error: "El email ya está registrado" });

        const hash = bcrypt.hashSync(contraseña, 10);

        connection.query(
            "INSERT INTO usuarios (nombre, email, contraseña, fecha_registro, activo, rol) VALUES (?, ?, ?, NOW(), 1, ?)",
            [nombre, email, hash, rol],
            (err, result) => {
                if (err) return responderError(res, err, "Error al crear usuario");
                res.status(201).json({ mensaje: "Usuario creado", id: result.insertId });
            }
        );
    });
};

// ==========================
// LOGIN DE USUARIO (público)
// ==========================
export const loginUsuario = (req, res) => {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
        return res.status(400).json({ error: "Faltan campos" });
    }

    connection.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
        if (err) return responderError(res, err, "Error en base de datos");
        if (results.length === 0) return res.status(401).json({ error: "Email o contraseña incorrectos" });

        const usuario = results[0];
        const passOk = bcrypt.compareSync(contraseña, usuario.contraseña);
        if (!passOk) return res.status(401).json({ error: "Email o contraseña incorrectos" });

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, rol: usuario.rol, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({ mensaje: "Login exitoso", token });
    });
};

// ==========================
// GET todos los usuarios (solo admin)
// ==========================
export const getUsuarios = (req, res) => {
    connection.query("SELECT id_usuario, nombre, email, fecha_registro, activo, rol FROM usuarios", (err, results) => {
        if (err) return responderError(res, err, "Error al obtener usuarios");
        res.json(results);
    });
};

// ==========================
// GET usuario por ID (propio o admin)
// ==========================
export const getUsuarioById = (req, res) => {
    const id = parseInt(req.params.id);

    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    connection.query(
        "SELECT id_usuario, nombre, email, fecha_registro, activo, rol FROM usuarios WHERE id_usuario = ?",
        [id],
        (err, results) => {
            if (err) return responderError(res, err, "Error al obtener usuario");
            if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });
            res.json(results[0]);
        }
    );
};

// ==========================
// ACTUALIZAR usuario (propio o admin)
// ==========================
export const updateUsuario = (req, res) => {
    const id = parseInt(req.params.id);
    const { nombre, email, contraseña, activo, rol } = req.body;

    if (req.usuario.rol !== "admin" && req.usuario.id !== id) {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    let campos = [];
    let valores = [];

    if (nombre) { campos.push("nombre = ?"); valores.push(nombre); }
    if (email) { campos.push("email = ?"); valores.push(email); }
    if (contraseña) { campos.push("contraseña = ?"); valores.push(bcrypt.hashSync(contraseña, 10)); }
    if (activo !== undefined && req.usuario.rol === "admin") { campos.push("activo = ?"); valores.push(activo); }
    if (rol && req.usuario.rol === "admin") { campos.push("rol = ?"); valores.push(rol); }

    if (campos.length === 0) return res.status(400).json({ error: "No hay campos para actualizar" });

    valores.push(id);

    const sql = `UPDATE usuarios SET ${campos.join(", ")} WHERE id_usuario = ?`;
    connection.query(sql, valores, (err, result) => {
        if (err) return responderError(res, err, "Error al actualizar usuario");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ mensaje: "Usuario actualizado" });
    });
};

// ==========================
// ELIMINAR usuario (solo admin)
// ==========================
export const deleteUsuario = (req, res) => {
    const id = parseInt(req.params.id);

    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ error: "Acceso denegado" });
    }

    connection.query("DELETE FROM usuarios WHERE id_usuario = ?", [id], (err, result) => {
        if (err) return responderError(res, err, "Error al eliminar usuario");
        if (result.affectedRows === 0) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json({ mensaje: "Usuario eliminado" });
    });
};