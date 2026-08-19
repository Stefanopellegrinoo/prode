import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import { authorizeAdmin } from "../middlewares/authorize.js";
import TournamentController from "../controller/tournament.controller.js";

const router = express.Router();
const tournamentController = new TournamentController();

router.get("/", authenticate, (req, res, next) => tournamentController.findAll(req, res, next));
router.get("/:id", authenticate, (req, res, next) => tournamentController.findById(req, res, next));
router.post("/", authenticate, authorizeAdmin, (req, res, next) => tournamentController.create(req, res, next));
router.put("/:id", authenticate, authorizeAdmin, (req, res, next) => tournamentController.update(req, res, next));
router.delete("/:id", authenticate, authorizeAdmin, (req, res, next) => tournamentController.delete(req, res, next));

export default router;
