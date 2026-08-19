
import GroupService from '../services/group.service.js';
import GroupDetailsService from '../services/groupDetails.service.js';

export default class GroupController {
  constructor() {
    this.service = new GroupService();
  }

  getUserGroups = async (req, res, next) => {
    try {
      const groups = await this.service.getUserGroups(req.user.id);
      res.json(groups);
    } catch (err) {
      next(err);
    }
  }

  getById = async (req, res, next) => {
    try {
      const group = await this.service.getById(req.params.id);
      res.json(group);
    } catch (err) {
      next(err);
    }
  }

  async getDetails(req, res, next) {
    try {
      const { id } = req.params;
      const service = new GroupDetailsService();
      const groupData = await service.getGroupDetails(id);
      res.json(groupData);
    } catch (error) {
      console.error('Error al obtener detalles del grupo:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

  create = async (req, res, next) => {
    try {
      if (!req.body.name || !req.body.tournaments) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos' });
      }
      const group = await this.service.create(req.body, req.user.id);
      res.status(201).json(group);
    } catch (err) {
      next(err);
    }
  }

  join = async (req, res, next) => {
    try {
      const group = await this.service.join(req.body.inviteCode, req.user.id);
      res.json(group);
    } catch (err) {
      next(err);
    }
  }

  leave = async (req, res, next) => {
    try {
      await this.service.leave(req.params.id, req.user.id);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  update = async (req, res, next) => {
    try {
      if (!req.body.name || !req.body.tournaments) {
        return res.status(400).json({ message: 'Faltan parámetros requeridos' });
      }
      const group = await this.service.update(req.params.id, req.body, req.user);
      res.json(group);
    } catch (err) {
      next(err);
    }
  }

  updateGroupDescription = async (req, res, next) => {
    const { id } = req.params;
    const { description } = req.body;
    const userId = req.user.id;
    try {
      const updatedGroup = await this.service.updateGroupDescription(id, description, userId);
      return res.json({ message: "Descripción actualizada correctamente", group: updatedGroup });
    } catch (error) {
      console.error("Error al actualizar la descripción:", error);

      if (error.message === "Grupo no encontrado") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "No tenés permiso para editar este grupo") {
        return res.status(403).json({ message: error.message });
      }
      next(error);
    }
  }

  getRanking = async (req, res, next) => {
    try {
      const groupId = Number(req.params.id);
      const tournamentId = req.query.tournamentId ? Number(req.query.tournamentId) : undefined;
      const subdivisionId = req.query.subdivisionId ? Number(req.query.subdivisionId) : undefined;
      
      const service = new GroupDetailsService();
      const groupData = await service.getGroupDetails(groupId);
      
      res.json(groupData);
    } catch (error) {
      next(error);
    }
  }

  async removeUserFromGroup(req, res, next) {
    const { groupId, userId } = req.params;
    const currentUserId = req.user.id;

    try {
      await this.service.removeUserFromGroup(groupId, userId, currentUserId);
      return res.json({ message: "Usuario eliminado del grupo correctamente" });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      if (error.message === "Grupo no encontrado") {
        return res.status(404).json({ message: error.message });
      }

      if (error.message === "No tenés permiso para eliminar usuarios") {
        return res.status(403).json({ message: error.message });
      }

      if (next) {
        next(error);
      } else {
        return res.status(500).json({ message: "Error interno del servidor" });
      }
    }
  }

  delete = async (req, res, next) => {
    try {
      await this.service.delete(req.params.id, req.user);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}
