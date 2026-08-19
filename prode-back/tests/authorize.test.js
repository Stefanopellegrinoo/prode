import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { authorizeAdmin, authorizeRoles } from '../src/middlewares/authorize.js';

describe('RBAC Middleware - authorize.js', () => {
  it('debe rechazar con 401 si no hay req.user', () => {
    const req = {};
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => {
            jsonSent = data;
          },
        };
      },
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    authorizeAdmin(req, res, next);

    assert.equal(statusSent, 401);
    assert.equal(nextCalled, false);
    assert.match(jsonSent.message, /Acceso no autorizado/);
  });

  it('debe rechazar con 403 si req.user no tiene rol admin', () => {
    const req = { user: { id: 1, role: 'user' } };
    let statusSent = null;
    let jsonSent = null;
    const res = {
      status: (code) => {
        statusSent = code;
        return {
          json: (data) => {
            jsonSent = data;
          },
        };
      },
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    authorizeAdmin(req, res, next);

    assert.equal(statusSent, 403);
    assert.equal(nextCalled, false);
    assert.match(jsonSent.message, /permisos de administrador/);
  });

  it('debe llamar a next() si req.user tiene rol admin', () => {
    const req = { user: { id: 99, role: 'admin' } };
    const res = {};
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    authorizeAdmin(req, res, next);

    assert.equal(nextCalled, true);
  });

  it('authorizeRoles debe permitir roles configurados', () => {
    const middleware = authorizeRoles('admin', 'moderator');
    const req = { user: { id: 5, role: 'moderator' } };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    middleware(req, {}, next);

    assert.equal(nextCalled, true);
  });
});
