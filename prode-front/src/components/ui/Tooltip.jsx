import { useState, useRef, useEffect } from "react"
import PropTypes from "prop-types"

const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 300,
  className = "",
  contentClassName = "",
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef(null)
  const targetRef = useRef(null)
  const timerRef = useRef(null)

  const showTooltip = () => {
    timerRef.current = setTimeout(() => {
      if (targetRef.current) {
        const rect = targetRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current?.getBoundingClientRect() || { width: 0, height: 0 }
        
        let x = 0
        let y = 0
        
        switch (position) {
          case "top":
            x = rect.left + rect.width / 2 - tooltipRect.width / 2
            y = rect.top - tooltipRect.height - 8
            break
          case "bottom":
            x = rect.left + rect.width / 2 - tooltipRect.width / 2
            y = rect.bottom + 8
            break
          case "left":
            x = rect.left - tooltipRect.width - 8
            y = rect.top + rect.height / 2 - tooltipRect.height / 2
            break
          case "right":
            x = rect.right + 8
            y = rect.top + rect.height / 2 - tooltipRect.height / 2
            break
        }
        
        // Adjust if tooltip goes outside viewport
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        
        if (x < 10) x = 10
        if (x + tooltipRect.width > viewportWidth - 10) x = viewportWidth - tooltipRect.width - 10
        if (y < 10) y = 10
        if (y + tooltipRect.height > viewportHeight - 10) y = viewportHeight - tooltipRect.height - 10
        
        setCoords({ x, y })
        setIsVisible(true)
      }
    }, delay)
  }

  const hideTooltip = () => {
    clearTimeout(timerRef.current)
    setIsVisible(false)
  }

  useEffect(() => {
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])

  const positionClasses = {
    top: "transform -translate-y-1 opacity-0 transition-all duration-200",
    bottom: "transform translate-y-1 opacity-0 transition-all duration-200",
    left: "transform -translate-x-1 opacity-0 transition-all duration-200",
    right: "transform translate-x-1 opacity-0 transition-all duration-200",
  }

  const visibleClasses = {
    top: "transform translate-y-0 opacity-100",
    bottom: "transform translate-y-0 opacity-100",
    left: "transform translate-x-0 opacity-100",
    right: "transform translate-x-0 opacity-100",
  }

  return (
    <div className={`inline-block relative ${className}`}>
      <div
        ref={targetRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm dark:bg-gray-700 ${
            positionClasses[position]
          } ${isVisible ? visibleClasses[position] : ""} ${contentClassName}`}
          style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
        >
          {content}
        </div>
      )}
    </div>
  )
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  delay: PropTypes.number,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
}

export default Tooltip

