import { User } from "@medusajs/medusa"
import { useAdminUpdateUser } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"

type EditUserModalProps = {
  handleClose: () => void
  user: User
  onSuccess: () => void
}

type EditUserModalFormData = {
  first_name: string
  last_name: string
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  handleClose,
  user,
  onSuccess,
}) => {
  const { mutate, isLoading } = useAdminUpdateUser(user.id)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserModalFormData>()
  const notification = useNotification()

  useEffect(() => {
    reset(mapUser(user))
  }, [user])

  const onSubmit = (data: EditUserModalFormData) => {
    mutate(data, {
      onSuccess: () => {
        notification("Succès", `Utilisateur mis à jour`, "success")
        onSuccess()
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
      onSettled: () => {
        handleClose()
      },
    })
  }

  return (
    <Modal handleClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              Modifier l'utilisateur
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-base grid w-full grid-cols-2 gap-large">
              <InputField
                label="Prénom"
                placeholder="Prénom..."
                required
                {...register("first_name", {
                  required: FormValidator.required("Prénom"),
                  pattern: FormValidator.whiteSpaceRule("Prénom"),
                  minLength: FormValidator.minOneCharRule("Prénom"),
                })}
                errors={errors}
              />
              <InputField
                label="Nom"
                placeholder="Nom..."
                required
                {...register("last_name", {
                  required: FormValidator.required("Nom"),
                  pattern: FormValidator.whiteSpaceRule("Nom"),
                  minLength: FormValidator.minOneCharRule("Nom"),
                })}
                errors={errors}
              />
            </div>
            <InputField label="Courriel" disabled value={user.email} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
              >
                Annuler
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                variant="primary"
                size="small"
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

const mapUser = (user: User): EditUserModalFormData => {
  return {
    first_name: user.first_name,
    last_name: user.last_name,
  }
}

export default EditUserModal
