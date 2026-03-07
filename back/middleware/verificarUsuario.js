import jwt from "jsonwebtoken";

export const verificarUsuario = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token no proporcionado" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verificar token usando la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Agregar datos del usuario al request
        req.usuario = {
            id: decoded.id_usuario,
            rol: decoded.rol,
            email: decoded.email
        };
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: "Token inválido o expirado" });
    }
};