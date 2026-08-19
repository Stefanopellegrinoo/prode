import PropTypes from "prop-types"
import { X } from "lucide-react"
import Button from "./Button"

const ConfirmDialog = ({ title, message, confirmLabel, cancelLabel, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-gray-600 dark:text-gray-400">{message}</p>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel || "Cancelar"}
            </Button>
            <Button type="button" variant="danger" onClick={onConfirm}>
              {confirmLabel || "Confirmar"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

ConfirmDialog.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default ConfirmDialog
