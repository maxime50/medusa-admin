import * as React from "react"
import { useAdminDeletePriceList, useAdminUpdatePriceList } from "medusa-react"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import { isActive } from "./utils"
import PublishIcon from "../../fundamentals/icons/publish-icon"

const usePriceListActions = (priceList) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()
  const updatePrice = useAdminUpdatePriceList(priceList?.id)
  const deletePrice = useAdminDeletePriceList(priceList?.id)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Supprimer la liste de prix",
      text: "Êtes-vous sûr de vouloir supprimer cette liste de prix ?",
    })
    if (shouldDelete) {
      deletePrice.mutate(undefined, {
        onSuccess: () => {
          notification(
            "Succès",
            "La liste de prix a été supprimée avec succès",
            "success"
          )
        },
        onError: (err) => notification("Erreur", getErrorMessage(err), "error"),
      })
    }
  }

  const onUpdate = () => {
    updatePrice.mutate(
      {
        status: isActive(priceList) ? "draft" : "active",
      },
      {
        onSuccess: () => {
          notification(
            "Succès",
            `Liste de prix ${
              isActive(priceList) ? "non publié" : "publié"
            } avec succès`,
            "success"
          )
        },
      }
    )
  }

  const getActions = (): ActionType[] => [
    {
      label: isActive(priceList) ? "Dépublier" : "Publier",
      onClick: onUpdate,
      icon: isActive(priceList) ? (
        <UnpublishIcon size={20} />
      ) : (
        <PublishIcon size={20} />
      ),
    },
    {
      label: "Supprimer",
      onClick: onDelete,
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return {
    getActions,
  }
}

export default usePriceListActions
