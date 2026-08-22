import { useState } from "react";
import { Link } from "react-router-dom";

// Fixture demo de Primera (fecha fija del handoff, sin backend — Landing es pública).
// Siglas y venues verbatim del prototipo Landing.dc.html.
const FIXTURE = [
  { id: "m1", time: "15:30", home: "CASI", away: "SIC", homeCode: "CAS", awayCode: "SIC", venue: "La Catedral" },
  { id: "m2", time: "15:30", home: "Hindú", away: "CUBA", homeCode: "HIN", awayCode: "CUB", venue: "Don Bosco" },
  { id: "m3", time: "15:30", home: "Newman", away: "Alumni", homeCode: "NEW", awayCode: "ALU", venue: "Benavídez" },
  { id: "m4", time: "16:00", home: "Belgrano", away: "Regatas", homeCode: "BEL", awayCode: "REG", venue: "Virrey del Pino" },
  { id: "m5", time: "16:00", home: "Pucará", away: "San Luis", homeCode: "PUC", awayCode: "SLU", venue: "Burzaco" },
  { id: "m6", time: "16:30", home: "Rosario", away: "Tala", homeCode: "ROS", awayCode: "TAL", venue: "Las Delicias" },
];

const RULES = [
  "Cada cruce se juega cinco veces el mismo sábado: Primera, Intermedia y las tres Pre. Son 17 pronósticos por fecha, un toque cada uno.",
  "Acierto simple, 3 puntos. Empate acertado, 5: en el rugby casi no existen, animate. Los puntos se cargan el domingo con los resultados oficiales.",
  "Los grupos son privados, por código de invitación. La tradición manda: el último de la tabla anual paga el asado de diciembre.",
];

const PICK_BUTTON_BASE =
  "flex-1 h-[48px] rounded-[4px] font-display text-[14px] font-[900] transition-colors duration-100";
const PICK_BUTTON_SELECTED = "bg-[#0B0F0D] text-[#EDEFEA]";
const PICK_BUTTON_IDLE = "bg-transparent border border-[#A8B1A7] text-[#3B443C]";

