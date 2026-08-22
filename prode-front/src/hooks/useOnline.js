import { useEffect, useState } from "react"

// navigator.onLine + `online`/`offline` events (ADR-10). No polling, no backend
// ping — just the browser's own connectivity signal.
export const useOnline = () => {
  const [online, setOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true))

  useEffect(() => {
    const setOn = () => setOnline(true)
    const setOff = () => setOnline(false)
    window.addEventListener("online", setOn)
    window.addEventListener("offline", setOff)
    return () => {
      window.removeEventListener("online", setOn)
      window.removeEventListener("offline", setOff)
    }
  }, [])

  return online
}
