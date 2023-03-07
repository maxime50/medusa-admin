import React from "react"

import StatusDot from "../../../../components/fundamentals/status-indicator"

export const PaymentStatusComponent = ({ status }) => {
  switch (status) {
    case "captured":
      return <StatusDot title="Payé" variant="success" />
    case "awaiting":
      return <StatusDot title="En attente du paiement" variant="danger" />
    case "canceled":
      return <StatusDot title="Annulé" variant="danger" />
    case "requires_action":
      return <StatusDot title="Action requise" variant="danger" />
    default:
      return null
  }
}
