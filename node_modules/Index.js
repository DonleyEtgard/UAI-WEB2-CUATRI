// Importamos Express
const express = require("express");

// Creamos la app
const app = express();

// Puerto
const PORT = 3000;

// Middleware para leer JSON
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Hola Donley! Tu servidor con Express está funcionando.");
});

// Ruta con parámetro
app.get("/saludo/:nombre", (req, res) => {
  const { nombre } = req.params;
  res.send(`Hola ${nombre}, bienvenido a mi servidor `);
});

// Ruta que devuelve JSON
app.get("/api/info", (req, res) => {
  res.json({
    proyecto: "Servidor Node.js con Express",
    version: "1.0",
    fecha: new Date().toISOString(),
  });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});