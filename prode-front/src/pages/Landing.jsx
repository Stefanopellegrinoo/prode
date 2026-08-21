import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#EDEFEA] text-[#0B0F0D] font-body">
      {/* Cabecera hairline */}
      <div className="border-b border-[#0B0F0D]">
        <div className="max-w-[1040px] mx-auto px-4 py-2 flex justify-between items-center text-[13px]">
          <div className="font-[600] text-[#4A544B]">
            Buenos Aires, sábado 22 de agosto de 2026
          </div>
          <div className="flex gap-4 font-[800]">
            <span className="hidden sm:inline">URBA Top 12 — Fecha 12</span>
            <Link to="/login" className="border-b-2 border-[#0B0F0D] pb-[1px] hover:opacity-70 transition-opacity">
              Entrar
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1040px] mx-auto px-4 flex flex-col pt-6 pb-20">
        {/* Masthead */}
        <div className="flex flex-col">
          <h1 
            className="font-display font-[900] leading-[0.85] tracking-[-0.04em] uppercase -ml-[6px]"
            style={{ fontSize: "clamp(90px, 17vw, 210px)" }}
          >
            Prode
          </h1>
          <div className="border-y border-[#C9D1C8] py-4 mt-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <p className="text-[17px] leading-[1.4] max-w-[560px]">
              El juego de pronósticos del rugby de Buenos Aires. Abajo está la fecha de Primera: marcá tus ganadores ahora, sin cuenta ni vueltas.
            </p>
            <div className="font-[800] uppercase tracking-[0.05em] text-[14px]">
              Cierre: sábado 09:00
            </div>
          </div>
        </div>

        {/* Hero Funcional: Fixture Primera */}
        <div className="mt-8 flex flex-col md:flex-row gap-8 md:gap-16">
          {/* Main Column */}
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-[15px] font-[900] uppercase tracking-[0.1em]">
                Primera · Sáb 22
              </h2>
              <div className="text-[14px] font-[700]">6 partidos</div>
            </div>

            <div className="flex flex-col border-t border-[#C9D1C8]">
              {[
                { time: "15:30", match: "CASI vs SIC", ground: "La Catedral" },
                { time: "15:30", match: "Hindú vs CUBA", ground: "Don Bosco" },
                { time: "15:30", match: "Newman vs Alumni", ground: "Benavídez" },
                { time: "16:00", match: "Belgrano vs Regatas", ground: "Virrey del Pino" },
                { time: "16:00", match: "Pucará vs San Luis", ground: "Burzaco" },
                { time: "16:30", match: "Rosario vs Tala", ground: "Las Delicias" },
              ].map((row, idx) => (
                <div key={idx} className="flex flex-col sm:grid sm:grid-cols-[64px_1fr_236px] gap-2 sm:gap-4 py-4 border-b border-[#C9D1C8] items-start sm:items-center">
                  <div className="font-display font-[800] tabular-nums text-[16px]">
                    {row.time}
                  </div>
                  <div className="flex flex-col">
                    <div className="font-display text-[19px] font-[800] uppercase">{row.match}</div>
                    <div className="text-[14px] text-[#4A544B]">{row.ground}</div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                    {["L", "E", "V"].map((btn) => (
                      <button
                        key={btn}
                        className="flex-1 sm:w-[72px] h-[48px] border border-[#A8B1A7] rounded-[4px] font-display font-[900] text-[18px] hover:bg-[#E4E7E1] transition-colors"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Fila */}
            <div className="mt-6 border-t border-[#0B0F0D] pt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="text-[16px] font-[600] max-w-[400px]">
                Intermedia, Pre A, Pre B y Pre C se pronostican adentro, con los mismos cruces.
              </div>
              <Link
                to="/login"
                className="h-[56px] px-8 border border-[#0B0F0D] rounded-[4px] flex items-center justify-center font-[800] text-[16px] uppercase tracking-[0.02em] hover:bg-[#0B0F0D] hover:text-[#EDEFEA] transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          {/* Sidebar / Reglas */}
          <div className="w-full md:w-[320px] flex flex-col gap-6">
            <div className="border-t border-[#0B0F0D] pt-4 font-display font-[900] text-[18px] uppercase">
              Cómo se juega
            </div>
            <div className="flex flex-col gap-4 text-[15px] leading-[1.6]">
              <p>
                <strong>17 partidos por fecha.</strong> Se pronostican las 5 categorías juntas: Primera, Intermedia, Pre A, Pre B y Pre C.
              </p>
              <p>
                <strong>Puntaje simple.</strong> Acertar al ganador da 3 puntos. Si pronosticás empate y aciertas, te llevás 5 puntos. Nada de adivinar el tanteador.
              </p>
              <p>
                <strong>Todo queda guardado.</strong> Jugá solo por el ranking general o armá un grupo cerrado con código de invitación. El último de la tabla paga el asado.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#0B0F0D] bg-[#E4E7E1]">
        <div className="max-w-[1040px] mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[14px]">
          <div className="font-[600] text-[#4A544B]">
            Hecho por hinchas del Top 12. Gratis, sin apuestas y sin publicidad.
          </div>
          <div className="flex gap-6 font-[700] uppercase tracking-[0.05em]">
            <Link to="/login" className="hover:opacity-70 transition-opacity">Ranking General</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
