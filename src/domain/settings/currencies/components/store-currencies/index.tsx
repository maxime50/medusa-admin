import { Store } from "@medusajs/medusa"
import React from "react"
import Button from "../../../../../components/fundamentals/button"
import useToggleState from "../../../../../hooks/use-toggle-state"
import EditCurrenciesModal from "./edit-currencies-modal"

type Props = {
  store: Store
}

const StoreCurrencies = ({ store }: Props) => {
  const { state, close, toggle } = useToggleState()

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="inter-large-semibold mb-2xsmall">
            Devises de la boutique
          </h3>
          <p className="inter-base-regular text-grey-50">
            Toutes les devises disponibles dans la boutique.
          </p>
        </div>
        <Button variant="secondary" size="small" onClick={toggle}>
          Modifier les devises
        </Button>
      </div>
      <EditCurrenciesModal store={store} open={state} onClose={close} />
    </>
  )
}

export default StoreCurrencies
