// Format date to readable string
export const formatDate = (dateString) => {

  const fechaOriginal = new Date(dateString);
  const fechaCorrecta = new Date(
    fechaOriginal.getTime() + fechaOriginal.getTimezoneOffset() * 300000
  );


    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(fechaCorrecta)
  }
  
  // Format date to short format (DD/MM)
  export const formatShortDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
    }).format(date)
  }
  
  // Get relative time (today, yesterday, tomorrow, or date)
  export const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
  
    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana"
    } else {
      return formatShortDate(dateString)
    }
  }
  