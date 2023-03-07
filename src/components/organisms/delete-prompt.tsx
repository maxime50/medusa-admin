import React, { useState } from "react"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import Button from "../fundamentals/button"
import Modal from "../molecules/modal"

type DeletePromptProps = {
  heading?: string
  text?: string
  successText?: string
  cancelText?: string
  confirmText?: string
  handleClose: () => void
  onDelete: () => Promise<unknown>
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  heading = "Êtes-vous sûr de vouloir supprimer ?",
  text = "",
  successText = "Suppression réussie",
  cancelText = "Non, annuler",
  confirmText = "Oui, supprimer",
  handleClose,
  onDelete,
}) => {
  const notification = useNotification()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onDelete()
      .then(() => notification("Succès", successText, "success"))
      .catch((err) => notification("Erreur", getErrorMessage(err), "error"))
      .finally(() => {
        setIsLoading(false)
        handleClose()
      })
  }

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular mt-1 text-grey-50">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-24 justify-center text-small"
              size="small"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="w-24 justify-center text-small"
              variant="nuclear"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DeletePrompt
