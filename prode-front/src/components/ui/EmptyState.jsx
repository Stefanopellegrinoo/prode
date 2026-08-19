import PropTypes from "prop-types"

const EmptyState = ({ icon, title, description, action, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 ${className}`}>
      {icon && <div className="text-gray-400 dark:text-gray-600 mb-4">{icon}</div>}
      {title && <h3 className="text-lg font-medium mb-2">{title}</h3>}
      {description && <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
}

export default EmptyState
