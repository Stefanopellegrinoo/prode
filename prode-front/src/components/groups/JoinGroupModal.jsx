import { useState } from "react"
import PropTypes from "prop-types"
import { X } from 'lucide-react'
import Button from "../ui/Button"
import InputField from "../form/InputField"
import { joinGroup } from "../../services/groupService"

const JoinGroupModal = ({ onClose, onGroupJoined }) => {
  const [inviteCode, setInviteCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!inviteCode.trim()) {
      setError("El código de invitación es requerido")
      return
    }

    try {
      setLoading(true)
      const joinedGroup = await joinGroup(inviteCode)
      onGroupJoined(joinedGroup)
    } catch (error) {
      console.error("Error joining group:", error)
      setError(error.message || "Código de invitación inválido")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-medium">Unirse a un Grupo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ingresa el código de invitación que recibiste para unirte a un grupo.
            </p>

            <InputField
              label="Código de Invitación"
              name="inviteCode"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value)
                setError("")
              }}
              error={error}
              placeholder="Ej: ABC123"
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Unirse
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

JoinGroupModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onGroupJoined: PropTypes.func.isRequired,
}

export default JoinGroupModal
