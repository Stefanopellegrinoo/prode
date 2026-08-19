import PropTypes from "prop-types"
import { formatDate } from "../../utils/dateUtils"
import { MATCH_STATUS } from "../../config/constants"

const MatchItem = ({ match, onClick }) => {
  const { homeTeam, awayTeam, date, status, homeScore, awayScore } = match
 const oficialWinner = match?.result == null ?  "-" : (match?.result == "home" ? match.homeTeam?.name : match.awayTeam?.name) || "-"

  const getStatusClass = () => {
    switch (status) {
      case MATCH_STATUS.FINISHED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case MATCH_STATUS.FINISHED:
        return "FINALIZADO"
      default:
        return formatDate(date)
    }
  }

  return (
    <div
      className="border dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClass()}`}>{getStatusText()}</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            <img
             src={`${homeTeam.logo}?t=${homeTeam.logoUpdatedAt}`}
              alt={homeTeam.name}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="font-medium">{homeTeam.name}</span>
        </div>

        <div className="text-center px-4">
          {status !== MATCH_STATUS.UPCOMING ? (
            <div className="text-sm font-light">
              {oficialWinner}
            </div>
          ) : (
            <div className="text-lg font-bold">vs</div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <span className="font-medium">{awayTeam.name}</span>
          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
            <img
             src={`${awayTeam.logo}?t=${awayTeam.logoUpdatedAt}`}
              alt={awayTeam.name}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

MatchItem.propTypes = {
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
    homeScore: PropTypes.number,
    awayScore: PropTypes.number,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
}

export default MatchItem
