import { Controller } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import FeatureToggle from "../../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionDetailsFormType = {
  name: string
  countries: Option[]
  currency_code: Option
  tax_rate: number | null
  tax_code: string | null
  includes_tax?: boolean
}

type Props = {
  isCreate?: boolean
  form: NestedForm<RegionDetailsFormType>
}

const RegionDetailsForm = ({ form, isCreate = false }: Props) => {
  const {
    control,
    register,
    path,
    formState: { errors },
  } = form
  const { currencyOptions, countryOptions } = useStoreData()

  return (
    <div>
      <div className="grid grid-cols-2 gap-large">
        <InputField
          label="Titre"
          placeholder="Amérique"
          required
          {...register(path("name"), {
            required: "Titre requis",
            minLength: FormValidator.minOneCharRule("Titre"),
            pattern: FormValidator.whiteSpaceRule("Titre"),
          })}
          errors={errors}
        />
        <Controller
          control={control}
          name={path("currency_code")}
          rules={{
            required: "Code de devise requis",
          }}
          render={({ field }) => {
            return (
              <NextSelect
                label="Devise"
                placeholder="Choisir la devise"
                required
                {...field}
                options={currencyOptions}
                name={path("currency_code")}
                errors={errors}
              />
            )
          }}
        />
        {isCreate && (
          <>
            <InputField
              label="Taux de taxe par défaut"
              required
              placeholder="25"
              prefix="%"
              step={1}
              type={"number"}
              {...register(path("tax_rate"), {
                required: isCreate ? "Taux de taxe requis" : undefined,
                max: {
                  value: 100,
                  message: "Le taux de taxe doit être inférieur ou égal à 100",
                },
                min: FormValidator.nonNegativeNumberRule("Taux de taxe"),
                valueAsNumber: true,
              })}
              errors={errors}
            />
            <InputField
              label="Code de taxe par défaut"
              placeholder="1000"
              {...register(path("tax_code"))}
              errors={errors}
            />
          </>
        )}
        <Controller
          control={control}
          name={path("countries")}
          render={({ field }) => {
            return (
              <NextSelect
                label="Pays"
                placeholder="Choisir un pays"
                isMulti
                selectAll
                {...field}
                name={path("countries")}
                errors={errors}
                options={countryOptions}
              />
            )
          }}
        />
      </div>
      <FeatureToggle featureFlag="tax_inclusive_pricing">
        <div className="mt-xlarge flex items-start justify-between">
          <div className="flex flex-col gap-y-2xsmall">
            <h3 className="inter-base-semibold">Prix taxes comprises</h3>
            <p className="inter-base-regular text-grey-50">
              Lorsque cette option est activée, les prix des régions sont taxes
              incluses.
            </p>
          </div>
          <Controller
            control={control}
            name={path("includes_tax")}
            render={({ field: { value, onChange } }) => {
              return <Switch checked={value} onCheckedChange={onChange} />
            }}
          />
        </div>
      </FeatureToggle>
    </div>
  )
}

export default RegionDetailsForm
