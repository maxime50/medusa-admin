import { ReturnReason } from "@medusajs/medusa"
import { useAdminCreateReturnReason } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import TextArea from "../../../components/molecules/textarea"
import useNotification from "../../../hooks/use-notification"
import FormValidator from "../../../utils/form-validator"

type CreateReturnReasonModalProps = {
  handleClose: () => void
  initialReason?: ReturnReason
}

type CreateReturnReasonFormData = {
  value: string
  label: string
  description: string | null
}

// the reason props is used for prefilling the form when duplicating
const CreateReturnReasonModal = ({
  handleClose,
  initialReason,
}: CreateReturnReasonModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateReturnReasonFormData>({
    defaultValues: {
      value: initialReason?.value,
      label: initialReason?.label,
      description: initialReason?.description,
    },
  })
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateReturnReason()

  const onCreate = (data: CreateReturnReasonFormData) => {
    mutate(
      {
        ...data,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          notification(
            "Succès",
            "Raison de retour créée avec succès",
            "success"
          )
        },
        onError: () => {
          notification(
            "Error",
            "Impossible de créer un motif de retour avec un code existant",
            "error"
          )
        },
      }
    )
    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Ajouter une raison</span>
        </Modal.Header>
        <form onSubmit={handleSubmit(onCreate)}>
          <Modal.Content>
            <div className="mb-large grid grid-cols-2 gap-large">
              <Input
                {...register("value", {
                  required: "Valeur requise",
                  pattern: FormValidator.whiteSpaceRule("Valeur"),
                  minLength: FormValidator.minOneCharRule("Valeur"),
                })}
                label="Valeur"
                required
                placeholder="mauvaise_grandeur"
                errors={errors}
              />
              <Input
                {...register("label", {
                  required: "Titre requis",
                  pattern: FormValidator.whiteSpaceRule("Titre"),
                  minLength: FormValidator.minOneCharRule("Titre"),
                })}
                label="Titre"
                required
                placeholder="Mauvaise grandeur"
                errors={errors}
              />
            </div>
            <TextArea
              className="mt-large"
              rows={3}
              {...register("description")}
              label="Description"
              placeholder="Le client a reçu la mauvaise grandeur"
              errors={errors}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex h-8 w-full justify-end">
              <Button
                variant="ghost"
                className="mr-2 w-32 justify-center text-small"
                size="large"
                onClick={handleClose}
                type="button"
              >
                Annuler
              </Button>
              <Button
                loading={isLoading}
                disabled={isLoading}
                size="large"
                className="w-32 justify-center text-small"
                variant="primary"
              >
                Créer
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnReasonModal
