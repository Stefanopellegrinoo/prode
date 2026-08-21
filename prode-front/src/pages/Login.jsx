import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layouts/AppLayout";

const Login = ({ initialMode = "login" }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Single component replacing both Login and Register
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  
  // Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [remember, setRemember] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, username, email, password });
      }
    } catch (err) {
      setErrorMsg(err.message || "Ocurrió un error. Verificá los datos.");
    }
  };

  const InputLabel = ({ label, helper }) => (
    <div className="flex flex-col gap-1 mb-2">
      <div className="text-[13px] font-[700] text-prode-text">{label}</div>
      {helper && <div className="text-[13px] text-prode-text-muted">{helper}</div>}
    </div>
  );

  return (
    <AppLayout showBottomNav={false}>
      <div className="flex flex-col min-h-screen justify-center px-5 py-10 bg-prode-bg">
        <div className="flex flex-col gap-8 w-full max-w-[390px] mx-auto">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="w-[44px] h-[44px] bg-prode-text text-prode-bg rounded-[8px] flex items-center justify-center font-display text-[20px] font-[900] pt-[2px]">
              P
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="font-display text-[38px] font-[900] uppercase leading-[1.1] tracking-[-0.02em]">
                Rugby Prode
              </h1>
              <p className="text-[16px] text-prode-text-muted leading-snug">
                Pronosticá la fecha del Top 12 y competí con tu grupo.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {mode === "register" && (
              <>
                <div>
                  <InputLabel label="Nombre completo" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-[56px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[16px] outline-none focus:border-prode-text transition-colors"
                  />
                </div>
                <div>
                  <InputLabel label="Usuario" helper="Como te van a ver en el ranking." />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full h-[56px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[16px] outline-none focus:border-prode-text transition-colors"
                  />
                </div>
              </>
            )}

            <div>
              <InputLabel label="Email" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[56px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[16px] outline-none focus:border-prode-text transition-colors"
              />
            </div>

            <div>
              <InputLabel 
                label="Contraseña" 
                helper={mode === "register" ? "Mínimo 8 caracteres." : undefined}
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[56px] bg-prode-surface border border-prode-border-control rounded-[6px] px-4 text-[16px] outline-none focus:border-prode-text transition-colors"
              />
            </div>

            {mode === "login" && (
              <div className="flex items-center justify-between mt-1">
                <button
                  type="button"
                  onClick={() => setRemember(!remember)}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-[22px] h-[22px] rounded-[4px] border-2 flex items-center justify-center transition-colors ${
                      remember
                        ? "bg-prode-text border-prode-text text-prode-bg"
                        : "border-prode-border-control bg-transparent"
                    }`}
                  >
                    {remember && <span className="font-display font-[900] text-[14px]">✓</span>}
                  </div>
                  <span className="text-[14px] font-[600]">Recordarme</span>
                </button>
                <Link to="/forgot-password" className="text-[14px] font-[600] text-prode-text-muted hover:text-prode-text">
                  Olvidé mi contraseña
                </Link>
              </div>
            )}

            {errorMsg && (
              <div className="bg-prode-error-bg text-prode-error p-3 rounded-[6px] text-[14px] font-[600] border border-prode-error">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-[56px] bg-prode-text text-prode-bg rounded-[6px] text-[16px] font-[800] uppercase tracking-[0.02em] mt-2 hover:opacity-90 transition-opacity"
            >
              {mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          {/* Switcher */}
          <div className="text-center mt-2">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-[15px] font-[600] text-prode-text-muted border-b border-prode-text-muted hover:text-prode-text hover:border-prode-text transition-colors pb-[2px]"
            >
              {mode === "login"
                ? "¿No tenés cuenta? Registrate"
                : "¿Ya tenés cuenta? Iniciá sesión"}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Login;
