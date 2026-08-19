import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import { Users, Trophy, ArrowRight } from 'lucide-react'
import Card from "../ui/Card"

const GroupCard = ({ group }) => {
  const { id, name, description, memberCount, isAdmin, ranking } = group

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-lg">{name}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users className="h-3 w-3 mr-1" />
              <span>{memberCount} miembros</span>
            </div>
          </div>
        </div>
        {isAdmin && (
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Admin</span>
        )}
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">{description}</p>

      {ranking && ranking.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2 flex items-center">
            <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
            Top 3
          </h4>
          <ul className="space-y-2">
            {ranking.slice(0, 3).map((user, index) => (
              <li key={user.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-xs mr-2 ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : index === 1
                        ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span>{user.name}</span>
                </div>
                <span className="font-medium">{user.points} pts</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to={`/groups/${id}`}
        className="flex items-center justify-center text-primary hover:text-primary-dark text-sm font-medium mt-2"
      >
        Ver Grupo
        <ArrowRight className="h-4 w-4 ml-1" />
      </Link>
    </Card>
  )
}

GroupCard.propTypes = {
  group: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    memberCount: PropTypes.number.isRequired,
    isAdmin: PropTypes.bool.isRequired,
    ranking: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        points: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
}

export default GroupCard

