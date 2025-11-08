const express = require('express');
const { connectDB } = require('./db');
const clienteRoutes = require('./src/routes/cliente.routes');
const catalogoRoutes = require('./src/routes/catalogo.routes');
const authRoutes = require('./src/routes/auth.routes'); // 🔹 Nuevo: rutas de autenticación
const { authenticateToken } = require('./src/midleware/auth.middleware');

const app = express();
const PORT = 3000;

// Middleware global para leer JSON
app.use(express.json());

// ---------------------------------------------
//  RUTAS PÚBLICAS (no requieren autenticación)
// ---------------------------------------------
app.use('/api/auth', authRoutes); // 🔹 Login
app.use('/api/catalogo', catalogoRoutes); // 🔹 Búsqueda pública de libros

// ---------------------------------------------
//  RUTAS PROTEGIDAS (requieren autenticación)
// ---------------------------------------------
app.use('/api/cliente', authenticateToken, clienteRoutes);

// ---------------------------------------------
//  RUTA RAÍZ (solo mensaje de prueba)
// ---------------------------------------------
app.get('/', (req, res) => {
  res.send('API SGIB Activa con Autenticación JWT');
});

// ---------------------------------------------
// CONEXIÓN A LA BASE DE DATOS Y ARRANQUE DEL SERVIDOR
// ---------------------------------------------
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API SGIB lista en http://localhost:${PORT}`);
      console.log(`Para Android Studio (Emulador): http://10.0.2.2:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al iniciar el servidor:', err.message);
    process.exit(1);
  });
