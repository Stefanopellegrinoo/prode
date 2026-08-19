"use client"

import PropTypes from "prop-types"
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react"

const Alert = ({ children, variant = "info", title, dismissible = false, onDismiss, className = "" }) => {
  const variantClasses = {
    info: "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    success: "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    warning: "bg-yellow-50 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    error: "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  }

  const variantIcons = {
    info: <Info className="h-5 w-5 text-blue-500 dark:text-blue-400" />,
    success: <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400" />,
  }

  return (
    <div
      className={`rounded-md p-4 ${variantClasses[variant]} ${className}`}
      role="alert"
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <div className="flex">
        <div className="flex-shrink-0">{variantIcons[variant]}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? "mt-2" : ""}`}>{children}</div>
        </div>
        {dismissible && (
          <div className="pl-3">
            <button
              type="button"
              className="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["info", "success", "warning", "error"]),
  title: PropTypes.string,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
}

export default Alert
