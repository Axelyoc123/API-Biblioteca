// src/controllers/catalogo.controller.js
// Maneja las peticiones HTTP del catálogo público.

const catalogoService = require('../services/catalogo.service');

// Función que maneja GET /api/catalogo/libros?q={query}
exports.buscarLibros = async (req, res) => {
    // Extrae el término de búsqueda de la URL (query parameter)
    const searchTerm = req.query.q; 

    // Opcional: Validación simple del término
    if (!searchTerm || searchTerm.trim().length < 3) {
        // 🛑 CORRECCIÓN CLAVE: 
        // Para evitar el error 'expected' en Kotlin, siempre devuelve un ARRAY vacío [] 
        // cuando no hay resultados válidos, NO un objeto { mensaje: "...", libros: [] }.
        return res.status(200).json([]);
    }
    
    try {
        // ✅ Se asume que catalogoService.buscarLibros es el nombre correcto en tu servicio.
        const libros = await catalogoService.searchLibros(searchTerm);
        
        // ✅ Si hay resultados, devuelve la lista (que es un Array JSON).
        res.status(200).json(libros);
    } catch (error) {
        console.error('Error en buscarLibros:', error.message);
        // Devuelve un error 500 para notificar a Kotlin
        res.status(500).json({ error: 'Error interno del servidor al buscar libros.' });
    }
};