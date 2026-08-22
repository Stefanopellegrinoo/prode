// src/services/predictionService.js
import api from "./authService"; // Asegurate de tener configurado Axios en este módulo

// Obtiene las predicciones actuales del usuario (por ejemplo, con base en req.user en el backend)
export const getPredictionsByUser = async () => {
  try {
    const response = await api.get("/predictions");
    return response.data;
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw new Error(
      error.response?.data?.message ||
        "Error al obtener las predicciones del usuario"
    );
  }
};

// Guarda (o actualiza) el pronóstico de un partido.
// Contrato real del backend (verificado en runtime, ver sdd/redesign-fidelity/apply-progress
// R-D2): predicted_winner es la única columna NOT NULL relevante; predictedHomeScore/
// predictedAwayScore no existen en el modelo. userId no va en el body — el backend lo toma
// de req.user.id (prediction.controller.js).
export const savePrediction = async ({ matchId, predicted_winner }) => {
  try {
    const response = await api.post("/predictions", { matchId, predicted_winner });
    return response.data;
  } catch (error) {
    console.error("Error saving prediction:", error);
    throw new Error(error.response?.data?.message || "Error al guardar la predicción");
  }
};