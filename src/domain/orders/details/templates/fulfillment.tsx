import { capitalize } from "lodash"
import {
  useAdminCancelClaimFulfillment,
  useAdminCancelFulfillment,
  useAdminCancelSwapFulfillment,
} from "medusa-react"
import React from "react"
import CancelIcon from "../../../../components/fundamentals/icons/cancel-icon"
import PackageIcon from "../../../../components/fundamentals/icons/package-icon"
import Actionables from "../../../../components/molecules/actionables"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { TrackingLink } from "./tracking-link"

export const FormattedFulfillment = ({
  setFullfilmentToShip,
  order,
  fulfillmentObj,
}) => {
  const dialog = useImperativeDialog()
  const notification = useNotification()

  const cancelFulfillment = useAdminCancelFulfillment(order.id)
  const cancelSwapFulfillment = useAdminCancelSwapFulfillment(order.id)
  const cancelClaimFulfillment = useAdminCancelClaimFulfillment(order.id)

  const { fulfillment } = fulfillmentObj
  const hasLinks = !!fulfillment.tracking_links?.length

  const getData = () => {
    switch (true) {
      case !!fulfillment?.claim_order_id:
        return {
          resourceId: fulfillment.claim_order_id,
          resourceType: "claim",
        }
      case !!fulfillment?.swap_id:
        return {
          resourceId: fulfillment.swap_id,
          resourceType: "swap",
        }
      default:
        return { resourceId: order?.id, resourceType: "order" }
    }
  }

  const handleCancelFulfillment = async () => {
    const { resourceId, resourceType } = getData()

    const shouldCancel = await dialog({
      heading: "Annuler le traitement de la commande ?",
      text: "Êtes-vous sûr de vouloir annuler le traitement de la commande ?",
    })

    if (!shouldCancel) {
      return
    }

    switch (resourceType) {
      case "swap":
        return cancelSwapFulfillment.mutate(
          { swap_id: resourceId, fulfillment_id: fulfillment.id },
          {
            onSuccess: () =>
              notification("Succès", "Échange annulé avec succès", "success"),
            onError: (err) =>
              notification("Erreur", getErrorMessage(err), "error"),
          }
        )
      case "claim":
        return cancelClaimFulfillment.mutate(
          { claim_id: resourceId, fulfillment_id: fulfillment.id },
          {
            onSuccess: () =>
              notification(
                "Succès",
                "Réclamation annulée avec succès",
                "success"
              ),
            onError: (err) =>
              notification("Erreur", getErrorMessage(err), "error"),
          }
        )
      default:
        return cancelFulfillment.mutate(fulfillment.id, {
          onSuccess: () =>
            notification("Succès", "Commande annulée avec succès", "success"),
          onError: (err) =>
            notification("Erreur", getErrorMessage(err), "error"),
        })
    }
  }

  return (
    <div className="flex w-full justify-between">
      <div className="flex flex-col space-y-1 py-2">
        <div className="text-grey-90">
          {fulfillment.canceled_at
            ? "Le traitement de la commande a été annulé"
            : `${fulfillmentObj.title} traité par ${capitalize(
                fulfillment.provider_id
              )}`}
        </div>
        <div className="flex text-grey-50">
          {!fulfillment.shipped_at ? "Non livré" : "Numéro de suivi"}
          {hasLinks &&
            fulfillment.tracking_links.map((tl, j) => (
              <TrackingLink key={j} trackingLink={tl} />
            ))}
        </div>
      </div>
      {!fulfillment.canceled_at && !fulfillment.shipped_at && (
        <div className="flex items-center space-x-2">
          <Actionables
            actions={[
              {
                label: "Marquer comme expédiée",
                icon: <PackageIcon size={"20"} />,
                onClick: () => setFullfilmentToShip(fulfillment),
              },
              {
                label: "Annuler le traitement de la commande",
                icon: <CancelIcon size={"20"} />,
                onClick: () => handleCancelFulfillment(),
              },
            ]}
          />
        </div>
      )}
    </div>
  )
}
