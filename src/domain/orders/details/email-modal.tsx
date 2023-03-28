import { useAdminUpdateOrder } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"

import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

type EmailModalProps = {
  handleClose: () => void
  email?: string
  orderId: string
}

type EmailModalFormData = {
  email: string
}

const EmailModal: React.FC<EmailModalProps> = ({
  orderId,
  email,
  handleClose,
}) => {
  const { mutate: updateEmail, isLoading } = useAdminUpdateOrder(orderId)
  const { register, handleSubmit } = useForm<EmailModalFormData>({
    defaultValues: { email },
  })
  const notification = useNotification()

  const handleUpdateEmail = (data: EmailModalFormData) => {
    const updateObj = { email: data.email }

    return updateEmail(updateObj, {
      onSuccess: () => {
        notification(
          "Succès",
          "Adresse courriel mis à jour avec succès",
          "success"
        )
        handleClose()
      },
      onError: (err) => notification("Erreur", getErrorMessage(err), "error"),
    })
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form onSubmit={handleSubmit(handleUpdateEmail)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">Adresse courriel</span>
          </Modal.Header>
          <Modal.Content>
            <div className="space-y-4">
              <div className="flex mt-4 space-x-4">
                <Input
                  label="Courriel"
                  {...register("email")}
                  placeholder="Courriel"
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <Button
                variant="ghost"
                className="mr-2 w-32 text-small justify-center"
                size="large"
                type="button"
                onClick={handleClose}
              >
                Annuler
              </Button>
              <Button
                size="large"
                className="w-32 text-small justify-center"
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
                type="submit"
              >
                Sauvegarder
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default EmailModal
