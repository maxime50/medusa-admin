import * as React from "react"
import { useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../../components/molecules/modal/focus-modal"
import Accordion from "../../../../components/organisms/accordion"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { DiscountRuleType } from "../../types"
import { useDiscountForm } from "./form/discount-form-context"
import { DiscountFormValues } from "./form/mappers"
import { useFormActions } from "./form/use-form-actions"
import DiscountNewConditions from "./sections/conditions"
import Configuration from "./sections/configuration"
import DiscountAllocation from "./sections/discount-allocation"
import DiscountType from "./sections/discount-type"
import General from "./sections/general"

type DiscountFormProps = {
  closeForm?: () => void
}

const DiscountForm = ({ closeForm }: DiscountFormProps) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const { handleSubmit, handleReset, control } = useDiscountForm()

  const { onSaveAsActive, onSaveAsInactive } = useFormActions()

  const closeFormModal = () => {
    if (closeForm) {
      closeForm()
    } else {
      navigate("/a/discounts")
    }
    handleReset()
  }

  const submitGhost = async (data: DiscountFormValues) => {
    onSaveAsInactive(data)
      .then(() => {
        closeFormModal()
        handleReset()
      })
      .catch((error) => {
        notification("Erreur", getErrorMessage(error), "error")
      })
  }

  const submitCTA = async (data: DiscountFormValues) => {
    try {
      await onSaveAsActive(data)
      closeFormModal()
      handleReset()
    } catch (error) {
      notification("Erreur", getErrorMessage(error), "error")
    }
  }

  const discountType = useWatch({
    control,
    name: "rule.type",
  })

  return (
    <FocusModal>
      <FocusModal.Header>
        <div className="flex w-full justify-between px-8 medium:w-8/12">
          <Button
            size="small"
            variant="ghost"
            onClick={closeForm}
            className="h-8 w-8 rounded-rounded border"
          >
            <CrossIcon size={20} />
          </Button>
          <div className="flex gap-x-small">
            <Button
              onClick={handleSubmit(submitGhost)}
              size="small"
              variant="ghost"
              className="rounded-rounded border"
            >
              Sauvegarder en brouillon
            </Button>
            <Button
              size="small"
              variant="primary"
              onClick={handleSubmit(submitCTA)}
              className="rounded-rounded"
            >
              Publier le rabais
            </Button>
          </div>
        </div>
      </FocusModal.Header>
      <FocusModal.Main>
        <div className="mb-[25%] flex justify-center">
          <div className="w-full max-w-[700px] pt-16">
            <h1 className="inter-xlarge-semibold">Créer un nouveau rabais</h1>
            <Accordion
              className="pt-7 text-grey-90"
              defaultValue={["promotion-type"]}
              type="multiple"
            >
              <Accordion.Item
                forceMountContent
                title="Type de rabais"
                required
                tooltip="Sélectionner un type de rabais"
                value="promotion-type"
              >
                <DiscountType />
                {discountType === DiscountRuleType.FIXED && (
                  <div className="mt-xlarge">
                    <h3 className="inter-base-semibold">
                      Allocation<span className="text-rose-50">*</span>
                    </h3>
                    <DiscountAllocation />
                  </div>
                )}
              </Accordion.Item>
              <Accordion.Item
                title="Général"
                required
                value="general"
                forceMountContent
              >
                <General />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Configuration"
                value="configuration"
                // description="Le code de réduction sera disponible à partir du moment où vous publier ce rabais."
              >
                <Configuration />
              </Accordion.Item>
              <Accordion.Item
                forceMountContent
                title="Conditions"
                // description="Le code de réduction sera disponible à partir du moment où vous publier ce rabais."
                value="conditions"
                tooltip="Ajouter des conditions au rabais"
              >
                <DiscountNewConditions />
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default DiscountForm
