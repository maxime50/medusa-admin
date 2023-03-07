import React from "react"
import { DisplayTotal } from "./display-total"

export const PaymentDetails = ({
  currency,
  swapAmount,
  manualRefund,
  swapRefund,
  returnRefund,
  paidTotal,
  refundedTotal,
}) => {
  if (swapAmount + manualRefund + swapRefund + returnRefund === 0) {
    return null
  }

  return (
    <>
      {!!swapAmount && (
        <DisplayTotal
          currency={currency}
          totalAmount={swapAmount}
          totalTitle={"Total pour les échanges"}
        />
      )}
      {!!swapRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={"Remboursé pour les échanges"}
        />
      )}
      {!!returnRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={returnRefund}
          totalTitle={"Remboursé pour les retours"}
        />
      )}
      {!!manualRefund && (
        <DisplayTotal
          currency={currency}
          totalAmount={manualRefund}
          totalTitle={"Remboursé manuellement"}
        />
      )}
      <DisplayTotal
        variant={"bold"}
        currency={currency}
        totalAmount={paidTotal - refundedTotal}
        totalTitle={"Total Net"}
      />
    </>
  )
}
