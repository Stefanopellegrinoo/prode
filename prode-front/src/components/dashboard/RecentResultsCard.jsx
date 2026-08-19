import PropTypes from "prop-types"
import { CheckCircle } from "lucide-react"
import Card from "../ui/Card"
import LoadingSpinner from "../ui/LoadingSpinner"

const RecentResultsCard = ({ results, loading, onMatchClick }) => {
  return (
    <Card title="Resultados Recientes" icon={<CheckCircle className="h-5 w-5" />}>
      {loading ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3">
          {results.map((match) => (
            <div
              key={match.id}
              className="border dark:border-gray-700 rounded-md p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              onClick={() => onMatchClick(match.id)}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{match.tournament}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    <img
                      src={match.homeTeam.logo || `/placeholder.svg?height=24&width=24`}
                      alt={match.homeTeam.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{match.homeTeam.name}</span>
                </div>
                <span className="font-bold">{match.homeScore}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                    <img
                      src={match.awayTeam.logo || `/placeholder.svg?height=24&width=24`}
                      alt={match.awayTeam.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium">{match.awayTeam.name}</span>
                </div>
                <span className="font-bold">{match.awayScore}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No hay resultados recientes</div>
      )}
    </Card>
  )
}

RecentResultsCard.propTypes = {
  results: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onMatchClick: PropTypes.func.isRequired,
}

export default RecentResultsCard
