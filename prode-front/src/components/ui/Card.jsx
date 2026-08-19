import PropTypes from "prop-types"

const Card = ({ children, title, icon, action, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg shadow overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 border-b dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center">
            {icon && <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>}
            <h3 className="text-lg font-medium">{title}</h3>
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  icon: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
}

export default Card
