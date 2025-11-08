// src/controllers/cliente.controller.js
// Maneja las peticiones HTTP del módulo cliente (req, res) y llama al servicio.

const clienteService = require('../services/cliente.service');

// Función que maneja GET /api/cliente/prestamos/vigentes
exports.getPrestamosVigentes = async (req, res) => {
    // El idCliente se inyecta en req.idCliente en el middleware de autenticación (server.js)
    const idCliente = req.idCliente; 
    
    try {
        // 1. Llama al servicio, que hará la consulta a la DB
        const prestamos = await clienteService.fetchPrestamosVigentes(idCliente);
        
        // 2. Devuelve la respuesta HTTP
        res.status(200).json(prestamos);
    } catch (error) {
        console.error('Error en getPrestamosVigentes:', error.message);
        // Si hay un error de DB o servidor, devuelve un error 500
        res.status(500).json({ error: 'Error interno del servidor al obtener préstamos.' });
    }
};

// Función que maneja GET /api/cliente/prestamos/historial
exports.getHistorialPrestamos = async (req, res) => {
    const idCliente = req.idCliente; 

    try {
        const historial = await clienteService.fetchHistorialPrestamos(idCliente);
        res.status(200).json(historial);
    } catch (error) {
        console.error('Error en getHistorialPrestamos:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al obtener historial.' });
    }
};

// Función que maneja GET /api/cliente/reservas
exports.getReservasActivas = async (req, res) => {
    const idCliente = req.idCliente; 

    try {
        const reservas = await clienteService.fetchReservasActivas(idCliente);
        res.status(200).json(reservas);
    } catch (error) {
        console.error('Error en getReservasActivas:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al obtener reservas.' });
    }
};

// Función que maneja GET /api/cliente/multas/pendientes
exports.getMultasPendientes = async (req, res) => {
    const idCliente = req.idCliente; 

    try {
        const multas = await clienteService.fetchMultasPendientes(idCliente);
        res.status(200).json(multas);
    } catch (error) {
        console.error('Error en getMultasPendientes:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al obtener multas.' });
    }
};
