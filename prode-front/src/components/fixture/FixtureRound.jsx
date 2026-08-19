import { forwardRef } from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import FixtureMatch from "./FixtureMatch";
import { formatDate } from "../../utils/dateUtils";

const FixtureRound = forwardRef(({
  fecha,
  roundNumber,
  matches,
  date,
  isAdmin,
  onEditMatch,
  onDeleteMatch,
  onEditPrediction,
}, ref) => {
  const fechaOriginal = new Date(roundNumber);
  const fechaCorrecta = new Date(
    fechaOriginal.getTime() + fechaOriginal.getTimezoneOffset() * 600000
  );

  fechaCorrecta.toLocaleDateString("es-AR");

  // mostrar  const
  const formattedDate = fechaCorrecta
    ? format(new Date(fechaCorrecta), "dd/MMM/yyyy", { locale: es })
    : null;

  return (
    <div ref={ref} className="mb-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold">
          Fecha {fecha+1} - {formatDate(roundNumber)}
          {/* {formattedDate && <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">-s {formattedDate}</span>} */}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {matches.map((match) => (
          <FixtureMatch
            key={match.id}
            match={match}
            isAdmin={isAdmin}
            onEditMatch={onEditMatch}
            onDeleteMatch={onDeleteMatch}
            onEditPrediction={onEditPrediction}
            
          />
        ))}
      </div>
    </div>
  );
});

FixtureRound.propTypes = {
  roundNumber: PropTypes.number.isRequired,
  matches: PropTypes.array.isRequired,
  date: PropTypes.string,
};

export default FixtureRound;