const Landing = () => {
  const [picks, setPicks] = useState({});

  const togglePick = (matchId, value) => {
    setPicks((prev) => ({
      ...prev,
      [matchId]: prev[matchId] === value ? null : value,
    }));
  };

  const count = Object.values(picks).filter(Boolean).length;
  const done = count === FIXTURE.length;

  const ctaNote =
    count === 0
      ? "Intermedia, Pre A, Pre B y Pre C se pronostican adentro, con los mismos cruces."
      : done
        ? "Fecha completa. Faltan las otras cuatro categorías: no pierdas estos seis."
        : `Llevás ${count} de 6. Con una cuenta quedan guardados y suman al ranking.`;

  const ctaLabel = count === 0 ? "Crear cuenta gratis" : "Guardar mis pronósticos";

  return (
    <div className="light min-h-screen bg-[#EDEFEA] text-[#0B0F0D] font-body pb-16">
      {/* Cabecera hairline */}
      <div className="border-b border-[#0B0F0D]">
        <div className="max-w-[1040px] mx-auto px-6 pt-[14px] pb-[10px] flex items-baseline justify-between gap-3 flex-wrap">
          <div className="text-[13px] font-[600] text-[#4A544B]">
            Buenos Aires, sábado 22 de agosto de 2026
          </div>
          <div className="flex items-baseline gap-[18px]">
            <div className="text-[13px] font-[600] text-[#4A544B]">URBA Top 12 — Fecha 12</div>
            <Link to="/login" className="text-[13px] font-[800] border-b-2 border-[#0B0F0D] pb-[1px]">
              Entrar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1040px] mx-auto px-6">
        {/* Masthead */}
        <h1 className="font-display font-[900] uppercase leading-[0.85] tracking-[-0.04em] mt-[18px] -ml-[6px] text-[26vw] min-[761px]:text-[clamp(90px,17vw,210px)]">
          Prode
        </h1>

        {/* Lead */}
        <div className="flex flex-col min-[761px]:flex-row min-[761px]:items-end justify-between gap-6 border-y border-[#0B0F0D] mt-[18px] py-3">
          <p className="text-[17px] leading-[1.5] max-w-[560px]">
            El juego de pronósticos del rugby de Buenos Aires. Abajo está la fecha de Primera: marcá tus ganadores ahora, sin cuenta ni vueltas.
          </p>
          <div className="text-[13px] font-[600] text-[#4A544B] whitespace-nowrap">
            Cierre: sábado 09:00
          </div>
        </div>

        {/* Hero funcional: fixture Primera */}
        <div className="mt-[28px]">
          <div className="flex items-baseline justify-between gap-3 pb-2">
            <h2 className="font-display text-[15px] font-[900] uppercase tracking-[0.1em]">
              Primera · Sáb 22
            </h2>
            <div className="text-[13px] font-[600] text-[#4A544B] tabular-nums">
              {count === 0 ? "6 partidos" : `${count} de 6 marcados`}
            </div>
          </div>

          <div className="flex flex-col">
            {FIXTURE.map((m) => {
              const sel = picks[m.id];
              const homeDim = Boolean(sel) && sel !== "H" && sel !== "D";
              const awayDim = Boolean(sel) && sel !== "A" && sel !== "D";
              return (
                <div
                  key={m.id}
                  className="grid grid-cols-1 min-[761px]:grid-cols-[64px_1fr_236px] gap-[10px] min-[761px]:gap-4 items-start min-[761px]:items-center border-t border-[#C9D1C8] py-[14px]"
                >
                  <div className="text-[14px] font-[600] text-[#4A544B] tabular-nums">{m.time}</div>
                  <div className="flex items-baseline gap-[10px] flex-wrap min-w-0">
                    <span
                      className={`font-display text-[19px] font-[800] uppercase tracking-[-0.01em] ${homeDim ? "text-[#A8B1A7]" : "text-[#0B0F0D]"}`}
                    >
                      {m.home}
                    </span>
                    <span className="text-[13px] text-[#6B756C]">vs</span>
                    <span
                      className={`font-display text-[19px] font-[800] uppercase tracking-[-0.01em] ${awayDim ? "text-[#A8B1A7]" : "text-[#0B0F0D]"}`}
                    >
                      {m.away}
                    </span>
                    <span className="text-[13px] text-[#6B756C]">· {m.venue}</span>
                  </div>
                  <div className="flex gap-[5px]">
                    <button
                      type="button"
                      aria-pressed={sel === "H"}
                      onClick={() => togglePick(m.id, "H")}
                      className={`${PICK_BUTTON_BASE} ${sel === "H" ? PICK_BUTTON_SELECTED : PICK_BUTTON_IDLE}`}
                    >
                      {m.homeCode}
                    </button>
                    <button
                      type="button"
                      aria-pressed={sel === "D"}
                      onClick={() => togglePick(m.id, "D")}
                      className={`${PICK_BUTTON_BASE} ${sel === "D" ? PICK_BUTTON_SELECTED : PICK_BUTTON_IDLE}`}
                    >
                      X
                    </button>
                    <button
                      type="button"
                      aria-pressed={sel === "A"}
                      onClick={() => togglePick(m.id, "A")}
                      className={`${PICK_BUTTON_BASE} ${sel === "A" ? PICK_BUTTON_SELECTED : PICK_BUTTON_IDLE}`}
                    >
                      {m.awayCode}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fila CTA */}
          <div className="flex flex-col min-[761px]:flex-row min-[761px]:items-center justify-between gap-4 border-t border-[#0B0F0D] py-4">
            <div className="text-[15px] font-[600] text-[#4A544B] leading-[1.5] max-w-[480px]">
              {ctaNote}
            </div>
            <Link
              to="/login"
              className={`h-[52px] px-6 rounded-[4px] flex items-center justify-center text-[15px] font-[800] flex-shrink-0 ${
                count > 0 ? "bg-[#0B0F0D] text-[#EDEFEA]" : "border border-[#0B0F0D] text-[#0B0F0D]"
              }`}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>

        {/* Cómo se juega */}
        <div className="mt-[44px]">
          <h2 className="font-display text-[15px] font-[900] uppercase tracking-[0.1em] border-b border-[#0B0F0D] pb-2">
            Cómo se juega
          </h2>
          <div className="grid grid-cols-1 min-[761px]:grid-cols-3 gap-5 min-[761px]:gap-10 pt-4">
            {RULES.map((rule) => (
              <p key={rule} className="text-[15px] leading-[1.6] text-[#0B0F0D]">
                {rule}
              </p>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col min-[761px]:flex-row items-baseline justify-between gap-3 border-t border-[#0B0F0D] mt-[44px] pt-3">
          <div className="text-[13px] text-[#6B756C]">
            Hecho por hinchas del Top 12. Gratis, sin apuestas y sin publicidad.
          </div>
          <div className="flex gap-[18px]">
            <Link to="/login" className="text-[13px] font-[700]">
              Fixture completo
            </Link>
            <Link to="/login" className="text-[13px] font-[700]">
              Ranking
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
