import React from "react"
import StatusIndicator from "../../fundamentals/status-indicator"

export type SimpleProductType = {
  id: string
  thumbnail?: string
  title: string
  status: string
  created_at: Date
}

export const decideStatus = (status: string) => {
  switch (status) {
    case "published":
      return <StatusIndicator title="Publiée" variant="success" />
    case "draft":
      return <StatusIndicator title="Brouillon" variant="default" />
    case "proposed":
      return <StatusIndicator title="Proposée" variant="warning" />
    case "rejected":
      return <StatusIndicator title="Rejetée" variant="danger" />
    default:
      return null
  }
}
