import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const OrderStatusComponent = ({ status }) => {
  switch (status) {
    case "completed":
      return <StatusDot title="Complétée" variant="success" />
    case "pending":
      return <StatusDot title="En cours de traitement" variant="default" />
    case "canceled":
      return <StatusDot title="Annulée" variant="danger" />
    case "requires_action":
      return <StatusDot title="Action requise" variant="danger" />
    default:
      return null
  }
}
