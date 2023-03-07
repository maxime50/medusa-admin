import { ReturnItem } from "@medusajs/medusa"
import {
  useAdminCancelReturn,
  useAdminCancelSwap,
  useAdminOrder,
  useAdminStore,
} from "medusa-react"
import React, { useEffect, useState } from "react"

import CreateFulfillmentModal from "../../../domain/orders/details/create-fulfillment"
import { ReceiveReturnMenu } from "../../../domain/orders/details/receive-return"
import { orderReturnableFields } from "../../../domain/orders/details/utils/order-returnable-fields"
import useOrdersExpandParam from "../../../domain/orders/details/utils/use-admin-expand-paramter"
import { ExchangeEvent } from "../../../hooks/use-build-timeline"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import CopyToClipboard from "../../atoms/copy-to-clipboard"
import Button from "../../fundamentals/button"
import CancelIcon from "../../fundamentals/icons/cancel-icon"
import DollarSignIcon from "../../fundamentals/icons/dollar-sign-icon"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import TruckIcon from "../../fundamentals/icons/truck-icon"
import DeletePrompt from "../../organisms/delete-prompt"
import { ActionType } from "../actionables"
import IconTooltip from "../icon-tooltip"
import { FulfillmentStatus, PaymentStatus, ReturnStatus } from "../order-status"
import EventActionables from "./event-actionables"
import EventContainer, { EventIconColor } from "./event-container"
import EventItemContainer from "./event-item-container"

type ExchangeProps = {
  event: ExchangeEvent
  refetch: () => void
}

type ExchangeStatusProps = {
  event: ExchangeEvent
}

const ExchangeStatus: React.FC<ExchangeStatusProps> = ({ event }) => {
  const divider = <div className="h-11 w-px bg-grey-20" />

  return (
    <div className="inter-small-regular flex items-center gap-x-base">
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Paiement:</span>
        <PaymentStatus paymentStatus={event.paymentStatus} />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Retour:</span>
        <ReturnStatus returnStatus={event.returnStatus} />
      </div>
      {divider}
      <div className="flex flex-col gap-y-2xsmall">
        <span className="text-grey-50">Traitement:</span>
        <FulfillmentStatus fulfillmentStatus={event.fulfillmentStatus} />
      </div>
    </div>
  )
}

