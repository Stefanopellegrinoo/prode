// src/services/userMatchPoints.service.js
import { UserMatchPoint } from '../models/userMatchPoint.model.js';
import { Prediction } from '../models/prediction.model.js';
import { deleteByPatternStream } from '../utils/redisCache.js';

export default class UserMatchPointsService {
  // async calculateAndStorePoints(match) {
  //   // if (!match.home_score || !match.away_score){
  //   //     console.log("El partido no tiene puntajes definidos. No se pueden calcular puntos.");
  //   //     return;
  //   // } 
        

  //   const predictions = await Prediction.findAll({
  //     where: { match_id: match.id },
  //   });
  //   console.log("Predicciones:", predictions);
  //   const puentosExactos = 3
  //   const puntosAcierto = 1

  //   const pointOperations = predictions.map(async (prediction) => {
  //     let points = 0;

  //     if (
  //       prediction.predicted_home_score === match.home_score &&
  //       prediction.predicted_away_score === match.away_score
  //     ) {
  //       points = puentosExactos
  //     } else if (
  //       (prediction.predicted_home_score > prediction.predicted_away_score &&
  //         match.home_score > match.away_score) ||
  //       (prediction.predicted_home_score < prediction.predicted_away_score &&
  //         match.home_score < match.away_score) ||
  //       (prediction.predicted_home_score === prediction.predicted_away_score &&
  //         match.home_score === match.away_score)
  //     ) {
  //       points = puntosAcierto; // acierta resultado
  //     }

  //     const existing = await UserMatchPoint.findOne({
  //       where: {
  //         user_id: prediction.user_id,
  //         match_id: match.id,
  //       },
  //     });
  
      
  //     if (existing) {
  //       await existing.update({ points });
  //     } else {
  //       await UserMatchPoint.create({
  //         user_id: prediction.user_id,
  //         match_id: match.id,
  //         points,
  //         subdivision_id: match.subdivision_id,
  //       tournament_id: match.tournament_id,
  //       });
  //     }
      
  //   });
  //   console.log("Calculando puntos para el partido:", pointOperations);

  //   await Promise.all(pointOperations);
  // }
  async calculateAndStorePoints(match) {

    if (match.result === undefined) {
      console.log("El partido no tiene resultado definido.");
      return;
    }
    console.time(`⏱ Tiempo para partido ${match.id}`);
    const t0 = performance.now();
    const predictions = await Prediction.findAll({ where: { match_id: match.id }});
    const t1 = performance.now();
    console.log(`🧾 Traer predicciones tomó ${t1 - t0} ms`);
    

    const puntosAcierto = 3;


    // Preparamos todos los datos en memoria para un bulkCreate
    const pointData = predictions.map((prediction) => ({
      user_id: prediction.user_id,
      match_id: match.id,
      tournament_id: match.tournament_id,
      subdivision_id: match.subdivision_id,
      points: prediction.predicted_winner === match.result ? puntosAcierto : 0,
      created_at: new Date(),
    }));
  
    const start = performance.now();
    await UserMatchPoint.bulkCreate(pointData, {
      updateOnDuplicate: ['points']
    });
    
    // await Promise.all([
    //   deleteByPatternStream('ranking:group:*'),
    //   deleteByPatternStream('ranking:general:*'),
    //   deleteByPatternStream('user:stats:*')
    // ]);
    

    const end = performance.now();
    console.log(`🧠 Escritura DB tomó ${end - start} ms`);
    console.log(`🔢 Procesadas ${pointData.length} predicciones`);
    console.timeEnd(`⏱ Tiempo para partido ${match.id}`);
  }

}
