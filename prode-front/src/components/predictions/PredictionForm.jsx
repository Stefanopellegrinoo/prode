// src/components/predictions/PredictionForm.jsx
import React, { useState } from "react";
import Button from "../ui/Button";
import { isMatchDay } from "../../utils/validators";



// const PredictionForm = ({ match, onSave, onClose }) => {
//     console.log(match)
//   // Pre-carga los valores si ya existe una predicción en el partido enriquecido.
//   const [homeScore, setHomeScore] = useState(
//     match?.userPrediction?.predicted_home_score ?? "0"
//   );
//   const [awayScore, setAwayScore] = useState(
//     match?.userPrediction?.predicted_away_score ?? "0"
//   );

//   const locked = isMatchDay(match.date);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (locked) {
//       // Podemos mostrar una alerta o toast indicando que ya no se permite editar
//       alert("El pronóstico está bloqueado, ya es el día del partido.");
//       return;
//     }
//     const userId = match.userPrediction?.userId || 5; // Asegurá de obtener el userId real desde tu contexto de autenticación
//     const predictionData = {
//       userId,
//       matchId: match.id,
//       predicted_home_score: homeScore,
//       predicted_away_score: awayScore,
//     };

//     try {
//       await onSave(predictionData);
//     } catch (error) {
//       console.error("Error saving prediction:", error);
//     }
//   };
//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Puntos Local ({match?.homeTeam?.name})
//         </label>
//         <input
//           type="number"
//           min="0"
//           value={homeScore}
//           onChange={(e) => setHomeScore(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//         />
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">
//           Puntos Visitante ({match?.awayTeam?.name})
//         </label>
//         <input
//           type="number"
//           min="0"
//           value={awayScore}
//           onChange={(e) => setAwayScore(e.target.value)}
//           className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
//         />
//       </div>
//       <div className="flex justify-end space-x-3">
//         <Button type="button" variant="outline" onClick={onClose}>
//           Cancelar
//         </Button>
//         <Button type="submit" variant="primary">
//           Guardar Predicción
//         </Button>
//       </div>
//     </form>
//   );
// };
const PredictionForm = ({ match, onSave, onClose }) => {
  const [predictedWinner, setPredictedWinner] = useState(
    match?.userPrediction?.predicted_winner ?? ""
  );
console.log(match)
  const locked = isMatchDay(match.date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (locked) {
      alert("El pronóstico está bloqueado, ya es el día del partido.");
      return;
    }

    const userId = match.userPrediction?.userId || 5;

    const predictionData = {
      userId,
      matchId: match.id,
      predicted_winner: predictedWinner,
    };

    try {
      await onSave(predictionData, match);
    } catch (error) {
      console.error("Error saving prediction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-gray-700">¿Quién gana?</legend>
        {locked && <p className="text-sm font-medium text-red-700">El pronóstico está bloqueado, ya no se puede hacer cambios.</p>}
        <div className="flex flex-col space-y-1">
          <label>
            <input
              type="radio"
              name="winner"
              value="home"
              checked={predictedWinner === "home"}
              onChange={(e) => setPredictedWinner(e.target.value)}
              disabled={locked}
            />{" "}
            Gana {match?.homeTeam?.name}
          </label>
          <label>
            <input
              type="radio"
              name="winner"
              value="away"
              checked={predictedWinner === "away"}
              onChange={(e) => setPredictedWinner(e.target.value)}
              disabled={locked}
            />{" "}
            Gana {match?.awayTeam?.name}
          </label>
          {/* <label>
            <input
              type="radio"
              name="winner"
              value="draw"
              checked={predictedWinner === "draw"}
              onChange={(e) => setPredictedWinner(e.target.value)}
              disabled={locked}
            />{" "}
            Empate
          </label> */}
        </div>
      </fieldset>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="secondary" disabled={locked || !predictedWinner}>
          Guardar Predicción
        </Button>
      </div>
    </form>
  );
};

export default PredictionForm;
