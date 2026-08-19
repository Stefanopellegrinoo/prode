import "./LoadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="lc">
      <div className="spinner"></div>
      <p>Cargando...</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
