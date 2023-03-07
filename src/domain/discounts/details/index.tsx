import { useAdminDeleteDiscount, useAdminDiscount } from "medusa-react"
import { useState } from "react"
import { useParams } from "react-router-dom"
import Spinner from "../../../components/atoms/spinner"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import RawJSON from "../../../components/organisms/raw-json"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import { DiscountFormProvider } from "../new/discount-form/form/discount-form-context"
import DiscountDetailsConditions from "./conditions"
import Configurations from "./configurations"
import General from "./general"

const Edit = () => {
  const { id } = useParams()

  const { discount, isLoading } = useAdminDiscount(
    id!,
    { expand: "rule,rule.conditions" },
    {
      enabled: !!id,
    }
  )
  const [showDelete, setShowDelete] = useState(false)
  const deleteDiscount = useAdminDeleteDiscount(id!)
  const notification = useNotification()

  const handleDelete = () => {
    deleteDiscount.mutate(undefined, {
      onSuccess: () => {
        notification("Succès", "Rabais supprimé", "success")
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <div className="pb-xlarge">
      {showDelete && (
        <DeletePrompt
          handleClose={() => setShowDelete(!showDelete)}
          onDelete={async () => handleDelete()}
          successText="Rabais supprimé"
          confirmText="Oui, supprimer"
          text="Êtes-vous sûr de vouloir supprimer ce rabais ?"
          heading="Supprimer le rabais"
        />
      )}

      <Breadcrumb
        currentPage="Ajouter un rabais"
        previousBreadcrumb="Rabais"
        previousRoute="/a/discounts"
      />
      {isLoading || !discount ? (
        <div className="flex h-full items-center justify-center">
          <Spinner variant="secondary" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-4">
          <DiscountFormProvider>
            <General discount={discount} />
            <Configurations discount={discount} />
            <DiscountDetailsConditions discount={discount} />
            <RawJSON data={discount} title="Données" rootName="discount" />
          </DiscountFormProvider>
        </div>
      )}
    </div>
  )
}

export default Edit
