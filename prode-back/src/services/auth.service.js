import jwt from 'jsonwebtoken';
import { hash, compare } from "bcryptjs";
import UserRepository from "../repositories/user.repository.js";
import dotenv from "dotenv";
import {redis} from "../config/redis.js";


dotenv.config();

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_SECONDS = 60 * 60 * 24 * 7; // 7 días

export default class AuthService {
  constructor() {
    this.userRepo = new UserRepository();
    this.jwtSecret = process.env.JWT_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }

  async register({ name, email, username, password }) {
    if (await this.userRepo.findByEmail(email)) {
      throw new Error("El mail ya esta registrado.");
    }
    
    if (await this.userRepo.findByUserName(username)) {
      throw new Error("El nombre de usuario ya existe.");
    }
    const hashed = await hash(password, 10);
    const user = await this.userRepo.create({ name, email, username, passwordHash: hashed });


    return this._generateTokens(user);
  }

  async login({ email, password }) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error("Mail no registrado.");
    const ok = await compare(password, user.passwordHash);
    if (!ok) throw new Error("Contraseña incorrecta.");

    return this._generateTokens(user);
  }

  async refresh(refreshToken) {
    try {
      const payload = jwt.verify(refreshToken, this.refreshSecret);
      // const stored = await redis.get(`refresh:${payload.id}`);
      // if (stored !== refreshToken) throw new Error('Refresh inválido');
      const user = await this.userRepo.findById(payload.id);
      if (!user) throw new Error('Usuario no encontrado');
      return this._generateTokens(user);
    } catch {
      throw new Error('Token de refresh inválido');
    }
  }
  async logout(userId) {

    // await redis.del(`refresh:${userId}`);
    return { message: 'Sesión cerrada' };
  }

  async me(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new Error("Usuario no encontrado.");
    return this._publicUser(user);
  }

  async _generateTokens(user) {
    const accessToken = jwt.sign({ id: user.id, role: user.role }, this.jwtSecret, { expiresIn: ACCESS_EXPIRES_IN });
    const refreshToken = jwt.sign({ id: user.id }, this.refreshSecret, { expiresIn: REFRESH_EXPIRES_SECONDS });
    // await redis.set(`refresh:${user.id}`, refreshToken, 'EX', REFRESH_EXPIRES_SECONDS);
    return {
      user: { id: user.id, name: user.name, email: user.email, username: user.username, role: user.role },
      accessToken,
      refreshToken
    };
  }

  _signAccessToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, this.jwtSecret, { expiresIn: ACCESS_EXPIRES_IN });
  }

  _signRefreshToken(user) {
    return jwt.sign({ id: user.id }, this.refreshSecret, { expiresIn: REFRESH_EXPIRES_SECONDS });
  }

  _publicUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
