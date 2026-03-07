export const verificarAdmin = (req, res, next) => {
    const rol = req.usuario?.rol; // req.usuario lo setea verificarUsuario
    if (rol !== "admin") {
        return res.status(403).json({ error: "Acceso denegado. Solo administradores" });
    }
    next();
};