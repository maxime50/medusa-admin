import { ShippingOption } from "@medusajs/medusa"
import { useAdminUpdateShippingOption } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../shipping-option-form"
import { useShippingOptionFormData } from "../shipping-option-form/use-shipping-option-form-data"

type Props = {
  open: boolean
  onClose: () => void
  option: ShippingOption
}

const EditModal = ({ open, onClose, option }: Props) => {
  const form = useForm<ShippingOptionFormType>({
    defaultValues: getDefaultValues(option),
  })
  const { mutate, isLoading } = useAdminUpdateShippingOption(option.id)
  const { getRequirementsData } = useShippingOptionFormData(option.region_id)
  const notification = useNotification()

  const {
    reset,
    handleSubmit,
    formState: { isDirty },
  } = form

  useEffect(() => {
    reset(getDefaultValues(option))
  }, [option])

  const closeAndReset = () => {
    reset(getDefaultValues(option))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        name: data.name!,
        // @ts-ignore
        requirements: getRequirementsData(data),
        admin_only: !data.store_option,
        amount: data.amount!,
      },
      {
        onSuccess: () => {
          notification("Succès", "Option de livraison mise à jour", "success")
          closeAndReset()
        },
        onError: (error) => {
          notification("Erreur", getErrorMessage(error), "error")
        },
      }
    )
  })

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}>
          <h1 className="inter-xlarge-semibold">
            Modifier l'option de livraison
          </h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            {/* <div> */}
            {/*   <p className="inter-base-semibold">Méthode de traitement</p> */}
            {/*   <p className="inter-base-regular text-grey-50"> */}
            {/*     {option.data.id} via {option.provider_id} */}
            {/*   </p> */}
            {/* </div> */}
            <div className="my-xlarge h-px w-full bg-grey-20" />
            <ShippingOptionForm
              form={form}
              region={option.region}
              isEdit={true}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button variant="secondary" size="small" onClick={closeAndReset}>
                Annuler
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={isLoading}
                disabled={isLoading || !isDirty}
              >
                Sauvegarder
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (option: ShippingOption): ShippingOptionFormType => {
  const minSubtotal = option.requirements.find((r) => r.type === "min_subtotal")
  const maxSubtotal = option.requirements.find((r) => r.type === "max_subtotal")

  return {
    store_option: option.admin_only ? false : true,
    name: option.name,
    price_type: {
      label:
        option.price_type === "flat_rate" ? "Flat rate" : "Calculated Price",
      value: option.price_type,
    },
    fulfillment_provider: null,
    shipping_profile: null,
    requirements: {
      min_subtotal: minSubtotal
        ? {
            amount: minSubtotal.amount,
            id: minSubtotal.id,
          }
        : null,
      max_subtotal: maxSubtotal
        ? {
            amount: maxSubtotal.amount,
            id: maxSubtotal.id,
          }
        : null,
    },
    amount: option.amount,
  }
}

export default EditModal
