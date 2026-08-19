export const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Acceso no autorizado. Debe iniciar sesión.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado. Se requieren permisos de administrador.' });
  }
  next();
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Acceso no autorizado. Debe iniciar sesión.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
    }
    next();
  };
};
