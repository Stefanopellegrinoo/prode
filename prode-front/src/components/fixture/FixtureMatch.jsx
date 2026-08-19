import Button from "../ui/Button"

const FixtureMatch = ({ match, isAdmin, onEditMatch, onDeleteMatch, onEditPrediction }) => {
  const { id, homeTeam, awayTeam, home_score, away_score, venue } = match
  // Resultado oficial: si homeScore o awayScore no son números, se muestra "-"
  // const officialHomeScore = typeof home_score === "number" ? home_score : "-"
  // const officialAwayScore = typeof away_score === "number" ? away_score : "-"
  
  const oficialWinner = match?.result == null ?  "-" : (match?.result == "home" ? match.homeTeam?.name : match.awayTeam?.name) || "-"
  // Predicción del usuario (enriquecido en el fixture)
  const userPred = match?.Predictions !== undefined ? match.Predictions[0] : null
  // console.log(match.Predictions[0])
  // Si existe, se muestra; si no, se muestra "-"
  // const userHomePred = userPred?.predicted_home_score !== undefined ? userPred.predicted_home_score : "-"
  // const userAwayPred = userPred?.predicted_away_score !== undefined ? userPred.predicted_away_score : "-"

  const predictionWinner = userPred?.predicted_winner !== undefined ? (userPred?.predicted_winner === 'home' ? match.homeTeam?.name  : match.awayTeam?.name) : "-"

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-900 mb-2">
      {/* Equipo Local */}
      <div className="flex items-center space-x-2 w-[30%]">
        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={homeTeam?.logo || `/placeholder.svg?height=32&width=32`}
            alt={homeTeam?.name}
            className="h-full w-full object-cover"
          />
        </div>
        <span className="font-medium text-gray-100 truncate">{homeTeam?.name}</span>
      </div>

      {/* Resultado y Pronóstico */}
      <div className="flex flex-col items-center justify-center w-[40%]">
        <div className="flex items-center space-x-2">
        <span className="text-s font-bold text-gray-100">Ganador: </span>
        <span> </span>
         <span className="text-s font-bold text-gray-100"> { oficialWinner}</span>
          
        </div>

        {!isAdmin && (
          <div className="text-xs text-gray-400 mt-1">
            Tu pronóstico: {predictionWinner}
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-2">
          {!isAdmin ? (
            <Button variant="outline" size="sm" className="text-xs" onClick={() => onEditPrediction(match)}>
              {userPred ? "Editar pronóstico" : "Hacer pronóstico"}
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onEditMatch(match)}>
                Editar
              </Button>
              <Button variant="danger" size="sm" className="text-xs" onClick={() => onDeleteMatch(match.id)}>
                Eliminar
              </Button>
            </div>
          )}
        </div>

        {/* Información adicional: Ejemplo, el venue */}
        {venue && <div className="text-xs text-gray-500 mt-1">{venue}</div>}
      </div>

      {/* Equipo Visitante */}
      <div className="flex items-center justify-end space-x-2 w-[30%]">
        <span className="font-medium text-gray-100 truncate text-right">{awayTeam?.name}</span>
        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
          <img
            src={awayTeam?.logo || `/placeholder.svg?height=32&width=32`}
            alt={awayTeam?.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}

export default FixtureMatch
