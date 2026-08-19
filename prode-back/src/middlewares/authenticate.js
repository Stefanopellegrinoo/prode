// src/middlewares/authenticate.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// export const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ message: 'Acceso no autorizado.' });
//   }
//   const token = authHeader.split(' ')[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { id, role, ... }
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'Token inválido.' });
//   }

export function authenticate(req, res, next) {
  let token = req.cookies?.token;

  if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autenticado. Token no provisto.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}
