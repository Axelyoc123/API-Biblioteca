// src/routes/catalogo.routes.js
// Define los endpoints públicos (no requieren autenticación).

const express = require('express');
const router = express.Router();
const catalogoController = require('../controllers/catalogo.controller');

// Buscar libros por título, autor, o ISBN
// Ejemplo: /api/catalogo/libros?q=principito
router.get('/libros', catalogoController.buscarLibros);

module.exports = router;
