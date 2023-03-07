import { useAdminUpdateSalesChannel } from "medusa-react"
import React, { useState } from "react"

import { SalesChannel } from "@medusajs/medusa"

import Button from "../../../components/fundamentals/button"
import InputField from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"

type EditSalesChannelProps = {
  salesChannel: SalesChannel
  handleClose: () => void
}

/**
 * Modal with sales channels edit form.
 */
function EditSalesChannel(props: EditSalesChannelProps) {
  const { handleClose, salesChannel } = props

  const notification = useNotification()

  const { mutate: updateSalesChannel, isLoading } = useAdminUpdateSalesChannel(
    salesChannel.id
  )

  const [name, setName] = useState(salesChannel.name)
  const [description, setDescription] = useState(salesChannel.description)

  const handleSubmit = () => {
    updateSalesChannel(
      { name, description },
      {
        onSuccess: () => {
          notification(
            "Succès",
            "Canal de vente mis à jour avec succès",
            "success"
          )
          handleClose()
        },
        onError: () =>
          notification(
            "Erreur",
            "Échec de la mise à jour du canal de vente",
            "error"
          ),
      }
    )
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            Détails du canal de vente
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="inter-base-semibold mb-4 text-grey-90">
            Info général
          </div>

          <div className="flex w-full flex-col gap-3">
            <InputField
              label="Nom"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <InputField
              label="Description"
              name="description"
              value={description!}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Fermer
            </Button>
            <Button
              disabled={!name.length || isLoading}
              variant="primary"
              className="min-w-[100px]"
              size="small"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Sauvegarder
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditSalesChannel
