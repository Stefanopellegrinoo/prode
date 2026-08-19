// src/controllers/prediction.controller.js
import PredictionService from "../services/prediction.service.js";

export default class PredictionController {
  constructor() {
    this.predictionService = new PredictionService();
  }

  async save(req, res, next) {
    try {
      const userId = req.user.id;
      const { matchId, predicted_winner } = req.body;
      const prediction = await this.predictionService.savePrediction({
        userId,
        matchId: Number(matchId),
        predicted_winner
      });
      res.status(200).json(prediction);
    } catch (error) {
      next(error);
    }
  }

  async getByUser(req, res, next) {
    try {
      const userId = req.user.id;
      const userPredictions = await this.predictionService.getPredictionsForUser(userId);
      res.json(userPredictions);
    } catch (error) {
      next(error);
    }
  }
}

