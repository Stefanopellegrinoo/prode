import AuthService from "../services/auth.service.js";
import { getCookieOptions } from "../utils/cookies.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";

export default class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  register = async (req, res, next) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await this.authService.register({
        name: req.body.name || validatedData.username,
        ...validatedData,
      });

      res.cookie('token', accessToken, getCookieOptions());
      res.cookie('refreshToken', refreshToken, {
        ...getCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
      });

      res.status(201).json({ user });
    } catch (err) {
      next(err);
    }
  };


  login = async (req, res, next) => {
    try {
      const validatedData = loginSchema.parse(req.body);

      const { user, accessToken, refreshToken } = await this.authService.login(validatedData);

      res.cookie('token', accessToken, getCookieOptions());
      res.cookie('refreshToken', refreshToken, {
        ...getCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json( user );
    } catch (err) {
      next(err);
    }
  };
  refresh = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      console.log("refresh", res.cookie)
      if (!refreshToken) return res.status(401).json({ message: 'No hay refresh token' });

      const { user, accessToken, refreshToken: newRefresh } = await this.authService.refresh(refreshToken);

      res.cookie('token', accessToken, getCookieOptions());
      res.cookie('refreshToken', newRefresh, {
        ...getCookieOptions(),
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.json({ user });
    } catch (err) {
      return res.status(401).json({ message: 'Refresh token inválido o expirado' });
    }
  };
  me = async (req, res, next) => {
    try {
      const user = await this.authService.me(req.user.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  };

  logout = async (req, res, next) => {
    try {
      res.clearCookie('token', getCookieOptions());
      res.clearCookie('refreshToken', getCookieOptions());
      await this.authService.logout(req.user.id);
      res.json({ message: 'Sesión cerrada correctamente' });
    } catch (err) {
      next(err);
    }
  };
  forgotPassword = async (req, res, next) => {
    res.json({ message: 'Enlace de reseteo enviado (simulado).' });
  }
}
