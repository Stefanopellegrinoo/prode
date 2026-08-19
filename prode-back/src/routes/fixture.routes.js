// src/routes/fixture.routes.js
import express from "express";
import { authenticate } from "../middlewares/authenticate.js";
import FixtureController from "../controller/fixture.controller.js";

const router = express.Router();
const fixtureController = new FixtureController();

router.post("/generate/:tournamentId", authenticate, (req, res, next) =>
  fixtureController.generateFixture(req, res, next)
);

// Obtener el fixture completo de un torneo
router.get("/tournament/:tournamentId", authenticate, (req, res, next) =>
  fixtureController.getByTournament(req, res, next)
);
// Nueva ruta para obtener el fixture agrupado
router.get("/grouped/tournament/:tournamentId", authenticate, (req, res, next) =>
  fixtureController.getGroupedFixture(req, res, next)
);

// **Nuevo**: Agregar un partido al fixture de un torneo
router.post("/tournament/:tournamentId", authenticate, (req, res, next) =>
  fixtureController.addMatch(req, res, next)
);

// Editar o eliminar un match específico
router.put("/match/:matchId", authenticate, (req, res, next) =>
  fixtureController.updateMatch(req, res, next)
);
router.delete("/match/:matchId", authenticate, (req, res, next) =>
  fixtureController.deleteMatch(req, res, next)
);

router.get("/enriched/tournament/:tournamentId", authenticate, (req, res, next) =>
  fixtureController.getEnrichedFixture(req, res, next)
);

export default router;
