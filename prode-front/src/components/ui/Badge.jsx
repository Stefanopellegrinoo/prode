import PropTypes from "prop-types"

const Badge = ({ children, variant = "default", size = "md", className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-full"

  const variantClasses = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    primary: "bg-primary/10 text-primary",
    secondary: "bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    danger: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  }

  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  )
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["default", "primary", "secondary", "success", "danger", "warning", "info"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
}

export default Badge

