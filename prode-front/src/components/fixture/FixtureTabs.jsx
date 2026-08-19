// src/components/FixtureTabs.jsx
import React, { useEffect, useRef, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs"; // Ajusta la importación a tus componentes de Tabs
import EmptyState from "../ui/EmptyState";
import FixtureRound from "./FixtureRound";
import { useToast } from "../../hooks/useToast";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getTournamentById } from "../../services/tournamentService";
import {
  getFixturesByTournament,
  getGroupedFixturePredicts,
} from "../../services/fixtureService";
import DashboardLayout from "../layouts/DashboardLayout";
import { ArrowLeft, Plus } from "lucide-react";
import Modal from "../ui/Modal";
import MatchForm from "../admin/forms/MatchForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import Button from "../ui/Button";
import { savePrediction } from "../../services/predictionService";
import PredictionForm from "../predictions/PredictionForm";
import { getTeams } from "../../services/teamService";
import { formatDate } from "../../utils/dateUtils";

const FixtureTabs = () => {
  const { showToast } = useToast();
  const { id } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [subdivisions, setSubdivisions] = useState([]);
  const [fixtures, setFixtures] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [showAddMatchModal, setShowAddMatchModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [matches, setMatches] = useState([]);
  const [editingMatch, setEditingMatch] = useState(null);
  const [teams, setTeams] = useState([])

  const isAdmin = currentUser?.role === "admin";

  const fetchData = async (getGroupedFixtureFunction) => {
    try {
      // setLoading(true);
      // Fetch tournament details
      const [teamsData, tournamentData] = await Promise.all([getTeams(), getTournamentById(id)])
      // const tournamentData = await getTournamentById(id);

      setTournament(tournamentData);
      setTeams(teamsData)
      // Fetch subdivisions for this tournament
      setSubdivisions(tournamentData.Subdivisions);

      // Set active tab to first subdivision if available
      if (tournamentData?.Subdivisions?.length > 0) {
        setActiveTab(tournamentData.Subdivisions[0].id);

        // Fetch fixtures using la función pasada
        const fixtureData = await getGroupedFixtureFunction(tournamentData.id);

        setFixtures(fixtureData);
      }
    } catch (error) {
      console.error("Error fetching tournament data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isAdmin) {
      fetchData(getFixturesByTournament);
    } else {
      fetchData(getGroupedFixturePredicts);
    }
  }, [id, isAdmin]);

  const formatDateKey = (dateInput) => {
    console.log("dateInput", dateInput)
    const date = new Date(dateInput);
    const fechaCorrecta = new Date(
      date.getTime() + date.getTimezoneOffset() * 300000
    );
    console.log("fechaCorrecta",fechaCorrecta)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(fechaCorrecta.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const enrichMatch = (match) => {
    const homeTeam = teams.find(t => t.id == match.home_team_id);
    const awayTeam = teams.find(t => t.id == match.away_team_id);
    
    console.log(awayTeam, homeTeam)
    return {
      ...match,
      homeTeam: homeTeam,
      awayTeam: awayTeam,
    };
  };

  
  const handleMatchSaved = (savedMatch) => {
    const { subdivision_id, date } = savedMatch;

    const savedMatch1 = enrichMatch(savedMatch);

    console.log(savedMatch1)
    const subdivision = subdivisions.find((s) => s.id === subdivision_id);
    if (!subdivision) return;
  
    const formattedDate = date;
    const subdivisionName = subdivision.name;
  
    const fixtureBySubdivision = fixtures[subdivisionName] || {};
    const matchesForDate = fixtureBySubdivision[formattedDate] || [];
  
    let updatedMatches;
  
    if (editingMatch) {
      updatedMatches = matchesForDate.map((m) =>
        m.id === savedMatch.id ? savedMatch1 : m
      );
    } else {
      updatedMatches = [...matchesForDate, savedMatch1];
    }
  
    if (!roundRefs.current[formattedDate]) {
      roundRefs.current[formattedDate] = React.createRef();
    }
  
    setFixtures((prev) => ({
      ...prev,
      [subdivisionName]: {
        ...prev[subdivisionName],
        [formattedDate]: updatedMatches,
      },
    }));
  
    setShowAddMatchModal(false);
    showToast(
      editingMatch
        ? "Partido actualizado correctamente"
        : "Partido agregado correctamente",
      "success"
    );
  };
  
  // const handlePredictionSaved = async (predictionData, match) => {
  //   // Aquí llamás a la función del service para guardar la predicción
  //   const { subdivision_id, date } = match;
    
  //   try {
      
  //     const savedPrediction = await savePrediction(
  //       predictionData,
  //       currentUser.id
  //     );
  //     console.log(predictionData, savedPrediction, match)
  //     showToast("Predicción guardada correctamente", "success");
  //     fetchData(getGroupedFixturePredicts);
      
  //     setShowPredictionModal(false);
  //     // O actualizar la data recargando el fixture enriquecido
  //     // Por ejemplo:
  //     // const updatedFixture = await getGroupedFixturePredicts(tournament.id);
  //     // setGroupedFixture(updatedFixture[tournament.name]);
  //   } catch (error) {
  //     console.error("Error saving prediction:", error);
  //     showToast("Error al guardar la predicción", "error");
  //   }
  // };
  const handlePredictionSaved = async (predictionData, match) => {
    const { subdivision_id, date } = match;
  
    try {
          const savedPrediction = await savePrediction(
        predictionData,
        currentUser.id
      );
   
      console.log(formatDateKey(date))
      console.log(formatDate(date))

  
      // ACTUALIZAR FIXTURES LOCALMENTE
      const formattedDate = formatDateKey(date);
      const subdivision = subdivisions.find(s => s.id === subdivision_id);
      const subdivisionName = subdivision.name;
  
      const fixtureBySubdivision = fixtures[subdivisionName] || {};
      const matchesForDate = fixtureBySubdivision[formattedDate] || [];
      let updatedMatches = [];
      console.log("matchesForDate", matchesForDate)
      if (matchesForDate.some(m => m.id === match.id)) {
        updatedMatches = matchesForDate.map((m) => {
          if (m.id === match.id) {
            return {
              ...m,
              Predictions: [predictionData],
              userPrediction: predictionData// ✅ creás nuevo objeto con la predicción
            };
          }
          return m;
        });
        
      } else {
        updatedMatches = [...matchesForDate, {
          ...match,
          Predictions: [predictionData],
          userPrediction: predictionData// ✅ creás nuevo objeto con la predicción

        }];
        
      }
  
      if (!roundRefs.current[formattedDate]) {
        roundRefs.current[formattedDate] = React.createRef();
      }
  
      setFixtures((prev) => ({
        ...prev,
        [subdivisionName]: {
          ...prev[subdivisionName],
          [formattedDate]: updatedMatches,
        },
      }));
    
    console.log("updated", updatedMatches)
    console.log("formattedDate", formattedDate)

  
            setShowPredictionModal(false);

      showToast("Predicción guardada correctamente", "success");
    } catch (error) {
      console.error("Error al guardar la predicción:", error);
      showToast("Error al guardar la predicción", "error");
    }
  };
  
  const handleDeleteMatch = async (matchId) => {
    //  Cuando se borra un partido de un fixture se tiene que borrar de todas las subdivisiones

    console.log(matchId);
    // try {
    //   // await deleteTeam(confirmDelete.id)
    //   // setTeams(teams.filter((team) => team.id !== confirmDelete.id))
    //   showToast("Equipo eliminado correctamente", "success")
    // } catch (error) {
    //   console.error("Error deleting team:", error)
    //   showToast("Error al eliminar el equipo", "error")
    // } finally {
    //   setConfirmDelete(null)
    // }
  };
  const handleAddMatch = () => {
    setEditingMatch(null);
    setShowAddMatchModal(true);
  };

  const handleEditMatch = (m) => {
    setEditingMatch(m);
    setShowAddMatchModal(true);
  };

  const handleEditPrediction = (m) => {
    setEditingMatch(m);
    setShowPredictionModal(true);
  };

  const goBack = () => {
    navigate(-1);
  };
  const roundRefs = useRef({}); // para guardar refs por fecha

  // guardarlos cuando las fechas cambian (una sola vez por torneo)
  useEffect(() => {
    if (fixtures && Object.keys(fixtures).length > 0) {
      Object.values(fixtures).forEach((roundGroup) => {
        Object.keys(roundGroup).forEach((fecha) => {
          if (!roundRefs.current[fecha]) {
            roundRefs.current[fecha] = React.createRef();
          }
        });
      });
    }
   
  }, [fixtures]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  if (!tournament) {
    return (
      <DashboardLayout>
        <EmptyState
          title="Torneo no encontrado"
          description="El torneo que estás buscando no existe o ha sido eliminado."
          action={{ label: "Volver a torneos", href: "/tournaments" }}
        />
      </DashboardLayout>
    );
  }
  const handleScrollToNextMatch = () => {
    const today = new Date();
  
    const activeSubdivision = subdivisions.find(s => s.id === activeTab);
    const subdivisionName = activeSubdivision?.name;
  
    if (!subdivisionName || !fixtures[subdivisionName]) {
      showToast("No se pudo encontrar la subdivisión activa", "error");
      return;
    }
  
    const allRounds = Object.entries(fixtures[subdivisionName]);
    const next = allRounds
      .filter(([fecha]) => new Date(fecha) >= today)
      .sort(([a], [b]) => new Date(a) - new Date(b))[0];
  
    if (next) {
      const fecha = next[0];
      const ref = roundRefs.current[fecha];
      if (ref?.current) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      showToast("No hay fechas próximas", "info");
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={goBack}
              className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2"
            >
              <ArrowLeft className="mr-1" size={18} />
              <span>Volver</span>
            </button>
            <h1 className="text-2xl font-bold">{tournament.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {tournament.season}
            </p>
          </div>

          {isAdmin && (
            <Button
              onClick={handleAddMatch}
              variant="primary"
              className="flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Agregar Partido
            </Button>
          )}
        </div>

        {subdivisions?.length === 0 ? (
          <EmptyState
            title="No hay subdivisiones"
            description="Este torneo no tiene subdivisiones configuradas."
          />
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-6 w-full overflow-x-auto flex-nowrap">
              {subdivisions?.map((subdivision) => (
                <TabsTrigger key={subdivision.id} value={subdivision.id}>
                  {subdivision.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {subdivisions?.map((sub) => {
              // Extraer la data del fixture para la subdivisión actual.
              // Aquí asumimos que en la data agrupada la clave es el nombre de la subdivisión.
              const roundData = fixtures ? fixtures[sub.name] : null;
             
              return (
                <TabsContent key={sub.id} value={sub.id} className="space-y-8">
                  <div className="flex justify-end mb-4">
                    <Button onClick={handleScrollToNextMatch}>
                      Ir al próximo partido
                    </Button>
                  </div>
                  {roundData && Object.keys(roundData).length > 0 ? (
                    Object.keys(roundData)
                      .sort((a, b) => a.localeCompare(b)) // Ordenamos por llave, por ejemplo
                      .map((fecha, idx) => (
                        <FixtureRound
                          key={idx}
                          ref={roundRefs.current[fecha]}
                          fecha={idx}
                          roundNumber={fecha}
                          matches={roundData[fecha]}
                          isAdmin={isAdmin}
                          onEditMatch={handleEditMatch}
                          onDeleteMatch={handleDeleteMatch}
                          onEditPrediction={handleEditPrediction}
                        />
                      ))
                  ) : (
                    <EmptyState
                      title="No hay partidos"
                      description="No hay partidos programados para esta subdivisión."
                    />
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        )}
      </div>

      {showAddMatchModal && (
        <Modal
          title="Agregar Partido"
          isOpen={showAddMatchModal}
          onClose={() => setShowAddMatchModal(false)}
        >
          <MatchForm
            match={editingMatch}
            tournamentId={id}
            subdivisionId={activeTab}
            // onSubmit={handleAddMatch}
            onClose={() => setShowAddMatchModal(false)}
            onSave={handleMatchSaved}
          />
        </Modal>
      )}
      {showPredictionModal && (
        <Modal
          title="Editar Predicción"
          isOpen={showPredictionModal}
          onClose={() => setShowPredictionModal(false)}
        >
          <PredictionForm
            match={editingMatch}
            onSave={handlePredictionSaved}
            onClose={() => setShowPredictionModal(false)}
          />
        </Modal>
      )}
    </DashboardLayout>
  );
};

export default FixtureTabs;
