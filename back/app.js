import cors from "cors";
import dotenv from "dotenv";
import express from "express";

// Importar rutas
import actividadesRoutes from "./routes/actividades.js";
import authRoutes from "./routes/auth.js";
import categoriasRoutes from "./routes/categorias.js";
import favoritosRoutes from "./routes/favoritos.js";
import hotelesRoutes from "./routes/hoteles.js";
import imagenesRoutes from "./routes/imagenes.js";
import resenasRoutes from "./routes/resenas.js";
import usuariosRoutes from "./routes/usuarios.js";
// Inicializar dotenv
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================
// MIDDLEWARE GLOBAL
// ==========================
app.use(cors());
app.use(express.json());

// ==========================
// RUTAS
// ==========================
app.use("/api/auth", authRoutes);
app.use("/api/hoteles", hotelesRoutes);
app.use("/api/actividades", actividadesRoutes);
app.use("/api/categorias", categoriasRoutes);
app.use("/api/imagenes", imagenesRoutes);
app.use("/api/resenas", resenasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/favoritos", favoritosRoutes);

// ==========================
// RUTA RAÍZ
// ==========================
app.get("/", (req, res) => {
    res.send("API de viajes funcionando correctamente!");
});

// ==========================
// MANEJO DE ERRORES 404
// ==========================
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// ==========================
// INICIAR SERVIDOR
// ==========================
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});