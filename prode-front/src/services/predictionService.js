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

// Guarda (o actualiza) una predicción individual para un partido.
// La idea es que envíes un objeto que incluya: userId, matchId, predictedHomeScore y predictedAwayScore.
export const savePrediction = async (predictionData, userId) => {
  try {
    console.log("savePrediction", predictionData);
    const data = {
      ...predictionData,
      userId: userId, // Asegúrate de que el userId esté en el objeto
    };
    // Realizamos un POST; en el backend se puede usar un upsert (crear o actualizar)
    const response = await api.post("/predictions", data);
    return response.data;
  } catch (error) {
    console.error("Error saving prediction:", error);
    throw new Error(error.response?.data?.message || "Error al guardar la predicción");
  }
};