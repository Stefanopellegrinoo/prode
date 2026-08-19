"use client"

import PropTypes from "prop-types"
import Card from "../ui/Card"

const StatsCard = ({ title, value, icon, description, trend, trendValue, className = "" }) => {
  const getTrendColor = () => {
    if (!trend) return ""
    return trend === "up" ? "text-green-500" : "text-red-500"
  }

  const getTrendIcon = () => {
    if (!trend) return null
    return trend === "up" ? (
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg
        className="h-3 w-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    )
  }

  return (
    <Card className={className}>
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {trend && (
              <p className={`ml-2 flex items-center text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-0.5">{trendValue}</span>
              </p>
            )}
          </div>
          {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
    </Card>
  )
}

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  description: PropTypes.string,
  trend: PropTypes.oneOf(["up", "down", null]),
  trendValue: PropTypes.string,
  className: PropTypes.string,
}

export default StatsCard

