import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import GroupService from '../src/services/group.service.js';

describe('GroupService - Ownership & Security (group.test.js)', () => {
  it('updateGroupDescription debe rechazar si el usuario no es el creador', async () => {
    const service = new GroupService();

    service.getById = async (id) => ({
      id,
      name: 'Grupo Test',
      createdBy: 1, // Creador es ID 1
      update: async () => {},
    });

    await assert.rejects(
      async () => {
        await service.updateGroupDescription(1, 'Nueva descripción', 99); // Intento con ID 99
      },
      (err) => {
        assert.equal(err.status, 403);
        assert.match(err.message, /No tenés permiso/);
        return true;
      }
    );
  });

  it('updateGroupDescription debe permitir al creador actualizar', async () => {
    const service = new GroupService();
    let updatedDesc = null;

    service.getById = async (id) => ({
      id,
      name: 'Grupo Test',
      createdBy: 1,
      update: async (fields) => {
        updatedDesc = fields.description;
      },
    });

    const result = await service.updateGroupDescription(1, 'Nueva descripción', 1);
    assert.equal(updatedDesc, 'Nueva descripción');
  });

  it('delete debe rechazar si un usuario regular no es el creador', async () => {
    const service = new GroupService();

    service.getById = async (id) => ({
      id,
      name: 'Grupo Test',
      createdBy: 1,
    });

    await assert.rejects(
      async () => {
        await service.delete(1, { id: 99, role: 'user' });
      },
      (err) => {
        assert.equal(err.status, 403);
        assert.match(err.message, /No tenés permiso/);
        return true;
      }
    );
  });

  it('delete debe permitir a un admin eliminar cualquier grupo', async () => {
    const service = new GroupService();
    let deletedId = null;

    service.getById = async (id) => ({
      id,
      name: 'Grupo Test',
      createdBy: 1,
    });

    service.repo = {
      delete: async (id) => {
        deletedId = id;
        return true;
      },
    };

    await service.delete(1, { id: 99, role: 'admin' });
    assert.equal(deletedId, 1);
  });
});
