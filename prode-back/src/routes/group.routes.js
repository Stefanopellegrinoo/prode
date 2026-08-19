// src/routes/group.routes.js
import express from 'express';

import { authenticate } from '../middlewares/authenticate.js';
import GroupController from '../controller/group.controller.js';
// import { authorizeAdmin } from '../middlewares/authorize.js'; // Opcional para endpoints admin

const router = express.Router();
const groupController = new GroupController();

// GET /api/groups: Obtener grupos del usuario
router.get('/', authenticate, (req, res, next) => groupController.getUserGroups(req, res, next));

// GET /api/groups/:id: Obtener detalles de un grupo específico
router.get('/:id', authenticate, (req, res, next) => groupController.getById(req, res, next));

// POST /api/groups: Crear un nuevo grupo
router.post('/', authenticate, (req, res, next) => groupController.create(req, res, next));

// POST /api/groups/join: Unirse a un grupo (utilizando código de invitación)
router.post('/join', authenticate, (req, res, next) => groupController.join(req, res, next));

// POST /api/groups/:id/leave: Abandonar un grupo
router.post('/:id/leave', authenticate, (req, res, next) => groupController.leave(req, res, next));

// PUT /api/groups/:id: Actualizar información de un grupo (admin)
// router.put('/:id', authenticate, authorizeAdmin, (req, res, next) => groupController.update(req, res, next));
router.put('/:id', authenticate, (req, res, next) => groupController.update(req, res, next));

// DELETE /api/groups/:id: Eliminar un grupo (admin)
// router.delete('/:id', authenticate, authorizeAdmin, (req, res, next) => groupController.delete(req, res, next));
router.delete('/:id', authenticate, (req, res, next) => groupController.delete(req, res, next));

// GET /api/groups/:id/ranking: Obtener ranking de un grupo
router.get('/:id/ranking', authenticate, (req, res, next) => groupController.getRanking(req, res, next));

// PUT /api/groups/:id/description
router.put("/:id/description",  authenticate, (req, res, next) => groupController.updateGroupDescription(req, res, next));

// DELETE -> ADMIN del grupo, a member
router.delete("/:groupId/users/:userId", authenticate, (req, res, next) => groupController.removeUserFromGroup(req, res, next));

// GET /api/groups/:id/details
router.get('/:id/details', authenticate, (req, res, next) =>
    groupController.getDetails(req, res, next)
  );


export default router;
