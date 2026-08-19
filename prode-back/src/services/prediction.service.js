import MatchRepository from '../repositories/match.repository.js';
import PredictionRepository from '../repositories/prediction.repository.js';

export default class PredictionService {
  // Crea o actualiza una predicción del usuario
  async savePrediction({ userId, matchId, predicted_winner }) {
    // (Opcional) Validación: ¿existe el partido?
    const matchRepository = new MatchRepository();
    const match = await matchRepository.findById(matchId);
    if (!match) throw new Error('Partido no encontrado');

   
    const now = new Date();
    const matchDate = new Date(match.date);
    if (now >= matchDate) throw new Error('No se puede modificar el pronóstico de un partido ya iniciado');

    if (
      match.status === 'finished' 
    ) {
      throw new Error('No se puede pronosticar un partido finalizado.');
    }
    // Guardar o actualizar
    const prediction = await PredictionRepository.upsertPrediction({
      userId,
      matchId,
      predicted_winner
    });

    return prediction;
  }

  // Obtener todas las predicciones de un usuario
  async getPredictionsForUser(userId) {
    return PredictionRepository.findByUser(userId);
  }

  // Obtener predicción específica
  async getPredictionByUserAndMatch(userId, matchId) {
    return PredictionRepository.findByUserAndMatch(userId, matchId);
  }
}

