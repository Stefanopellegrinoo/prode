// API URL - Change this to your actual API endpoint
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

// App constants
export const APP_NAME = "Rugby Prode"

// Match status constants
export const MATCH_STATUS = {
  UPCOMING: "upcoming",
  LIVE: "live",
  FINISHED: "finished",
}

// Prediction points
export const POINTS = {
  EXACT_SCORE: 5, // Exact score prediction
  WINNER_ONLY: 3, // Correct winner but wrong score
  DRAW: 2, // Correctly predicted a draw
}
