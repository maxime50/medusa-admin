import { Order } from "@medusajs/medusa"
import { useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import { AddressPayload } from "../../../../components/templates/address-form"
import { NestedForm } from "../../../../utils/nested-form"
import { useShippingAddressFormScreen } from "./shipping-address-form-modal"

type Props = {
  form: NestedForm<AddressPayload>
  order: Order
}

const ShippingAddressForm = ({ form, order }: Props) => {
  const { control, path } = form
  const { pushScreen } = useShippingAddressFormScreen()

  const {
    address_1,
    address_2,
    city,
    country_code,
    company,
    postal_code,
    province,
  } = useWatch({
    control,
    name: path(),
  })

  return (
    <div>
      <h2 className="inter-base-semibold">Adresse de livraison</h2>
      <div className="flex items-center justify-between">
        <div className="inter-small-regular text-grey-50">
          <p>{`${address_1}${address_2 ? `, ${address_2}` : ""}`}</p>
          <p>
            {`${company ? `${company}, ` : ""}`}
            {`${postal_code} ${city}`}
          </p>
          <p>
            {`${province ? `${province}, ` : ""}`}
            {country_code?.label}
          </p>
        </div>

        <Button
          variant="secondary"
          size="small"
          type="button"
          onClick={() => pushScreen({ form, order })}
        >
          Expédier à une autre adresse
        </Button>
      </div>
    </div>
  )
}

export default ShippingAddressForm
