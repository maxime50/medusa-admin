import {
  useAdminCancelClaim,
  useAdminCancelReturn,
  useAdminOrder,
} from "medusa-react"
import { Fragment } from "react"
import CreateFulfillmentModal from "../../../../domain/orders/details/create-fulfillment"
import { ReceiveReturnMenu } from "../../../../domain/orders/details/receive-return"
import { orderReturnableFields } from "../../../../domain/orders/details/utils/order-returnable-fields"
import useOrdersExpandParam from "../../../../domain/orders/details/utils/use-admin-expand-paramter"
import { ClaimEvent } from "../../../../hooks/use-build-timeline"
import useNotification from "../../../../hooks/use-notification"
import useToggleState from "../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../utils/error-messages"
import Button from "../../../fundamentals/button"
import AlertIcon from "../../../fundamentals/icons/alert-icon"
import CancelIcon from "../../../fundamentals/icons/cancel-icon"
import TrashIcon from "../../../fundamentals/icons/trash-icon"
import { ActionType } from "../../actionables"
import {
  FulfillmentStatus,
  RefundStatus,
  ReturnStatus,
} from "../../order-status"
import EventActionables from "../event-actionables"
import EventContainer, {
  EventContainerProps,
  EventIconColor,
} from "../event-container"
import EventItemContainer from "../event-item-container"

type Props = {
  event: ClaimEvent
}

const Claim = ({ event }: Props) => {
  const {
    state: stateReceiveMenu,
    open: openReceiveMenu,
    close: closeReceiveMenu,
  } = useToggleState()

  const {
    state: stateFulfillMenu,
    open: openFulfillMenu,
    close: closeFulfillMenu,
  } = useToggleState()

  const { orderRelations } = useOrdersExpandParam()
  // Orders and returns aren't linked in `medusa-react` so we need to manually refetch the order
  const { refetch } = useAdminOrder(event.orderId, {
    fields: orderReturnableFields,
    expand: orderRelations,
  })

  const notification = useNotification()

  const shouldHaveButtonActions =
    !event.canceledAt &&
    (event.claim?.return_order || event.claim?.additional_items?.length > 0)

  const { mutate: cancelReturn } = useAdminCancelReturn(
    event.claim?.return_order?.id
  )

  const { mutate: cancelClaim } = useAdminCancelClaim(event.order?.id)

  const onCancelClaim = () => {
    cancelClaim(event.claim.id, {
      onSuccess: () => {
        notification(
          "Réclamation annulée",
          "La réclamation a été annulée",
          "success"
        )
      },
      onError: (err) => {
        notification(
          "Impossible d'annuler la réclamation",
          getErrorMessage(err),
          "error"
        )
      },
    })
  }

  const onCancelReturn = () => {
    cancelReturn(undefined, {
      onSuccess: () => {
        notification("Retour annulé", "Le retour a été annulé", "success")
        refetch()
      },
      onError: (err) => {
        notification(
          "Impossible d'annuler le retour",
          getErrorMessage(err),
          "error"
        )
      },
    })
  }

  const Actions = renderClaimActions(event, onCancelClaim, onCancelReturn)

  const eventContainerArgs: EventContainerProps = {
    icon: event.canceledAt ? <CancelIcon size={20} /> : <AlertIcon size={20} />,
    iconColor: event.canceledAt
      ? EventIconColor.DEFAULT
      : EventIconColor.ORANGE,
    title: event.canceledAt ? "Réclamation annulée" : "Réclamation créée",
    time: event.canceledAt ? event.canceledAt : event.time,
    topNode: Actions,
    children: [
      <Fragment key={event.id}>
        <div className="flex flex-col gap-y-base">
          <ClaimStatus event={event} />
          {renderClaimItems(event)}
          {event.claim?.additional_items?.length > 0 &&
            renderReplacementItems(event)}
          {shouldHaveButtonActions && (
            <div className="flex items-center gap-x-xsmall">
              {event.claim.return_order?.status === "requested" && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={openReceiveMenu}
                >
                  Recevoir le retour
                </Button>
              )}
              {event.claim?.additional_items?.length > 0 &&
                event.claim?.fulfillment_status === "not_fulfilled" && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={openFulfillMenu}
                  >
                    Compléter le remplacement
                  </Button>
                )}
            </div>
          )}
        </div>
        {stateReceiveMenu && (
          <ReceiveReturnMenu
            onClose={closeReceiveMenu}
            order={event.order}
            returnRequest={event.claim.return_order}
          />
        )}
        {stateFulfillMenu && (
          <CreateFulfillmentModal
            handleCancel={closeFulfillMenu}
            orderToFulfill={event.claim}
            orderId={event.claim.order_id}
          />
        )}
      </Fragment>,
    ],
  }

  return <EventContainer {...eventContainerArgs} />
}

export default Claim

const ClaimStatus = ({ event }: Props) => {
  const divider = <div className="h-11 w-px bg-grey-20" />

  const shouldHaveFulfillment =
    !!event.claim?.fulfillment_status &&
    event.claim?.additional_items?.length > 0
  const shouldHaveReturnStatus = !!event.claim?.return_order

  let refundStatus: string = event.claim?.payment_status

  if (event.claim?.type === "replace") {
    refundStatus =
      event.claim?.return_order?.status === "received"
        ? "refunded"
        : event.claim?.payment_status
  }

  if (event.canceledAt !== null) {
    refundStatus = "canceled"
  }

  return (
    <div className="inter-small-regular flex items-center gap-x-base">
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Remboursement:</span>
        <RefundStatus refundStatus={refundStatus} />
      </div>
      {shouldHaveReturnStatus && (
        <>
          {divider}
          <div className="flex flex-col gap-y-2xsmall">
            <span className="text-grey-50">Retour:</span>
            <ReturnStatus returnStatus={event.returnStatus} />
          </div>
        </>
      )}
      {shouldHaveFulfillment && (
        <>
          {divider}
          <div className="flex flex-col gap-y-2xsmall">
            <span className="text-grey-50">Fulfillment:</span>
            <FulfillmentStatus
              fulfillmentStatus={event.claim?.fulfillment_status}
            />
          </div>
        </>
      )}
    </div>
  )
}

const renderClaimItems = (event: ClaimEvent) => {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">
        Réclamer les articles
      </span>
      <div>
        {event.claimItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}

const renderReplacementItems = (event: ClaimEvent) => {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">
        Articles de remplacement
      </span>
      <div>
        {event.newItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}

const renderClaimActions = (
  event: ClaimEvent,
  onCancelClaim: () => void,
  onCancelReturn: () => void
) => {
  const actions: ActionType[] = []

  if (!event.canceledAt && !event.isCanceled) {
    if (
      event.claim.return_order &&
      event.claim.return_order?.status === "requested"
    ) {
      actions.push({
        icon: <TrashIcon size={20} />,
        label: "Annuler le retour",
        variant: "danger",
        onClick: onCancelReturn,
      })
    }

    if (event.refundStatus !== "refunded" && !event.isCanceled) {
      actions.push({
        icon: <TrashIcon size={20} />,
        label: "Annuler la réclamation",
        variant: "danger",
        onClick: onCancelClaim,
      })
    }
  }

  return actions.length ? <EventActionables actions={actions} /> : null
}
