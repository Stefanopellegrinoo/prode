export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }

// "Martín Benítez" -> "MB", "Martín" -> "MA". Taking the first two characters of
// the full name gives "MA" for both, which is wrong for anyone with a surname.
export function getInitials(name, fallback = "??") {
  const words = (name || "").trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return fallback
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase()
  return (words[0][0] + words[1][0]).toUpperCase()
}
