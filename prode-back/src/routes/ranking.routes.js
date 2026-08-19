// src/routes/ranking.routes.js
import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import RankingController from '../controller/ranking.controller.js';

const router = express.Router();
const rankingController = new RankingController();

// GET /api/ranking
router.get('/subdivision/:subdivisionId/tournament/:tournamentId', authenticate, (req, res, next) => rankingController.getSubdivisionRanking(req, res, next));
router.get('/group/:groupId/:subdivisionId/:tournamentId', (req, res, next) => 
    rankingController.getGroupRanking(req, res, next)
  );
  
export default router;
