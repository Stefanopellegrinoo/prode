"use client"

import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import DashboardLayout from "../components/layouts/DashboardLayout"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { Calendar, MapPin, Trophy, Users, Clock } from 'lucide-react'
import { getMatchDetail } from "../services/matchService"
import { savePrediction } from "../services/predictionService"
import { useToast } from "../hooks/useToast"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { formatDate } from "../utils/dateUtils"
import { MATCH_STATUS } from "../config/constants"

const MatchDetail = () => {
  const { id } = useParams()
  const [match, setMatch] = useState(null)
  const [prediction, setPrediction] = useState({ homeScore: "", awayScore: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { showToast, ToastContainer } = useToast()

  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        setLoading(true)
        const data = await getMatchDetail(id)
        setMatch(data.subdivisions)

        // Initialize prediction with existing user prediction
        if (data.userPrediction) {
          setPrediction({
            homeScore: data.userPrediction.homeScore,
            awayScore: data.userPrediction.awayScore,
          })
        }
      } catch (error) {
        console.error("Error fetching match detail:", error)
        showToast("Error al cargar los detalles del partido", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchMatchDetail()
  }, [id, showToast])

  const handlePredictionChange = (team, value) => {
    const numValue = parseInt(value, 10) || ""
    setPrediction((prev) => ({
      ...prev,
      [team]: numValue,
    }))
  }

  const handleSavePrediction = async () => {
    try {
      setSaving(true)
      await savePrediction(id, prediction)
      showToast("Pronóstico guardado correctamente", "success")
    } catch (error) {
      console.error("Error saving prediction:", error)
      showToast("Error al guardar el pronóstico", "error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout title="Detalle del Partido">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    )
  }

  // if (!match) {
  //   return (
  //     <DashboardLayout title="Detalle del Partido">
  //       <div className="text-center py-8">
  //         <p className="text-gray-500 dark:text-gray-400">No se encontró el partido</p>
  //       </div>
  //     </DashboardLayout>
  //   )
  // }

  // const isPredictionLocked = match.status !== MATCH_STATUS.UPCOMING

  return (
    <DashboardLayout title="Detalle del Partido">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"></div>
        <div className="lg:col-span-2">
          <Card>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              Object.keys(match).length > 0 ? (
                <div className="flex flex-col items-center">
                  <div>
                    {match?.map((match) => (
                      <React.Fragment key={match.id}>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {match.tournament}
                        </div>
  
                        <div className="flex items-center justify-center w-full my-6">
                          <div className="flex flex-col items-center flex-1">
                            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-2">
                              <img
                                src={match.homeTeam.logo || `/placeholder.svg?height=80&width=80`}
                                alt={match.homeTeam.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-center">
                              {match.homeTeam.name}
                            </h3>
                          </div>
  
                          <div className="flex flex-col items-center px-4">
                            {match.status !== MATCH_STATUS.UPCOMING ? (
                              <div className="text-3xl font-bold mb-2">
                                {match.homeScore} - {match.awayScore}
                              </div>
                            ) : (
                              <div className="text-3xl font-bold mb-2">vs</div>
                            )}
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded-full ${
                                match.status === MATCH_STATUS.LIVE
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  : match.status === MATCH_STATUS.FINISHED
                                  ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              {match.status === MATCH_STATUS.LIVE
                                ? "EN VIVO"
                                : match.status === MATCH_STATUS.FINISHED
                                ? "FINALIZADO"
                                : "PRÓXIMO"}
                            </span>
                          </div>
  
                          <div className="flex flex-col items-center flex-1">
                            <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mb-2">
                              <img
                                src={match.awayTeam.logo || `/placeholder.svg?height=80&width=80`}
                                alt={match.awayTeam.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <h3 className="text-lg font-medium text-center">
                              {match.awayTeam.name}
                            </h3>
                          </div>
                        </div>
  
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mt-4">
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                            <span className="text-sm">{formatDate(match.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                            <span className="text-sm">{match.stadium}</span>
                          </div>
                          <div className="flex items-center">
                            <Trophy className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                            <span className="text-sm">{match.tournament}</span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  
                     "No hay subdivisiones registradas"
                </div>
              )
            )}
          </Card>
  
          {match.status !== MATCH_STATUS.UPCOMING && (
            <Card title="Estadísticas del Partido" className="mt-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {match.stats?.possession?.home || 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Posesión
                  </div>
                  <div className="text-2xl font-bold mt-4">
                    {match.stats?.territory?.home || 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Territorio
                  </div>
                </div>
  
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-medium mb-2">Estadísticas</div>
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700"></div>
                </div>
  
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {match.stats?.possession?.away || 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Posesión
                  </div>
                  <div className="text-2xl font-bold mt-4">
                    {match.stats?.territory?.away || 0}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Territorio
                  </div>
                </div>
              </div>
  
              <div className="mt-6">
                <h4 className="font-medium mb-2">Eventos del Partido</h4>
                <div className="space-y-2">
                  {match.events && match.events.length > 0 ? (
                    match.events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 border-b dark:border-gray-700"
                      >
                        <div className="w-12 text-sm font-medium">
                          {event.minute}'
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{event.type}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {event.description}
                          </div>
                        </div>
                        <div className="text-sm">{event.team}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No hay eventos registrados
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>
  
        <div>
          {/* <Card title="Mi Pronóstico" icon={<Users className="h-5 w-5" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
                    <img
                      src={
                        match.homeTeam.logo ||
                        `/placeholder.svg?height=32&width=32`
                      }
                      alt={match.homeTeam.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{match.homeTeam.name}</span>
                </div>
  
                <input
                  type="number"
                  min="0"
                  value={prediction.homeScore}
                  onChange={(e) =>
                    handlePredictionChange("homeScore", e.target.value)
                  }
                  className={`w-12 h-10 text-center border rounded-md ${
                    isPredictionLocked
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }`}
                  disabled={isPredictionLocked}
                />
              </div>
  
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
                    <img
                      src={
                        match.awayTeam.logo ||
                        `/placeholder.svg?height=32&width=32`
                      }
                      alt={match.awayTeam.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="font-medium">{match.awayTeam.name}</span>
                </div>
  
                <input
                  type="number"
                  min="0"
                  value={prediction.awayScore}
                  onChange={(e) =>
                    handlePredictionChange("awayScore", e.target.value)
                  }
                  className={`w-12 h-10 text-center border rounded-md ${
                    isPredictionLocked
                      ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }`}
                  disabled={isPredictionLocked}
                />
              </div>
  
              {isPredictionLocked ? (
                <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                  {match.status === MATCH_STATUS.FINISHED
                    ? "Este partido ya finalizó y no se pueden modificar los pronósticos"
                    : "Este partido ya comenzó y no se pueden modificar los pronósticos"}
                </div>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleSavePrediction}
                  loading={saving}
                  disabled={
                    saving ||
                    prediction.homeScore === "" ||
                    prediction.awayScore === ""
                  }
                >
                  Guardar Pronóstico
                </Button>
              )}
  
              {match.status === MATCH_STATUS.FINISHED && match.userPrediction && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <h4 className="font-medium text-sm mb-2">
                    Resultado de tu pronóstico
                  </h4>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tu pronóstico</span>
                    <span className="font-medium">
                      {match.userPrediction.homeScore} - {match.userPrediction.awayScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">Resultado final</span>
                    <span className="font-medium">
                      {match.homeScore} - {match.awayScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm">Puntos obtenidos</span>
                    <span className="font-bold text-primary">
                      {match.userPrediction.points || 0}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card> */}
  
          <Card title="Tiempo Restante" icon={<Clock className="h-5 w-5" />} className="mt-6">
            {match.status === MATCH_STATUS.UPCOMING ? (
              <div className="text-center py-4">
                <div id="countdown" className="text-2xl font-bold mb-2">
                  2d 14h 35m
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Tiempo restante para realizar tu pronóstico
                </p>
              </div>
            ) : match.status === MATCH_STATUS.LIVE ? (
              <div className="text-center py-4">
                <div className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                  EN VIVO
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  El partido está en curso en este momento
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-xl font-bold mb-2">FINALIZADO</div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  El partido ha terminado
                </p>
              </div>
            )}
          </Card>
        </div>
  
        <ToastContainer />
      </DashboardLayout>
    );
}
export default MatchDetail
