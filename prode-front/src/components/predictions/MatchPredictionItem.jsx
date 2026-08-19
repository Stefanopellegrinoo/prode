import PropTypes from "prop-types"
import { formatDate } from "../../utils/dateUtils"
import { MATCH_STATUS } from "../../config/constants"

const MatchPredictionItem = ({ match, prediction, onPredictionChange, onMatchClick }) => {
  const { id, homeTeam, awayTeam, date, status, stadium, tournament } = match
  const isPredictionLocked = status !== MATCH_STATUS.UPCOMING

  const handleScoreChange = (team, value) => {
    if (!isPredictionLocked) {
      onPredictionChange(id, team, value)
    }
  }

  return (
    <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
      <div
        className="bg-gray-50 dark:bg-gray-800 p-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={onMatchClick}
      >
        <div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{tournament}</span>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {formatDate(date)} • {stadium}
          </div>
        </div>
        <div>
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              status === MATCH_STATUS.LIVE
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : status === MATCH_STATUS.FINISHED
                ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {status === MATCH_STATUS.LIVE
              ? "EN VIVO"
              : status === MATCH_STATUS.FINISHED
              ? "FINALIZADO"
              : "PRÓXIMO"}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              <img
                src={homeTeam.logo || `/placeholder.svg?height=40&width=40`}
                alt={homeTeam.name}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-medium">{homeTeam.name}</span>
          </div>

          <div className="flex items-center space-x-2 px-2">
            <input
              type="number"
              min="0"
              value={prediction.homeScore}
              onChange={(e) => handleScoreChange("homeScore", e.target.value)}
              className={`w-12 h-10 text-center border rounded-md ${
                isPredictionLocked
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800"
              }`}
              disabled={isPredictionLocked}
            />
            <span className="text-lg font-bold">-</span>
            <input
              type="number"
              min="0"
              value={prediction.awayScore}
              onChange={(e) => handleScoreChange("awayScore", e.target.value)}
              className={`w-12 h-10 text-center border rounded-md ${
                isPredictionLocked
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-700"
                  : "bg-white dark:bg-gray-800"
              }`}
              disabled={isPredictionLocked}
            />
          </div>

          <div className="flex items-center space-x-3 flex-1 justify-end">
            <span className="font-medium">{awayTeam.name}</span>
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
              <img
                src={awayTeam.logo || `/placeholder.svg?height=40&width=40`}
                alt={awayTeam.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        {isPredictionLocked && (
          <div className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
            {status === MATCH_STATUS.FINISHED
              ? "Este partido ya finalizó y no se pueden modificar los pronósticos"
              : "Este partido ya comenzó y no se pueden modificar los pronósticos"}
          </div>
        )}
      </div>
    </div>
  )
}

MatchPredictionItem.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.string.isRequired,
    homeTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
    }).isRequired,
    awayTeam: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string,
    }).isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    stadium: PropTypes.string,
    tournament: PropTypes.string,
    userPrediction: PropTypes.shape({
      homeScore: PropTypes.number,
      awayScore: PropTypes.number,
    }),
  }).isRequired,
  prediction: PropTypes.shape({
    homeScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    awayScore: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  onPredictionChange: PropTypes.func.isRequired,
  onMatchClick: PropTypes.func.isRequired,
}

export default MatchPredictionItem
