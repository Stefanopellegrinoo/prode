import { useEffect, useState } from "react"

// Ticks `Date.now()` on an interval so countdown UI (the "cierreCerca" banner)
// re-renders without a page refresh. Minute-grain by default — matches
// formatCountdown's own precision (utils/fixture.js), no point ticking faster.
export const useNow = (intervalMs = 60000) => {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
