import { Region } from "@medusajs/medusa"
import { Controller, UseFormReturn } from "react-hook-form"
import IncludesTaxTooltip from "../../../../../components/atoms/includes-tax-tooltip"
import Switch from "../../../../../components/atoms/switch"
import InputHeader from "../../../../../components/fundamentals/input-header"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option, ShippingOptionPriceType } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import PriceFormInput from "../../../../products/components/prices-form/price-form-input"
import { useShippingOptionFormData } from "./use-shipping-option-form-data"

type Requirement = {
  amount: number | null
  id: string | null
}

export type ShippingOptionFormType = {
  store_option: boolean
  name: string | null
  price_type: ShippingOptionPriceType | null
  amount: number | null
  shipping_profile: Option | null
  fulfillment_provider: Option | null
  requirements: {
    min_subtotal: Requirement | null
    max_subtotal: Requirement | null
  }
}

type Props = {
  form: UseFormReturn<ShippingOptionFormType, any>
  region: Region
  isEdit?: boolean
}

const ShippingOptionForm = ({ form, region, isEdit = false }: Props) => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form

  const { shippingProfileOptions, fulfillmentOptions } =
    useShippingOptionFormData(region.id)

  return (
    <div>
      <div>
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">
              Visible dans la boutique
            </h3>
            <Controller
              control={control}
              name={"store_option"}
              defaultValue={true}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            Activer ou désactiver la visibilité de l'option de livraison dans la
            boutique.
          </p>
        </div>
      </div>
      <div className="my-xlarge h-px w-full bg-grey-20" />
      <div>
        <h3 className="inter-base-semibold mb-base">Détails</h3>
        <div className="grid grid-cols-2 gap-large">
          <InputField
            label="Titre"
            required
            {...register("name", {
              required: "Titre requis",
              pattern: FormValidator.whiteSpaceRule("Titre"),
              minLength: FormValidator.minOneCharRule("Titre"),
            })}
            errors={errors}
          />
          <div className="flex items-center gap-large">
            <Controller
              control={control}
              name="price_type"
              defaultValue={{ label: "Taux fixe", value: "flat_rate" }}
              render={() => {
                return null
                // <NextSelect
                //   label="Type de prix"
                //   required
                //   value={value}
                //   onChange={onChange}
                //   onBlur={onBlur}
                //   options={[
                //     {
                //       label: "Taux fixe",
                //       value: "flat_rate",
                //     },
                //     {
                //       label: "Calculé",
                //       value: "calculated",
                //     },
                //   ]}
                //   placeholder="Choisir un type de prix"
                //   errors={errors}
                // />
              }}
            />
            <Controller
              control={control}
              name="amount"
              rules={{
                min: FormValidator.nonNegativeNumberRule("Prix"),
                max: FormValidator.maxInteger("Prix", region.currency_code),
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <div>
                    <InputHeader
                      label="Prix"
                      className="mb-2xsmall"
                      tooltip={
                        <IncludesTaxTooltip includesTax={region.includes_tax} />
                      }
                    />
                    <PriceFormInput
                      amount={value || undefined}
                      onChange={onChange}
                      name="amount"
                      currencyCode={region.currency_code}
                      errors={errors}
                    />
                  </div>
                )
              }}
            />
          </div>

          {!isEdit && (
            <>
              {/* <Controller */}
              {/*   control={control} */}
              {/*   name="shipping_profile" */}
              {/*   render={({ field }) => { */}
              {/*     return ( */}
              {/*       <NextSelect */}
              {/*         label="Profil d'expédition" */}
              {/*         required */}
              {/*         options={shippingProfileOptions} */}
              {/*         placeholder="Choisir un profil d'expédition" */}
              {/*         {...field} */}
              {/*         errors={errors} */}
              {/*       /> */}
              {/*     ) */}
              {/*   }} */}
              {/* /> */}
              <Controller
                control={control}
                name="fulfillment_provider"
                render={({ field }) => {
                  return (
                    <NextSelect
                      label="Service de paiement"
                      required
                      placeholder="Choisir un service de paiement"
                      options={fulfillmentOptions}
                      {...field}
                      errors={errors}
                    />
                  )
                }}
              />
            </>
          )}
        </div>
      </div>
      <div className="my-xlarge h-px w-full bg-grey-20" />
      <div>
        <h3 className="inter-base-semibold mb-base">Conditions</h3>
        <div className="grid grid-cols-2 gap-large">
          <Controller
            control={control}
            name="requirements.min_subtotal.amount"
            rules={{
              min: FormValidator.nonNegativeNumberRule("Sous-total minimum"),
              max: FormValidator.maxInteger(
                "Sous-total minimum",
                region.currency_code
              ),
              validate: (value) => {
                if (value === null) {
                  return true
                }

                const maxSubtotal = form.getValues(
                  "requirements.max_subtotal.amount"
                )
                if (maxSubtotal && value > maxSubtotal) {
                  return "Le sous-total minimum doit être inférieur au sous-total maximum."
                }
                return true
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <div>
                  <InputHeader
                    label="Sous-total minimum"
                    className="mb-xsmall"
                    tooltip={
                      <IncludesTaxTooltip includesTax={region.includes_tax} />
                    }
                  />
                  <PriceFormInput
                    amount={typeof value === "number" ? value : undefined}
                    onChange={onChange}
                    name="requirements.min_subtotal.amount"
                    currencyCode={region.currency_code}
                    errors={errors}
                  />
                </div>
              )
            }}
          />
          <Controller
            control={control}
            name="requirements.max_subtotal.amount"
            rules={{
              min: FormValidator.nonNegativeNumberRule("Sous-total maximum"),
              max: FormValidator.maxInteger(
                "Sous-total maximum",
                region.currency_code
              ),
              validate: (value) => {
                if (value === null) {
                  return true
                }

                const minSubtotal = form.getValues(
                  "requirements.min_subtotal.amount"
                )
                if (minSubtotal && value < minSubtotal) {
                  return "Max. subtotal must be greater than min. subtotal"
                }
                return true
              },
            }}
            render={({ field: { value, onChange, ref } }) => {
              return (
                <div ref={ref}>
                  <InputHeader
                    label="Sous-total maximum"
                    className="mb-xsmall"
                    tooltip={
                      <IncludesTaxTooltip includesTax={region.includes_tax} />
                    }
                  />
                  <PriceFormInput
                    amount={typeof value === "number" ? value : undefined}
                    onChange={onChange}
                    name="requirements.max_subtotal.amount"
                    currencyCode={region.currency_code}
                    errors={errors}
                  />
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ShippingOptionForm
