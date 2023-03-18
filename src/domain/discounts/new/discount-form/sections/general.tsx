import { Discount } from "@medusajs/medusa"
import { useAdminRegions } from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useWatch } from "react-hook-form"
import Checkbox from "../../../../../components/atoms/checkbox"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import TextArea from "../../../../../components/molecules/textarea"
import CurrencyInput from "../../../../../components/organisms/currency-input"
import { useDiscountForm } from "../form/discount-form-context"

type GeneralProps = {
  discount?: Discount
}

const General: React.FC<GeneralProps> = ({ discount }) => {
  const initialCurrency = discount?.regions?.[0].currency_code || undefined

  const [fixedRegionCurrency, setFixedRegionCurrency] = useState<
    string | undefined
  >(initialCurrency)

  const { regions: opts, isLoading } = useAdminRegions()
  const { register, control, type } = useDiscountForm()

  const regions = useWatch({
    control,
    name: "regions",
  })

  useEffect(() => {
    if (type === "fixed" && regions) {
      let id: string

      if (Array.isArray(regions) && regions.length) {
        id = regions[0].value
      } else {
        id = (regions as unknown as { label: string; value: string }).value // if you change from fixed to percentage, unselect and select a region, and then change back to fixed it is possible to make useForm set regions to an object instead of an array
      }

      const reg = opts?.find((r) => r.id === id)

      if (reg) {
        setFixedRegionCurrency(reg.currency_code)
      }
    }
  }, [type, opts, regions])

  const regionOptions = useMemo(() => {
    return opts?.map((r) => ({ value: r.id, label: r.name })) || []
  }, [opts])

  return (
    <div className="pt-5">
      {!isLoading && (
        <>
          <Controller
            name="regions"
            control={control}
            rules={{
              required: "Au moins une région est requise",
              validate: (value) =>
                Array.isArray(value) ? value.length > 0 : !!value,
            }}
            render={({ field: { onChange, value } }) => {
              return (
                <NextSelect
                  value={value || null}
                  onChange={(value) => {
                    onChange(type === "fixed" ? [value] : value)
                  }}
                  label="Régions pouvant utiliser ce rabais"
                  isMulti={type !== "fixed"}
                  selectAll={type !== "fixed"}
                  isSearchable
                  required
                  options={regionOptions}
                />
              )
            }}
          />
          <div className="my-base flex gap-x-base gap-y-base">
            <InputField
              label="Code"
              className="flex-1"
              placeholder="PROMO2023"
              required
              {...register("code", { required: "Code requis" })}
            />

            {type !== "free_shipping" && (
              <>
                {type === "fixed" ? (
                  <div className="flex-1">
                    <CurrencyInput.Root
                      size="small"
                      currentCurrency={fixedRegionCurrency}
                      readOnly
                      hideCurrency
                    >
                      <Controller
                        name="rule.value"
                        control={control}
                        rules={{
                          required: "Amount is required",
                          min: 1,
                        }}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <CurrencyInput.Amount
                              label={"Montant"}
                              required
                              amount={value}
                              onChange={onChange}
                            />
                          )
                        }}
                      />
                    </CurrencyInput.Root>
                  </div>
                ) : (
                  <div className="flex-1">
                    <InputField
                      label="Pourcentage"
                      min={0}
                      required
                      type="number"
                      placeholder="10"
                      prefix={"%"}
                      {...register("rule.value", {
                        required: true,
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="inter-small-regular mb-6 flex flex-col text-grey-50">
            <span>
              Le code que nos clients entreront au moment du paiement. Ce code
              apparaîtra aussi sur la facture du client.
            </span>
            <span>Lettres majuscules et chiffres seulement</span>
          </div>
          <TextArea
            label="Description"
            required
            placeholder="Rabais d'été 2023"
            rows={1}
            {...register("rule.description", {
              required: true,
            })}
          />
          {/* <div className="mt-xlarge flex items-center"> */}
          {/*   <Controller */}
          {/*     name="is_dynamic" */}
          {/*     control={control} */}
          {/*     render={({ field: { onChange, value } }) => { */}
          {/*       return ( */}
          {/*         <Checkbox */}
          {/*           label="Il s'agit d'un modèle de rabais" */}
          {/*           name="is_dynamic" */}
          {/*           id="is_dynamic" */}
          {/*           checked={value} */}
          {/*           onChange={(e) => onChange(e.target.checked)} */}
          {/*         /> */}
          {/*       ) */}
          {/*     }} */}
          {/*   /> */}
          {/*   <IconTooltip */}
          {/*     content={ */}
          {/*       "Les modèles de rabais permettent de définir un ensemble de règles pouvant être utilisées pour un groupe de rabais. Cette fonction est utile dans les campagnes qui doivent générer des codes uniques pour chaque utilisateur." */}
          {/*     } */}
          {/*   /> */}
          {/* </div> */}
        </>
      )}
    </div>
  )
}

export default General
