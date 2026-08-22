// API URL - Change this to your actual API endpoint
export const API_URL = import.meta.env.VITE_API_URL || "/api"

// App constants
export const APP_NAME = "Rugby Prode"

// Match status constants
export const MATCH_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  FINISHED: "finished",
}

// Prediction points (display only — backend computes the real score)
export const POINTS = {
  WIN: 3, // Correct winner prediction
  DRAW: 5, // Correctly predicted a draw
  MISS: 0, // Wrong or missing prediction
}

// "cierreCerca" banner threshold: shows once the first match of the current
// fecha kicks off within this window. Neither spec nor design fixed a number
// (F5.3) — 3h chosen as a reasonable "still time to act" window.
// ponytail: single global value, not configurable per tournament — move to
// tournament config if a torneo ever needs a different lead time.
export const UMBRAL_CIERRE_MS = 3 * 60 * 60 * 1000
