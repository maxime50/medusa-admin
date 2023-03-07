import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import { NestedForm } from "../../../../utils/nested-form"

export type DiscountableFormType = {
  value: boolean
}

type Props = {
  form: NestedForm<DiscountableFormType>
}

const DiscountableForm = ({ form }: Props) => {
  const { control, path } = form
  return (
    <div>
      <div className="mb-2xsmall flex items-center justify-between">
        <h2 className="inter-base-semibold">Réductible</h2>
        <Controller
          control={control}
          name={path("value")}
          render={({ field: { value, onChange } }) => {
            return <Switch checked={value} onCheckedChange={onChange} />
          }}
        />
      </div>
      <p className="inter-base-regular text-grey-50">
        Si la case n'est pas cochée, les rabais ne seront pas appliquées à ce
        produit.
      </p>
    </div>
  )
}

export default DiscountableForm
