import {
  AdminPostCustomerGroupsGroupReq,
  AdminPostCustomerGroupsReq,
  CustomerGroup,
} from "@medusajs/medusa"
import React, { useState } from "react"
import { useForm } from "react-hook-form"

import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Metadata, { MetadataField } from "../../../components/organisms/metadata"

type CustomerGroupModalProps = {
  handleClose: () => void
  initialData?: CustomerGroup
  handleSubmit: (
    data: AdminPostCustomerGroupsReq | AdminPostCustomerGroupsGroupReq
  ) => void
}

/*
 * A modal for crating/editing customer groups.
 */
function CustomerGroupModal(props: CustomerGroupModalProps) {
  const { initialData, handleSubmit, handleClose } = props

  const isEdit = !!initialData

  const [metadata, setMetadata] = useState<MetadataField[]>(
    isEdit
      ? Object.keys(initialData.metadata || {}).map((k) => ({
          key: k,
          value: initialData.metadata[k],
        }))
      : []
  )

  const { register, handleSubmit: handleFromSubmit } = useForm({
    defaultValues: initialData,
  })

  const onSubmit = (data) => {
    const meta = {}
    const initial = props.initialData?.metadata || {}

    metadata.forEach((m) => (meta[m.key] = m.value))

    for (const m in initial) {
      if (!(m in meta)) {
        meta[m] = null
      }
    }

    const toSubmit = {
      name: data.name,
      metadata: meta,
    }
    handleSubmit(toSubmit)
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            {props.initialData ? "Modifier" : "Créer un nouveau"} groupe de
            clients
          </span>
        </Modal.Header>

        <Modal.Content>
          <div className="space-y-4">
            <span className="inter-base-semibold">Détails</span>
            <div className="flex space-x-4">
              <Input
                label="Titre"
                {...register("name")}
                placeholder="Nom du groupe de clients"
                required
              />
            </div>
          </div>

          {/* <div className="mt-8"> */}
          {/*   <Metadata metadata={metadata} setMetadata={setMetadata} /> */}
          {/* </div> */}
        </Modal.Content>

        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 justify-center text-small"
              size="large"
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button
              size="medium"
              className="w-32 justify-center text-small"
              variant="primary"
              onClick={handleFromSubmit(onSubmit)}
            >
              <span>{props.initialData ? "Modifier" : "Publier"}</span>
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CustomerGroupModal
