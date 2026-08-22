import PropTypes from "prop-types";
import TeamPlate from "./TeamPlate";
import DrawBar from "./DrawBar";
import StatusBadge from "./StatusBadge";

const MatchCard = ({ match, prediction, status, onPredict }) => {
  // prediction: "home" | "away" | "draw" | null
  // status: "live" | "finished" | "scheduled"
  // badgeVariant: "saved" | "unsaved" | "pending" | "live" | "hit" | "miss" | null

  const isLocked = status === "live" || status === "finished";

  const handlePredict = (value) => {
    if (isLocked) return;
    // Toggle behavior: if picking the same, deselect
    onPredict(prediction === value ? null : value);
  };

  return (
    <div className="bg-prode-surface border border-prode-border rounded-[8px] p-[14px] px-4 flex flex-col gap-3">
      <div className="flex items-center justify-between min-h-[26px]">
        <div className="text-[14px] font-[600] text-prode-text-muted">
          {match.time}
        </div>
        {match.badgeVariant && (
          <StatusBadge variant={match.badgeVariant} customLabel={match.customBadgeLabel} />
        )}
      </div>

      <div className="flex flex-col">
        <div className="flex gap-[6px]">
          <TeamPlate
            team={match.home}
            isSelected={prediction === "home"}
            isLocked={isLocked}
            onClick={() => handlePredict("home")}
          />
          <TeamPlate
            team={match.away}
            isSelected={prediction === "away"}
            isLocked={isLocked}
            onClick={() => handlePredict("away")}
          />
        </div>
        <DrawBar
          isSelected={prediction === "draw"}
          isLocked={isLocked}
          onClick={() => handlePredict("draw")}
        />
      </div>
      
      {/* If it's locked and there's a result, show it as a note below */}
      {isLocked && match.resultNote && (
        <div className="text-[13px] font-[600] text-prode-text-muted mt-2 text-center">
          {match.resultNote}
        </div>
      )}
    </div>
  );
};

MatchCard.propTypes = {
  match: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    time: PropTypes.string.isRequired,
    home: PropTypes.shape({
      shortName: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    away: PropTypes.shape({
      shortName: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    badgeVariant: PropTypes.string,
    customBadgeLabel: PropTypes.string,
    resultNote: PropTypes.string,
  }).isRequired,
  prediction: PropTypes.oneOf(["home", "away", "draw", null]),
  status: PropTypes.oneOf(["live", "finished", "scheduled"]),
  onPredict: PropTypes.func.isRequired,
};

export default MatchCard;
