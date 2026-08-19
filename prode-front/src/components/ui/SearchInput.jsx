import { Search } from "lucide-react"
import PropTypes from "prop-types"

const SearchInput = ({ value, onChange, placeholder = "Buscar...", className = "" }) => {
  return (
    <div className={`relative w-full sm:w-64 ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 w-full border rounded-md dark:bg-gray-800 dark:border-gray-700"
      />
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
    </div>
  )
}

SearchInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string,
}

export default SearchInput
