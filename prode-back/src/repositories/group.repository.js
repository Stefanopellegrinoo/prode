import { redis } from "../config/redis.js";
import {
  Group,
  GroupMember,
  User,
  Tournament,
  sequelize,
} from "../models/models.js"; // Asegúrate de importar el modelo correcto
import { Op } from "sequelize";
import GroupDetailsService from "../services/groupDetails.service.js";

export default class GroupRepository {
  /**
   * Obtener todos los grupos en los que participa un usuario
   */

  async clearCache(id) {
    console.log(id);
  }

  async findByUser(userId) {
    return Group.findAll({
      include: [
        { model: User, as: "creator", attributes: ["id", "name"] },
        {
          model: User,
          attributes: ["id", "name", "username"],
          through: { attributes: [] },
        },
      ],
      where: { "$Users.id$": userId },
      joinTableAttributes: [],
    });
  }

  /**
   * Obtener detalles de un grupo, con creator y miembros
   */
  async findById(id) {
    return Group.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "username"] },
        {
          model: User,
          attributes: ["id", "name", "username"],
          through: { attributes: [] },
        },
        { model: Tournament },
      ],
    });
  }

  /**
   * Crear un nuevo grupo
   */
  async create({ name, description, tournaments, createdBy, inviteCode }) {
    console.log("Creando grupo", name, description, createdBy, inviteCode);
    return sequelize.transaction(async (tx) => {
      const group = await Group.create(
        { name, description, createdBy, inviteCode },
        { transaction: tx }
      );
      console.log("Grupo creado", group.id, group.name, group.inviteCode);

      await group.reload({ transaction: tx });

      if (tournaments?.length) {
        console.log("Asignando torneos", tournaments);
        const parsedTournaments = tournaments.map((id) => Number(id));

        // await group.setTournaments(parsedTournaments);
        await group.setTournaments(tournaments, { transaction: tx });
      }
      // El creador es miembro también
      await group.addUser(createdBy, { transaction: tx });
      return group;
    });
  }

  /**
   * Unirse a un grupo mediante código de invitación
   */
  async joinByCode(userId, inviteCode) {
    const group = await Group.findOne({ where: { inviteCode: inviteCode } });
    if (!group) throw new Error("Código de invitación inválido");
    // Evitar duplicados
    const service = new GroupDetailsService();
    const gm = await service.groupMembers(group.id);
    console.log("miembros", gm);
    const alreadyMember = gm.find((m) => m.userId == userId);
    if (alreadyMember) {
      throw new Error("Ya eres miembro de este grupo");
    }
    await group.addUser(userId);
    await this.clearCache(group.id);
    return group;
  }

  /**
   * Abandonar un grupo
   */
  async leave(userId, groupId) {
    const gm = await GroupMember.findOne({
      where: { user_id: userId, group_id: groupId },
    });
    if (!gm) throw new Error("No eres miembro de este grupo");
    await this.clearCache(groupId);

    await gm.destroy();
  }

  async removeMember(groupId, userIdToRemove) {
    const gm = await GroupMember.findOne({
      where: { user_id: userIdToRemove, group_id: groupId },
    });
    if (!gm) throw new Error("No es miembro de este grupo");
    await this.clearCache(groupId);

    await gm.destroy()

  }

  /**
   * Actualizar información del grupo
   */
  async update(id, data) {
    const group = await Group.findByPk(id);
    if (!group) throw new Error("Grupo no encontrado");
    await this.clearCache(id);
    return group.update(data);
  }

  /**
   * Eliminar grupo
   */
  async delete(id) {
    const group = await Group.findByPk(id);
    if (!group) throw new Error("Grupo no encontrado");
    await this.clearCache(id);
    await group.destroy();
  }
}
