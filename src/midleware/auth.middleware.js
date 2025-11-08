const jwt = require('jsonwebtoken');
const SECRET_KEY = 'sgib_super_secret_key';

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // El token debe venir como: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    req.idUsuario = decoded.idUsuario;
    req.idCliente = decoded.idCliente;
    req.rol = decoded.rol;
    next();
  });
};
