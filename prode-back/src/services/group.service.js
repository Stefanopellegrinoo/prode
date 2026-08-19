import GroupRepository from '../repositories/group.repository.js';

export default class GroupService {
  constructor() {
    this.repo = new GroupRepository();
  }

  async getUserGroups(userId) {
    return this.repo.findByUser(userId);
  }

  async getById(id) {
    const group = await this.repo.findById(id);
    if (!group) throw new Error('Grupo no encontrado');
    return group;
  }

  async create(dto, userId) {
    // dto: { name, description, tournament_id }
    // generar invite code aleatorio de 6 dígitos
    const code = Math.random().toString(36).substring(2,8).toUpperCase(); 

    return this.repo.create({ ...dto, createdBy: userId, inviteCode: code });
  }

  async join(inviteCode, userId) {
    return this.repo.joinByCode(userId, inviteCode);
  }

  async leave(groupId, userId) {
    return this.repo.leave(userId, groupId);
  }

  async update(id, dto, user) {
    const group = await this.getById(id);
    if (user && user.role !== 'admin' && group.createdBy !== user.id) {
      const error = new Error("No tenés permiso para modificar este grupo");
      error.status = 403;
      throw error;
    }
    return this.repo.update(id, dto);
  }

  async updateGroupDescription(groupId, newDescription, userId) {
    const group = await this.getById(groupId);

    if (group.createdBy !== userId) {
      const error = new Error("No tenés permiso para modificar este grupo");
      error.status = 403;
      throw error;
    }

    await group.update({ description: newDescription });
    return group;
  }

  async removeUserFromGroup(groupId, userIdToRemove, currentUserId) {
    const group = await this.getById(groupId);

    if (group.createdBy !== currentUserId) {
      const error = new Error("No tenés permiso para eliminar usuarios");
      error.status = 403;
      throw error;
    }

    if (group.createdBy === Number(userIdToRemove)) {
      const error = new Error("No podés eliminar al creador del grupo");
      error.status = 400;
      throw error;
    }

    await this.repo.removeMember(groupId, userIdToRemove);
    return;
  }

  async delete(id, user) {
    const group = await this.getById(id);
    if (user && user.role !== 'admin' && group.createdBy !== user.id) {
      const error = new Error("No tenés permiso para eliminar este grupo");
      error.status = 403;
      throw error;
    }
    return this.repo.delete(id);
  }
}