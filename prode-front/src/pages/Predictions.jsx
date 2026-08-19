import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Card from "../components/ui/Card";
import MatchPredictionItem from "../components/predictions/MatchPredictionItem";
import Button from "../components/ui/Button";
import { Calendar, Filter } from "lucide-react";
// import { getGroupedFixturePredicts } from "../services/fixtureService";
// import { savePredictions } from "../services/predictionService";
import { useToast } from "../hooks/useToast";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import FixtureTabs from "../components/fixture/FixtureTabs";
import MatchesPage from "../components/admin/MatchesPage";
import { TabsContent } from "@radix-ui/react-tabs";

const Predictions = () => {
  const [matches, setMatches] = useState([]);
  // Las predicciones se manejarán con un objeto, en donde la key es el matchId
  const [predictions, setPredictions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("all"); // all, pending, completed
  const { showToast, ToastContainer } = useToast();
  const navigate = useNavigate();

  // Carga los partidos para pronosticar
  // useEffect(() => {
  //   const fetchMatches = async () => {
  //     try {
  //       setLoading(true);
  //       const data = await getGroupedFixturePredicts();
  //       setMatches(data);

  //       // Inicializamos las predicciones con los valores existentes (si los hay)
  //       const initialPredictions = {};
  //       data.forEach((match) => {
  //         if (match.userPrediction) {
  //           initialPredictions[match.id] = {
  //             homeScore: match.userPrediction.homeScore,
  //             awayScore: match.userPrediction.awayScore,
  //           };
  //         } else {
  //           // Si no hay predicción se inicializa con campos vacíos (o cero)
  //           initialPredictions[match.id] = { homeScore: "", awayScore: "" };
  //         }
  //       });
  //       setPredictions(initialPredictions);
  //     } catch (error) {
  //       console.error("Error fetching matches:", error);
  //       showToast("Error al cargar los partidos", "error");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchMatches();
  // }, [showToast]);

  // Actualiza la predicción para un partido específico
  const handlePredictionChange = (matchId, team, value) => {
    const numValue = value === "" ? "" : parseInt(value, 10) || 0;
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        [team]: numValue,
      },
    }));
  };

  // Envía todas las predicciones al back
  // const handleSavePredictions = async () => {
  //   try {
  //     setSaving(true);
  //     await savePredictions(predictions);
  //     showToast("Pronósticos guardados correctamente", "success");
  //   } catch (error) {
  //     console.error("Error saving predictions:", error);
  //     showToast("Error al guardar los pronósticos", "error");
  //   } finally {
  //     setSaving(false);
  //   }
  // };



  return (
    <>
      <DashboardLayout title="Mis Pronósticos">
        <MatchesPage />
      </DashboardLayout>
    </>
  
  );
};

export default Predictions;
