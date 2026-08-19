import PropTypes from "prop-types"
import { Calendar } from "lucide-react"
import Card from "../ui/Card"
import MatchItem from "../matches/MatchItem"
import LoadingSpinner from "../ui/LoadingSpinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs"

const UpcomingMatchesCard = ({ matches, loading, onMatchClick }) => {


  return (
<Card title="Próximos Partidos" icon={<Calendar className="h-5 w-5" />}>
  {loading ? (
    <div className="flex justify-center py-8">
      <LoadingSpinner />
    </div>
  ) : matches.length > 0 ? (
    <Tabs defaultValue={matches[0]?.tournament_id?.toString()} className="w-full">
      <TabsList className="mb-2 w-full overflow-x-auto flex-nowrap">
        {matches?.map((tournament) => (
          <TabsTrigger key={tournament.tournament_id} value={tournament.tournament_id.toString()}>
            {tournament.tournament_name}
          </TabsTrigger>
        ))}
      </TabsList>

      {matches.map((tournament) => (
        <TabsContent key={tournament.tournament_id} value={tournament.tournament_id.toString()} className="space-y-4">
          {tournament.matches.map((match) => (
            <MatchItem
              key={match.id}
              match={match}
            />
          ))}
        </TabsContent>
      ))}
    </Tabs>
  ) : (
    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
      No hay partidos próximos programados
    </div>
  )}
</Card>
  )
}

UpcomingMatchesCard.propTypes = {
  matches: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onMatchClick: PropTypes.func.isRequired,
}

export default UpcomingMatchesCard
