import React from "react"
import Badge from "../../fundamentals/badge"

enum RequirementType {
  MAX_SUBTOTAL = "max_subtotal",
  MIN_SUBTOTAL = "min_subtotal",
}

type OptionType = {
  name: string
  price_type: "flat_rate" | "calculated"
  data: {
    name?: string
  }
  amount: number
  admin_only: boolean
  requirements: {
    type: RequirementType
    amount: number
  }[]
}

type ShippingOptionProps = {
  option: OptionType
  currency_code: string
  onEdit: React.ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
}

const ShippingOption: React.FC<ShippingOptionProps> = ({
  option,
  currency_code,
  onEdit,
}) => {
  return (
    <div className="flex items-baseline justify-between rounded-base border border-grey-20 p-base">
      <div className="truncate">
        <div className="flex items-center">
          <p className="inter-small-semibold mr-xsmall truncate">
            {option.name} {option.data.name && `(${option.data.name})`}{" "}
          </p>
          {option.admin_only && (
            <Badge variant="primary">Pas sur le site web</Badge>
          )}
        </div>
        <p className="inter-small-regular truncate text-grey-50">
          {option.price_type === "flat_rate" ? "Flat Rate" : "Calculated"}:{" "}
          {option.amount !== undefined &&
            `${option.amount / 100} ${currency_code.toUpperCase()}`}
          {option.requirements.length
            ? option.requirements.map((r) => {
                const type =
                  r.type === "max_subtotal" ? "Max. subtotal" : "Min. subtotal"
                return ` - ${type}: ${
                  r.amount / 100
                } ${currency_code.toUpperCase()}`
              })
            : null}
        </p>
      </div>
      <div>
        <button
          onClick={onEdit}
          className="inter-small-semibold text-violet-60"
        >
          Modifier
        </button>
      </div>
    </div>
  )
}

export default ShippingOption
