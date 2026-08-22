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
