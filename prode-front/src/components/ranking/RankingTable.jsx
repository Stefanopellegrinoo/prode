import PropTypes from "prop-types";

// Shared table for Ranking (delta column, no admin actions) and GroupDetail
// (admin ✕ column, no delta — that prototype's 4th column is blank outside
// edit mode, it never shows a delta).
//
// The two prototypes differ on purpose and each prop tracks one of those
// differences instead of forcing one behavior on both:
// - 4th column width: 56px in Ranking.dc.html (delta), 44px in Grupo
//   Detalle.dc.html (✕ / blank), derived from `showDelta`.
// - Podium coloring: Ranking.dc.html paints every top-3 row flat gold;
//   Grupo Detalle.dc.html tiers gold/silver/bronze by exact position.
const RankingTable = ({ rows, meId, onRemove, showDelta = true, podiumTiered = false }) => {
  const gridCols = showDelta
    ? "grid-cols-[44px_1fr_62px_56px]"
    : "grid-cols-[44px_1fr_62px_44px]";

  const podiumColor = (pos) => {
    if (!podiumTiered) return pos <= 3 ? "text-prode-gold" : "text-prode-text-disabled";
    if (pos === 1) return "text-prode-gold";
    if (pos === 2) return "text-prode-silver";
    if (pos === 3) return "text-prode-bronze";
    return "text-prode-text-disabled";
  };

  return (
    <div className="bg-prode-surface border border-prode-border rounded-[10px] overflow-hidden">
      <div
        className={`grid ${gridCols} px-4 py-[10px] border-b border-prode-border text-[11px] font-[800] tracking-[0.1em] uppercase text-prode-text-disabled`}
      >
        <div>#</div>
        <div>Jugador</div>
        <div className="text-right">Pts</div>
        <div className="text-right">{showDelta ? "Fecha" : ""}</div>
      </div>

      {rows.map((r) => {
        const isMe = r.userId === meId;
        const removable = Boolean(onRemove) && !isMe;

        return (
          <div
            key={r.userId}
            className={`grid ${gridCols} px-4 py-[12px] border-b border-prode-border-divider items-center ${
              isMe ? "bg-prode-elevated" : ""
            }`}
          >
            <div className={`font-display text-[15px] font-[900] tabular-nums ${podiumColor(r.pos)}`}>
              {r.pos}
            </div>
            <div className="flex flex-col min-w-0 pr-2">
              <div className="text-[15px] font-[700] whitespace-nowrap overflow-hidden text-ellipsis">
                {isMe ? `${r.name} — vos` : r.name}
              </div>
              {r.sub && <div className="text-[13px] text-prode-text-disabled truncate">{r.sub}</div>}
            </div>
            <div className="text-right font-display text-[17px] font-[800] tabular-nums">{r.points}</div>
            {removable ? (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onRemove(r.userId, r.name)}
                  aria-label={`Eliminar a ${r.name}`}
                  className="w-[32px] h-[32px] rounded-[5px] bg-prode-error-bg text-prode-error flex items-center justify-center text-[14px] font-[800]"
                >
                  ✕
                </button>
              </div>
            ) : showDelta ? (
              <div
                className={`text-right text-[13px] font-[700] tabular-nums ${
                  r.delta && r.delta !== "—" ? "text-prode-success" : "text-prode-text-disabled"
                }`}
              >
                {r.delta || "—"}
              </div>
            ) : (
              <div />
            )}
          </div>
        );
      })}

      {rows.length === 0 && (
        <div className="p-6 text-center text-[14px] text-prode-text-muted font-[600]">
          No se encontraron jugadores.
        </div>
      )}
    </div>
  );
};

RankingTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      pos: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      sub: PropTypes.string,
      points: PropTypes.number.isRequired,
      delta: PropTypes.string,
    })
  ).isRequired,
  meId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onRemove: PropTypes.func,
  showDelta: PropTypes.bool,
  podiumTiered: PropTypes.bool,
};

export default RankingTable;
