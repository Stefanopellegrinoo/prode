"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Plus } from "lucide-react"
import DashboardLayout from "../components/layouts/DashboardLayout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/Tabs"
import Button from "../components/ui/Button"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { getTournamentById } from "../services/tournamentService"
import { getFixturesByTournament, addFixtureMatch, getGroupedFixture } from "../services/fixtureService"
import FixtureRound from "../components/fixture/FixtureRound"
import EmptyState from "../components/ui/EmptyState"
import Modal from "../components/ui/Modal"
import MatchForm from "../components/admin/forms/MatchForm"
import { useAuth } from "../context/AuthContext"
import { useToast } from "../hooks/useToast"
import FixtureTabs from "../components/fixture/FixtureTabs"

const TournamentFixtures = () => {
  // const { showToast } = useToast()
  
  // const navigate = useNavigate()
  // const { currentUser } = useAuth()
  // const [tournament, setTournament] = useState(null)
  // const [subdivisions, setSubdivisions] = useState([])
  // const [fixtures, setFixtures] = useState({})
  // const [loading, setLoading] = useState(true)
  // const [activeTab, setActiveTab] = useState("")
  // const [showAddMatchModal, setShowAddMatchModal] = useState(false)
  // const [confirmDelete, setConfirmDelete] = useState(null)

  // const [matches, setMatches] = useState([])
  // const [editingMatch, setEditingMatch] = useState(null)


  // useEffect(() => {
  //   const fetchTournamentData = async () => {
  //     try {
  //       setLoading(true)
  //       // Fetch tournament details
  //       const tournamentData = await getTournamentById(id)
  //       console.log(tournamentData)
  //       setTournament(tournamentData)
  //       // Fetch subdivisions for this tournament
  //       setSubdivisions(tournamentData.subdivisions)

  //       // Set active tab to first subdivision if available
  //       if (tournamentData.subdivisions.length > 0) {
  //         setActiveTab(tournamentData.subdivisions[0].id)

  //         // Fetch fixtures for each subdivisio
     
  //           const subdivisionFixtures = await getGroupedFixture(tournamentData.id)
  //           console.log(subdivisionFixtures)

  //         setFixtures(subdivisionFixtures)
  //       }
  //     } catch (error) {
  //       console.error("Error fetching tournament data:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchTournamentData()
  // }, [id])

  // const handleMatchSaved = (savedMatch) => {
  //   if (editingMatch) {
  //     // Si se está editando, actualiza el partido existente
  //     setMatches(matches.map((m) => (m.id === savedMatch.id ? savedMatch : m)));
  //   } else {
  //     // Si es un partido nuevo, lo agrega al array de partidos
  //     setMatches([...matches, savedMatch]);
  //   }
  //   // Cierra el formulario de edición/agregado
  //   setShowAddMatchModal(false);
  //   // Muestra un toast indicando que el partido fue agregado o actualizado correctamente
  //   showToast(
  //     editingMatch ? "Partido actualizado correctamente" : "Partido agregado correctamente",
  //     "success"
  //   );
  // };
  
  //   const handleDeleteMatch = async (matchId) => {
  //     //  Cuando se borra un partido de un fixture se tiene que borrar de todas las subdivisiones
      
  //     console.log(matchId)
  //     // try {
  //     //   // await deleteTeam(confirmDelete.id)
  //     //   // setTeams(teams.filter((team) => team.id !== confirmDelete.id))
  //     //   showToast("Equipo eliminado correctamente", "success")
  //     // } catch (error) {
  //     //   console.error("Error deleting team:", error)
  //     //   showToast("Error al eliminar el equipo", "error")
  //     // } finally {
  //     //   setConfirmDelete(null)
  //     // }
  //   }


  // const handleAddMatch = () => {
  //   setEditingMatch(null)
  //   setShowAddMatchModal(true)
  // }

  // const handleEditMatch = (m) => {
  //   console.log(m)
  //   setEditingMatch(m)
  //   setShowAddMatchModal(true)
  // }


  // const goBack = () => {
  //   navigate(-1)
  // }

  // if (loading) {
  //   return (
  //     <DashboardLayout>
  //       <div className="flex items-center justify-center h-full">
  //         <LoadingSpinner />
  //       </div>
  //     </DashboardLayout>
  //   )
  // }

  // if (!tournament) {
  //   return (
  //     <DashboardLayout>
  //       <EmptyState
  //         title="Torneo no encontrado"
  //         description="El torneo que estás buscando no existe o ha sido eliminado."
  //         action={{ label: "Volver a torneos", href: "/tournaments" }}
  //       />
  //     </DashboardLayout>
  //   )
  // }

  // const isAdmin = currentUser?.role === "admin"
  // const tournamentFixture = fixtures ? fixtures[tournament.name] : {};
  // return (
  //   <DashboardLayout>
  //     <div className="container mx-auto px-4 py-6">
  //       <div className="flex items-center justify-between mb-6">
  //         <div>
  //           <button
  //             onClick={goBack}
  //             className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 mb-2"
  //           >
  //             <ArrowLeft className="mr-1" size={18} />
  //             <span>Volver</span>
  //           </button>
  //           <h1 className="text-2xl font-bold">{tournament.name}</h1>
  //           <p className="text-gray-600 dark:text-gray-400">{tournament.season}</p>
  //         </div>

  //         {isAdmin && (
  //           <Button onClick={handleAddMatch} variant="primary" className="flex items-center">
  //             <Plus size={18} className="mr-1" />
  //             Agregar Partido
  //           </Button>
  //         )}
  //       </div>

  //       {subdivisions.length === 0 ? (
  //         <EmptyState title="No hay subdivisiones" description="Este torneo no tiene subdivisiones configuradas." />
  //       ) : (
  //         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  //           <TabsList className="mb-6 w-full overflow-x-auto flex-nowrap">
  //             {subdivisions.map((subdivision) => (
  //               <TabsTrigger key={subdivision.id} value={subdivision.id}>
  //                 {subdivision.name}
  //               </TabsTrigger>
  //             ))}
  //           </TabsList>
  //           {subdivisions.map((sub) => {
  //             // Extraer la data del fixture para la subdivisión actual.
  //             // Aquí asumimos que en la data agrupada la clave es el nombre de la subdivisión.
  //             const roundData = tournamentFixture ? tournamentFixture[sub.name] : null;
  //             return (
  //               <TabsContent key={sub.id} value={sub.id} className="space-y-8">
  //                 {roundData && Object.keys(roundData).length > 0 ? (
  //                   Object.keys(roundData)
  //                     .sort((a, b) => a.localeCompare(b)) // Ordenamos por llave, por ejemplo
  //                     .map((fecha, idx) => (
  //                       <FixtureRound
  //                         key={idx}
  //                         roundNumber={fecha}
  //                         matches={roundData[fecha]}
  //                         isAdmin={isAdmin}
  //                         onEditMatch={handleEditMatch}
  //                         onDeleteMatch={handleDeleteMatch}
  //                       />
  //                     ))
  //                 ) : (
  //                   <EmptyState
  //                     title="No hay partidos"
  //                     description="No hay partidos programados para esta subdivisión."
  //                   />
  //                 )}
  //               </TabsContent>
  //             );
  //           })}

  //         </Tabs>
  //       )}
  //     </div>

  //     {showAddMatchModal && (
  //       <Modal title="Agregar Partido" isOpen={showAddMatchModal} onClose={() => setShowAddMatchModal(false)}>
  //         <MatchForm
  //           match={editingMatch}
  //           tournamentId={id}
  //           subdivisionId={activeTab}
  //           // onSubmit={handleAddMatch}  
  //           onClose={() => setShowAddMatchModal(false)}
  //           onSave={handleMatchSaved}
  //         />
  //       </Modal>
  //     )}
  //   </DashboardLayout>
  // )
  return(
    <>
    <FixtureTabs/>
    </>
  )
}

export default TournamentFixtures
