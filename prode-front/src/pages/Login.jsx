import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layouts/AppLayout";

// Only email has a persona-language copy in the handoff (Alertas.dc.html 4D).
// Empty-field and length rules have no verbatim copy — kept short, human,
// no jargon, consistent with that tone (README: "Nunca solo color").
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

// Backend already returns persona-language messages (auth.service.js) —
// map them to the field they describe instead of dumping them in a
// page-level banner.
const BACKEND_FIELD_ERRORS = {
  "Mail no registrado.": "email",
  "El mail ya esta registrado.": "email",
  "El nombre de usuario ya existe.": "username",
  "Contraseña incorrecta.": "password",
};

const Login = ({ initialMode = "login" }) => {
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
  const [fieldErrors, setFieldErrors] = useState({});

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrorMsg("");
    setFieldErrors({});
  };

  const validate = () => {
    const errors = {};
    if (mode === "register") {
      if (!name.trim()) errors.name = "Completá tu nombre.";
      if (!username.trim()) errors.username = "Elegí un nombre de usuario.";
    }
    if (!email.trim()) {
      errors.email = "Escribí tu email.";
    } else if (!EMAIL_RE.test(email.trim())) {
      errors.email = "Le falta el final al email (.com, .com.ar…).";
    }
    if (!password) {
      errors.password = "Escribí tu contraseña.";
    } else if (mode === "register" && password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `La contraseña necesita al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register({ name, username, email, password });
      }
    } catch (err) {
      // Zod validation errors (server-side) come as { message, errors: [{path,message}] }
      const zodIssues = err.response?.data?.errors;
      if (Array.isArray(zodIssues) && zodIssues.length > 0) {
        const mapped = {};
        zodIssues.forEach((issue) => {
          const field = issue.path?.[0];
          if (field) mapped[field] = issue.message;
        });
        if (Object.keys(mapped).length > 0) {
          setFieldErrors(mapped);
          return;
        }
      }
      const backendMessage = err.response?.data?.message;
      const targetField = BACKEND_FIELD_ERRORS[backendMessage];
      if (targetField) {
        setFieldErrors({ [targetField]: backendMessage });
      } else {
        setErrorMsg(backendMessage || "Ocurrió un error. Revisá los datos e intentá de nuevo.");
      }
    }
  };

  const clearFieldError = (key) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const InputLabel = ({ label, helper }) => (
    <div className="flex flex-col gap-1 mb-2">
      <div className="text-[13px] font-[700] text-prode-text">{label}</div>
      {helper && <div className="text-[13px] text-prode-text-muted">{helper}</div>}
    </div>
  );

  const inputClass = (hasError) =>
    `w-full h-[56px] bg-prode-surface rounded-[6px] px-4 text-[16px] outline-none transition-colors ${
      hasError
        ? "border-2 border-prode-error"
        : "border border-prode-border-control focus:border-prode-text"
    }`;

  const FieldError = ({ message }) =>
    message ? (
      <div className="mt-[6px] text-[13px] font-[600] text-prode-error">{message}</div>
    ) : null;

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
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearFieldError("name");
                    }}
                    aria-invalid={Boolean(fieldErrors.name)}
                    className={inputClass(Boolean(fieldErrors.name))}
                  />
                  <FieldError message={fieldErrors.name} />
                </div>
                <div>
                  <InputLabel label="Usuario" helper="Como te van a ver en el ranking." />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearFieldError("username");
                    }}
                    aria-invalid={Boolean(fieldErrors.username)}
                    className={inputClass(Boolean(fieldErrors.username))}
                  />
                  <FieldError message={fieldErrors.username} />
                </div>
              </>
            )}

            <div>
              <InputLabel label="Email" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError("email");
                }}
                aria-invalid={Boolean(fieldErrors.email)}
                className={inputClass(Boolean(fieldErrors.email))}
              />
              <FieldError message={fieldErrors.email} />
            </div>

            <div>
              <InputLabel
                label="Contraseña"
                helper={mode === "register" ? "Mínimo 8 caracteres." : undefined}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                className={inputClass(Boolean(fieldErrors.password))}
              />
              <FieldError message={fieldErrors.password} />
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
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
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
