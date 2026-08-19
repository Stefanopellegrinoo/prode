import { Prediction, Match, Team } from '../models/models.js'

class PredictionRepository {
  // Crea o actualiza una predicción del usuario
  async upsertPrediction({ userId, matchId,predicted_winner}) {
    
    const [prediction, created] = await Prediction.upsert({
      user_id: userId,
      match_id: matchId,
      predicted_winner: predicted_winner
    }, { returning: true });

    return prediction;
  }

  // Obtener todas las predicciones de un usuario
  async findByUser(userId) {
    return Prediction.findAll({ where: { user_id: userId } });
  }

  // Obtener predicción individual por usuario y partido
  async findByUserAndMatch(userId, matchId) {
    return Prediction.findOne({ where: { user_id: userId, match_id: matchId } });
  }
}

export default new PredictionRepository();
