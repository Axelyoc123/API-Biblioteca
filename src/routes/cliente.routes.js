// src/routes/cliente.routes.js
// Define los endpoints protegidos para el cliente autenticado.

const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

// Obtener todos los préstamos vigentes (activos) del cliente
router.get('/prestamos/vigentes', clienteController.getPrestamosVigentes);

// Obtener el historial de préstamos (ya devueltos) del cliente
router.get('/prestamos/historial', clienteController.getHistorialPrestamos);

// Obtener las reservas activas y su estado en la cola
router.get('/reservas', clienteController.getReservasActivas);

// Obtener las multas pendientes de pago
router.get('/multas/pendientes', clienteController.getMultasPendientes);

// Podríamos añadir una ruta para pagar multas:
// router.post('/multas/:id/pagar', clienteController.pagarMulta);

module.exports = router;
