import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import InputField from "../../../../../components/molecules/input"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantStockFormType = {
  manage_inventory: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
}

type Props = {
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({ form }: Props) => {
  const {
    path,
    control,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configurer l'inventaire et le stock pour cette variante.
      </p>
      <div className="flex flex-col gap-y-xlarge pt-large">
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Gérer les stocks</h3>
            <Controller
              control={control}
              name={path("manage_inventory")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            Si cette option est cochée, l'inventaire se réajustera
            automatiquement lors des commandes et des retours.
          </p>
        </div>
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">
              Autoriser les Backorders
            </h3>
            <Controller
              control={control}
              name={path("allow_backorder")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            Si la case est cochée, le produit sera disponible à l'achat même
            s'il est en rupture de stock.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-large">
          <InputField
            label="SKU"
            placeholder="SUN-G, JK1234..."
            {...register(path("sku"))}
          />
          <InputField
            label="Quantité en stock"
            type="number"
            placeholder="100..."
            errors={errors}
            {...register(path("inventory_quantity"), {
              valueAsNumber: true,
            })}
          />
          <InputField
            label="EAN (Code barre)"
            placeholder="123456789102..."
            {...register(path("ean"))}
          />
          <InputField
            label="UPC (Code barre)"
            placeholder="023456789104..."
            {...register(path("upc"))}
          />
          <InputField
            label="Code barre"
            placeholder="123456789104..."
            {...register(path("barcode"))}
          />
        </div>
      </div>
    </div>
  )
}

export default VariantStockForm
