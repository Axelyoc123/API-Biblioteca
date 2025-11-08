
// Contiene las funciones para la búsqueda pública de libros.

const { getDB, sql } = require('../../db');

/**
 * Realiza la búsqueda de libros por título o autor.
 * Corresponde al punto: Búsqueda de libros (solo lectura) y disponibilidad.
 */
exports.searchLibros = async (searchTerm) => {
    const pool = getDB();
    const searchPattern = `%${searchTerm}%`;

    try {
        const query = `
            SELECT 
                L.id, L.titulo, L.isbn, L.anio, L.editorial, 
                A.nombre AS autor, C.nombre AS categoria,
                (
                    SELECT COUNT(E.id) 
                    FROM Ejemplar E 
                    WHERE E.idLibro = L.id 
                    AND E.estadoCopia = 'Disponible' 
                    AND E.estado = 1
                ) AS disponibilidad
            FROM Libro L 
            JOIN Autor A ON L.idAutor = A.id
            JOIN Categoria C ON L.idCategoria = C.id
            WHERE L.estado = 1
            AND (
                L.titulo LIKE @searchPattern
                OR A.nombre LIKE @searchPattern
                OR L.isbn LIKE @searchPattern
            );
        `;
        
        const result = await pool.request()
            .input('searchPattern', sql.NVarChar, searchPattern)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new Error(`DB Error searching libros: ${error.message}`);
    }
};