import { useAdminResendNotification } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Input from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type ResendModalProps = {
  notificationId: string
  email: string
  handleCancel: () => void
}

const ResendModal: React.FC<ResendModalProps> = ({
  notificationId,
  email,
  handleCancel,
}) => {
  const { mutate, isLoading } = useAdminResendNotification(notificationId)

  const { register, handleSubmit } = useForm({
    defaultValues: { to: email },
  })

  const notification = useNotification()

  const handleResend = (data) => {
    mutate(
      {
        to: data.to.trim(),
      },
      {
        onSuccess: () => {
          notification(
            "Succès",
            `Notification renvoyée à ${data.to}`,
            "success"
          )
          handleCancel()
        },
        onError: (err) => notification("Erreur", getErrorMessage(err), "error"),
      }
    )
  }

  return (
    <Modal handleClose={handleCancel}>
      <form onSubmit={handleSubmit(handleResend)}>
        <Modal.Body>
          <Modal.Header handleClose={handleCancel}>
            <span className="inter-xlarge-semibold">
              Renvoyer la notification
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="flex flex-col">
              <div className="flex flex-col space-y-2">
                <Input
                  label={"Courriel"}
                  type="text"
                  placeholder={"Courriel"}
                  {...register(`to`, {
                    required: "Doit être rempli",
                  })}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <div className="flex">
                <Button
                  variant="ghost"
                  className="mr-2 w-32 justify-center text-small"
                  size="large"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
                <Button
                  size="large"
                  className="w-32 justify-center text-small"
                  variant="primary"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                >
                  Envoyer
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default ResendModal
