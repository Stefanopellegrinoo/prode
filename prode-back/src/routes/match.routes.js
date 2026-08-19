import express from 'express';
import MatchController from '../controller/match.controller.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorizeAdmin } from '../middlewares/authorize.js';

const router = express.Router();
const matchController = new MatchController();

// Rutas de consulta
router.get('/', (req, res, next) => matchController.getAll(req, res, next));
router.get('/:id', (req, res, next) => matchController.getById(req, res, next));
router.get('/tournament/:tournamentId', authenticate, (req, res, next) => 
  matchController.getByTournamentAndSubdivision(req, res, next)
);
router.get('/enriched/tournament/:tournamentId', authenticate, (req, res, next) => 
  matchController.getEnrichedFixture(req, res, next)
);

// Rutas administrativas protegidas
router.post('/', authenticate, authorizeAdmin, (req, res, next) => matchController.create(req, res, next));
router.put('/:id', authenticate, authorizeAdmin, (req, res, next) => matchController.update(req, res, next));
router.delete('/:id', authenticate, authorizeAdmin, (req, res, next) => matchController.delete(req, res, next));

router.get('/upcoming/:limit', (req, res, next) => matchController.getUpcomingMatches(req, res, next));
// router.get('/recent', (req, res, next) => matchController.getRecent(req, res, next));
// router.get('/for-prediction', (req, res, next) => matchController.getForPrediction(req, res, next));


export default router;