const Exchange: React.FC<ExchangeProps> = ({ event, refetch }) => {
  const [showCancel, setShowCancel] = useState(false)
  const [showCancelReturn, setShowCancelReturn] = useState(false)
  const [showReceiveReturn, setShowReceiveReturn] = useState(false)
  const [showCreateFulfillment, setShowCreateFulfillment] = useState(false)
  const cancelExchange = useAdminCancelSwap(event.orderId)
  const cancelReturn = useAdminCancelReturn(event.returnId)
  const [differenceCardId, setDifferenceCardId] = useState<string | undefined>(
    undefined
  )
  const [paymentFormatWarning, setPaymentFormatWarning] = useState<
    string | undefined
  >(undefined)
  const [payable, setPayable] = useState(true)
  const { store } = useAdminStore()
  const { orderRelations } = useOrdersExpandParam()
  const { order } = useAdminOrder(event.orderId, {
    expand: orderRelations,
    fields: orderReturnableFields,
  })

  const notification = useNotification()

  useEffect(() => {
    if (!store) {
      return
    }

    if (event.paymentStatus !== "not_paid") {
      setPayable(false)
      return
    }

    if (store.swap_link_template?.indexOf("{cart_id}") === -1) {
      setPaymentFormatWarning(
        "Le lien de paiement n'a pas le format par défaut, car il ne contient pas '{cart_id}'. Mettez à jour le lien de paiement pour inclure '{cart_id}' ou mettez à jour cette méthode pour refléter le format de votre lien de paiement."
      )
    }

    if (!store.swap_link_template) {
      setPaymentFormatWarning(
        "Aucun lien de paiement n'a été défini. Veuillez mettre à jour les paramètres de la boutique."
      )
    }

    if (event.exchangeCartId) {
      setDifferenceCardId(
        store.swap_link_template?.replace(/\{cart_id\}/, event.exchangeCartId)
      )
    }
  }, [
    store?.swap_link_template,
    event.exchangeCartId,
    event.paymentStatus,
    store,
  ])

  const paymentLink = getPaymentLink(
    payable,
    differenceCardId,
    paymentFormatWarning,
    event.exchangeCartId
  )

  const handleCancelExchange = async () => {
    await cancelExchange.mutateAsync(event.id)
    refetch()
  }

  const handleCancelReturn = async () => {
    await cancelReturn.mutateAsync()
    refetch()
  }

  const handleProcessSwapPayment = () => {
    Medusa.orders
      .processSwapPayment(event.orderId, event.id)
      .then((_res) => {
        notification(
          "Succès",
          "Le paiement a été traité avec succès",
          "success"
        )
        refetch()
      })
      .catch((err) => {
        notification("Erreur", getErrorMessage(err), "error")
      })
  }

  const returnItems = getReturnItems(event)
  const newItems = getNewItems(event)

  const actions: ActionType[] = []

  if (event.paymentStatus === "awaiting") {
    actions.push({
      label: "Saisir le paiement",
      icon: <DollarSignIcon size={20} />,
      onClick: handleProcessSwapPayment,
    })
  }

  if (event.returnStatus === "requested") {
    actions.push({
      label: "Annuler le retour",
      icon: <TruckIcon size={20} />,
      onClick: () => setShowCancelReturn(!showCancelReturn),
    })
  }

  if (
    !event.isCanceled &&
    !event.canceledAt &&
    event.fulfillmentStatus !== "fulfilled" &&
    event.fulfillmentStatus !== "shipped"
  ) {
    actions.push({
      label: "Annuler l'échange",
      icon: <CancelIcon size={20} />,
      onClick: () => setShowCancel(!showCancel),
      variant: "danger",
    })
  }

  const args = {
    title: event.canceledAt ? "Échange annulé" : "Échange demandé",
    icon: event.canceledAt ? (
      <CancelIcon size={20} />
    ) : (
      <RefreshIcon size={20} />
    ),
    expandable: !!event.canceledAt,
    iconColor: event.canceledAt
      ? EventIconColor.DEFAULT
      : EventIconColor.ORANGE,
    time: event.time,
    noNotification: event.noNotification,
    topNode: getActions(event, actions),
    children: [
      <div className="flex flex-col gap-y-base" key={event.id}>
        {event.canceledAt && (
          <div>
            <span className="inter-small-semibold mr-2">Demandée le:</span>
            <span className="text-grey-50">
              {new Date(event.time).toUTCString()}
            </span>
          </div>
        )}
        {!event.canceledAt && <ExchangeStatus event={event} />}
        {!event.canceledAt && paymentLink}
        {returnItems}
        {newItems}
        <div className="flex items-center gap-x-xsmall">
          {event.returnStatus === "requested" && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowReceiveReturn(true)}
            >
              Recevoir le retour
            </Button>
          )}
          {event.fulfillmentStatus === "not_fulfilled" && (
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowCreateFulfillment(true)}
            >
              Traiter l'échange
            </Button>
          )}
        </div>
      </div>,
    ],
  }
  return (
    <>
      <EventContainer {...args} />
      {showCancel && (
        <DeletePrompt
          handleClose={() => setShowCancel(!showCancel)}
          onDelete={handleCancelExchange}
          confirmText="Oui, annuler"
          heading="Annuler l'échange"
          text="Êtes-vous sûr de vouloir annuler cet échange ?"
          successText="Échange annulée"
        />
      )}
      {showCancelReturn && (
        <DeletePrompt
          handleClose={() => setShowCancelReturn(!showCancelReturn)}
          onDelete={handleCancelReturn}
          confirmText="Oui, annuler"
          heading="Annuler le retour"
          text="Vous êtes sûr de vouloir annuler ce retour ?"
          successText="Retour annulé"
        />
      )}
      {showReceiveReturn && order && (
        <ReceiveReturnMenu
          order={order}
          returnRequest={event.raw.return_order}
          onClose={() => setShowReceiveReturn(false)}
        />
      )}
      {showCreateFulfillment && (
        <CreateFulfillmentModal
          orderId={event.orderId}
          orderToFulfill={event.raw}
          handleCancel={() => setShowCreateFulfillment(false)}
        />
      )}
    </>
  )
}

function getNewItems(event: ExchangeEvent) {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">
        Nouveaux articles
      </span>
      <div>
        {event.newItems.map((i, index) => (
          <EventItemContainer key={index} item={i} />
        ))}
      </div>
    </div>
  )
}

function getPaymentLink(
  payable: boolean,
  differenceCardId: string | undefined,
  paymentFormatWarning: string | undefined,
  exchangeCartId: string | undefined
) {
  return payable ? (
    <div className="inter-small-regular flex flex-col gap-y-xsmall text-grey-50">
      <div className="flex items-center gap-x-xsmall">
        {paymentFormatWarning && <IconTooltip content={paymentFormatWarning} />}
        <span>Lien de paiement:</span>
      </div>
      {differenceCardId && (
        <CopyToClipboard
          value={differenceCardId}
          displayValue={exchangeCartId}
        />
      )}
    </div>
  ) : null
}

function getReturnItems(event: ExchangeEvent) {
  return (
    <div className="flex flex-col gap-y-small">
      <span className="inter-small-regular text-grey-50">
        Articles retournés
      </span>
      <div>
        {event.returnItems
          .filter((i) => !!i)
          .map((i: ReturnItem) => (
            <EventItemContainer
              key={i.id}
              item={{ ...i, quantity: i.requestedQuantity }}
            />
          ))}
      </div>
    </div>
  )
}

function getActions(event: ExchangeEvent, actions: ActionType[]) {
  if (actions.length === 0) {
    return null
  }

  return <EventActionables actions={actions} />
}

export default Exchange
