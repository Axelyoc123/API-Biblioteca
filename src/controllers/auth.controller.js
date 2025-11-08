const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDB, sql } = require('../../db');

const SECRET_KEY = 'sgib_super_secret_key';

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const pool = getDB();

    const result = await pool.request()
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM Usuario WHERE username = @username AND estado = 1');

    console.log("Número de registros encontrados:", result.recordset.length);

    if (result.recordset.length > 0) {
        console.log("Hash de la DB:", result.recordset[0].password);
    }

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo.' });
    }

    const user = result.recordset[0];
    console.log({user});

    // Generar el token
    const token = jwt.sign(
      {
        idUsuario: user.id,
        rol: user.rol,
        idCliente: user.idCliente
      },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      rol: user.rol,
      idCliente: user.idCliente
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ error: 'Error en el servidor durante el login.' });
  }
};
