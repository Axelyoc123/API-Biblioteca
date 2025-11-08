// Módulo para gestionar la conexión a la base de datos SQL Server
const sql = require('mssql');

// Configuración de la Conexión
const config = {
    user: 'p2g1b',
    password: 'Umg@123',
    server: 'rds11g.isbelasoft.com',
    database: 'p2g1b',
    
    // Opciones para asegurar una conexión estable
    options: {
        encrypt: true,
        trustServerCertificate: true,
        port: 1433
    }
};

let pool; // El pool de conexión

async function connectDB() {
    try {
        // Conectar e iniciar el pool
        pool = await sql.connect(config);
        console.log("Conexión exitosa a la base de datos SQL Server 'p2g1b'.");
        return pool;
    } catch (err) {
        console.error("Error al conectar a la base de datos:", err.message);
        process.exit(1); 
    }
}


function getDB() {
    if (!pool) {
        throw new Error("El pool de la base de datos no está inicializado. Llama a connectDB() primero.");
    }
    return pool;
}

// 3. Exportar las funciones
module.exports = {
    connectDB,
    getDB,
    sql // Exportamos 'sql' por si necesitamos usar tipos específicos (ej. sql.Int)
};
