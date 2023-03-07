import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const FulfillmentStatusComponent = ({ status }) => {
  switch (status) {
    case "shipped":
      return <StatusDot title="Expédiée" variant="success" />
    case "fulfilled":
      return <StatusDot title="Traitée" variant="warning" />
    case "canceled":
      return <StatusDot title="Annulée" variant="danger" />
    case "partially_fulfilled":
      return <StatusDot title="Partiellement traitée" variant="warning" />
    case "requires_action":
      return <StatusDot title="Action requise" variant="danger" />
    case "not_fulfilled":
      return <StatusDot title="En attente de traitement" variant="danger" />
    default:
      return null
  }
}
