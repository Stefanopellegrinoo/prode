import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { hash, compare } from 'bcryptjs';
import { registerSchema, loginSchema } from '../src/schemas/authSchemas.js';

describe('Auth & Security - auth.test.js', () => {
  it('bcrypt.compare debe validar hashes correctamente y rechazar texto plano incorrecto', async () => {
    const password = 'Password123!';
    const hashedPassword = await hash(password, 10);

    const isMatch = await compare(password, hashedPassword);
    assert.equal(isMatch, true);

    const isWrong = await compare('WrongPassword', hashedPassword);
    assert.equal(isWrong, false);
  });

  it('registerSchema debe validar usuarios correctamente', () => {
    const validData = {
      name: 'Juan Perez',
      username: 'juan_perez',
      email: 'juan@urba.com',
      password: 'StrongPassword123!',
    };

    const parsed = registerSchema.safeParse(validData);
    assert.equal(parsed.success, true);
  });

  it('registerSchema debe rechazar emails inválidos y contraseñas cortas', () => {
    const invalidData = {
      username: 'ab', // muy corto (< 3)
      email: 'no-es-un-email',
      password: '123', // muy corto (< 6)
    };

    const parsed = registerSchema.safeParse(invalidData);
    assert.equal(parsed.success, false);
    assert.ok(parsed.error.issues.length >= 3);
  });

  it('loginSchema debe validar credenciales básicas', () => {
    const validLogin = {
      email: 'test@urba.com',
      password: 'SecretPassword123',
    };

    const parsed = loginSchema.safeParse(validLogin);
    assert.equal(parsed.success, true);
  });
});
