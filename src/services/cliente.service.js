// Contiene las funciones que ejecutan las consultas a la DB (lógica de negocio).

const { getDB, sql } = require('../../db'); // Importamos la conexión real

/**
 * Obtiene los préstamos vigentes de un cliente.
 * Corresponde al punto: Préstamos vigentes, vencimientos.
 */
exports.fetchPrestamosVigentes = async (idCliente) => {
    const pool = getDB();
    try {
        // Usamos parámetros (@idCliente) para prevenir inyección SQL
        const query = `
            SELECT 
                P.fechaPrestamo, P.fechaVencimiento, 
                L.titulo, A.nombre AS autor, E.codigoInventario, E.sala, E.estante
            FROM Prestamo P
            JOIN Ejemplar E ON P.idEjemplar = E.id
            JOIN Libro L ON E.idLibro = L.id
            JOIN Autor A ON L.idAutor = A.id
            WHERE P.idCliente = @idCliente
            AND P.fechaDevolucion IS NOT NULL 
            AND P.estado = 1;
        `;
        
        const result = await pool.request()
            .input('idCliente', sql.Int, idCliente)
            .query(query);

        return result.recordset;
    } catch (error) {
        // Lanzamos el error para que el controlador lo atrape y lo registre
        throw new Error(`DB Error fetching vigentes: ${error.message}`);
    }
};

/**
 * Obtiene el historial de préstamos (devueltos) de un cliente.
 * Corresponde al punto: Historial.
 */
exports.fetchHistorialPrestamos = async (idCliente) => {
    const pool = getDB();
    try {
        const query = `
            SELECT 
                P.fechaPrestamo, P.fechaDevolucion, 
                L.titulo, A.nombre AS autor
            FROM Prestamo P
            JOIN Ejemplar E ON P.idEjemplar = E.id
            JOIN Libro L ON E.idLibro = L.id
            JOIN Autor A ON L.idAutor = A.id
            WHERE P.idCliente = @idCliente
            AND P.fechaDevolucion IS NOT NULL;
        `;
        
        const result = await pool.request()
            .input('idCliente', sql.Int, idCliente)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new Error(`DB Error fetching historial: ${error.message}`);
    }
};

/**
 * Obtiene las reservas activas de un cliente.
 * Corresponde al punto: Reservas y estado en la cola.
 */
exports.fetchReservasActivas = async (idCliente) => {
    const pool = getDB();
    try {
        const query = `
            SELECT 
                R.fechaReserva, R.posicionCola, 
                L.titulo, A.nombre AS autor,
                CASE R.estadoReserva 
                    WHEN 1 THEN 'Activa' 
                    WHEN 2 THEN 'Vencida'
                    ELSE 'Otro'
                END AS estadoReserva
            FROM Reserva R
            JOIN Libro L ON R.idLibro = L.id
            JOIN Autor A ON L.idAutor = A.id
            WHERE R.idCliente = @idCliente
            AND R.estadoReserva = 3;
        `;
        
        const result = await pool.request()
            .input('idCliente', sql.Int, idCliente)
            .query(query);

        return result.recordset;
    } catch (error) {
        throw new Error(`DB Error fetching reservas: ${error.message}`);
    }
};

/**
 * Obtiene las multas pendientes de pago de un cliente.
 * Corresponde al punto: Multas pendientes.
 */
exports.fetchMultasPendientes = async (idCliente) => {
    const pool = getDB();
    try {
        const query = `
            SELECT 
                L.titulo AS tituloLibro,
                M.monto,
                M.diasAtraso,
                CASE 
                    WHEN M.estadoPago = 1 THEN 'Pendiente'
                    WHEN M.estadoPago = 0 THEN 'Pagada'
                    ELSE 'Desconocido'
                END AS estadoPago
            FROM Multa M
            INNER JOIN Prestamo P ON M.idPrestamo = P.id
            INNER JOIN Ejemplar E ON P.idEjemplar = E.id
            INNER JOIN Libro L ON E.idLibro = L.id 
            WHERE M.idCliente = @idCliente
            AND M.estadoPago = 0; -- 💡 NOTA: M.estado = 1 solo verifica que la multa está activa. 
                                  -- Para "pendientes", generalmente se usa M.estadoPago =  (Pendiente).
        `;

        const result = await pool.request()
            .input('idCliente', sql.Int, idCliente)
            .query(query);

        return result.recordset;
    } catch (error) {
        // Mantenemos el logging detallado para que se vea el error 500
        console.error('Error DB en fetchMultasPendientes:', error.message);
        throw new Error('Error al obtener multas pendientes del cliente.');
    }
};

exports.buscarLibros = async (termino) => {
    const pool = getDB();
    try {
        const busquedaTermino = '%' + termino + '%'; // Añadir % para la búsqueda LIKE

        const query = `
            SELECT 
                L.id,
                L.titulo,
                L.anio,
                A.nombre AS autor,
                -- 💡 Cálculo de ejemplares disponibles:
                (
                    SELECT COUNT(E.id)
                    FROM Ejemplar E
                    WHERE E.idLibro = L.id
                    AND E.estadoCopia = 'Disponible' -- Filtra por ejemplares que están listos para préstamo
                    AND E.estado = 1                 -- Que estén activos en el inventario
                ) AS disponibles
            FROM Libro L
            INNER JOIN Autor A ON L.idAutor = A.id
            WHERE L.estado = 1
            AND (
                L.titulo LIKE @termino
                OR A.nombre LIKE @termino
                OR L.isbn LIKE @termino
            );
        `;
        
        const result = await pool.request()
            .input('termino', sql.NVarChar, busquedaTermino)
            .query(query);

        // Los resultados de esta consulta coinciden directamente con el modelo LibroBusqueda de Kotlin.
        return result.recordset; 

    } catch (error) {
        console.error('Error DB en buscarLibros:', error.message);
        throw new Error('Error al ejecutar la búsqueda de libros.');
    }
};
