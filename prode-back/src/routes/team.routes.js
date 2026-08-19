import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/authorize.js";
import TeamController from "../controller/team.controller.js";
import multer from "multer";

const router = express.Router();
const teamController = new TeamController();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB máximo
});

// GET /api/teams - Obtener todos los equipos
router.get("/", authenticate, (req, res, next) => teamController.getAll(req, res, next));

// GET /api/teams/:id - Obtener un equipo por ID
router.get("/:id", authenticate, (req, res, next) => teamController.getById(req, res, next));

// POST /api/teams - Crear nuevo equipo
router.post("/", authenticate, authorizeAdmin, (req, res, next) => teamController.create(req, res, next));

// PUT /api/teams/:id - Actualizar equipo
router.put("/:id", authenticate, authorizeAdmin, (req, res, next) => teamController.update(req, res, next));

// POST /api/teams/:id/logo - Subir logo de equipo
router.post("/:id/logo", authenticate, authorizeAdmin, upload.single("file"), (req, res, next) => teamController.uploadTeamLogo(req, res, next));

// DELETE /api/teams/:id - Eliminar equipo
router.delete("/:id", authenticate, authorizeAdmin, (req, res, next) => teamController.delete(req, res, next));

router.get("/tournament/:tournamentId", authenticate, (req, res, next) =>
  teamController.getByTournament(req, res, next)
);
  
export default router;
