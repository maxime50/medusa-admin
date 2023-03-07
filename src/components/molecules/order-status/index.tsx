import React from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

type PaymentStatusProps = {
  paymentStatus: string
}

type FulfillmentStatusProps = {
  fulfillmentStatus: string
}

type OrderStatusProps = {
  orderStatus: string
}

type ReturnStatusProps = {
  returnStatus: string
}

type RefundStatusProps = {
  refundStatus: string
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ paymentStatus }) => {
  switch (paymentStatus) {
    case "captured":
      return <StatusIndicator title="Payée" variant="success" />
    case "awaiting":
      return <StatusIndicator title="En attente" variant="default" />
    case "not_paid":
      return <StatusIndicator title="Non payée" variant="default" />
    case "canceled":
      return <StatusIndicator title="Annulée" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Action requise" variant="danger" />
    default:
      return null
  }
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderStatus }) => {
  switch (orderStatus) {
    case "completed":
      return <StatusIndicator title="Complétée" variant="success" />
    case "pending":
      return <StatusIndicator title="Traitement" variant="default" />
    case "canceled":
      return <StatusIndicator title="Annulée" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Rejetée" variant="danger" />
    default:
      return null
  }
}

const FulfillmentStatus: React.FC<FulfillmentStatusProps> = ({
  fulfillmentStatus,
}) => {
  switch (fulfillmentStatus) {
    case "shipped":
      return <StatusIndicator title="Expédiée" variant="success" />
    case "fulfilled":
      return <StatusIndicator title="Traitée" variant="warning" />
    case "canceled":
      return <StatusIndicator title="Annulée" variant="danger" />
    case "partially_fulfilled":
      return <StatusIndicator title="Partiellement traitée" variant="warning" />
    case "not_fulfilled":
      return <StatusIndicator title="Non traitée" variant="default" />
    case "requires_action":
      return <StatusIndicator title="Action requise" variant="danger" />
    default:
      return null
  }
}

const ReturnStatus: React.FC<ReturnStatusProps> = ({ returnStatus }) => {
  switch (returnStatus) {
    case "received":
      return <StatusIndicator title="Reçue" variant="success" />
    case "requested":
      return <StatusIndicator title="Demandée" variant="default" />
    case "canceled":
      return <StatusIndicator title="Annulée" variant="danger" />
    case "requires_action":
      return <StatusIndicator title="Action requise" variant="danger" />
    default:
      return null
  }
}

const RefundStatus: React.FC<RefundStatusProps> = ({ refundStatus }) => {
  switch (refundStatus) {
    case "na":
      return <StatusIndicator title="N/A" variant="default" />
    case "not_refunded":
      return <StatusIndicator title="Rembousée" variant="default" />
    case "refunded":
      return <StatusIndicator title="Reboursée" variant="success" />
    case "canceled":
      return <StatusIndicator title="Annulée" variant="danger" />
    default:
      return null
  }
}

export {
  PaymentStatus,
  OrderStatus,
  FulfillmentStatus,
  ReturnStatus,
  RefundStatus,
}
