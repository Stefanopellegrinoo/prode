import PropTypes from "prop-types";
import { SHELL_WIDTH } from "../layouts/shellWidth";

// Fixed "my row" for Ranking.dc.html only (Grupo Detalle.dc.html has no
// equivalent — GroupDetail relies on RankingTable's highlighted row instead).
// gapToPodium: number of points behind the 3rd place, or null when already
// in the podium (renders "—", same fallback already used for the delta
// column since the backend doesn't expose a per-fecha delta). shellWidth
// follows the same fixed-element pattern as SaveBar/BottomNav.
const PinnedRow = ({ pos, name, points, gapToPodium, shellWidth = SHELL_WIDTH.default }) => (
  <div className={`fixed bottom-[88px] left-0 right-0 z-30 flex justify-center px-4 pointer-events-none`}>
    <div
      className={`w-full ${shellWidth} bg-prode-select-bg text-prode-select-fg rounded-[8px] p-3 px-4 grid grid-cols-[44px_1fr_62px_56px] items-center pointer-events-auto shadow-lg`}
    >
      <div className="font-display text-[16px] font-[900] tabular-nums">{pos}</div>
      <div className="flex flex-col pr-2 min-w-0">
        <div className="text-[15px] font-[800] truncate">{name} — vos</div>
        <div className="text-[12px] opacity-60 font-[600]">
          {gapToPodium == null ? "—" : `a ${gapToPodium} pts del podio`}
        </div>
      </div>
      <div className="text-right font-display text-[17px] font-[900] tabular-nums">{points}</div>
      <div className="text-right text-[13px] font-[700] tabular-nums opacity-60">—</div>
    </div>
  </div>
);

PinnedRow.propTypes = {
  pos: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  points: PropTypes.number.isRequired,
  gapToPodium: PropTypes.number,
  shellWidth: PropTypes.string,
};

export default PinnedRow;
