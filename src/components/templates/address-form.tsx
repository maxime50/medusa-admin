import React from "react"
import { Controller } from "react-hook-form"
import { Option } from "../../types/shared"
import FormValidator from "../../utils/form-validator"
import { NestedForm } from "../../utils/nested-form"
import Input from "../molecules/input"
import { NextSelect } from "../molecules/select/next-select"

export type AddressPayload = {
  first_name: string
  last_name: string
  company: string | null
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
  phone: string | null
}

export enum AddressType {
  SHIPPING = "shipping",
  BILLING = "billing",
}

type AddressFormProps = {
  form: NestedForm<AddressPayload>
  countryOptions: Option[]
  type: AddressType
  required?: boolean
}

const AddressForm = ({
  form,
  countryOptions,
  type,
  required = true,
}: AddressFormProps) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form

  return (
    <div>
      <span className="inter-base-semibold">General</span>
      <div className="mt-4 mb-8 grid grid-cols-2 gap-large">
        <Input
          {...register(path("first_name"), {
            required: required ? FormValidator.required("Prénom") : false,
            pattern: FormValidator.whiteSpaceRule("Prénom"),
          })}
          placeholder="Prénom"
          label="Prénom"
          required={required}
          errors={errors}
        />
        <Input
          {...form.register(path("last_name"), {
            required: required ? FormValidator.required("Nom") : false,
            pattern: FormValidator.whiteSpaceRule("Nom"),
          })}
          placeholder="Nom"
          label="Nom"
          required={required}
          errors={errors}
        />
        <Input
          {...form.register(path("company"), {
            pattern: FormValidator.whiteSpaceRule("Entreprise"),
          })}
          placeholder="Entreprise"
          label="Entreprise"
          errors={errors}
        />
        <Input
          {...form.register(path("phone"))}
          placeholder="Téléphone"
          label="Téléphone"
          errors={errors}
        />
      </div>

      <span className="inter-base-semibold">{`${
        type === AddressType.BILLING
          ? "Adresse de facturation"
          : AddressType.SHIPPING
          ? "Adresse de facturation"
          : "Adresse"
      }`}</span>
      <div className="mt-4 grid grid-cols-1 gap-y-large">
        <Input
          {...form.register(path("address_1"), {
            required: required ? FormValidator.required("Adresse 1") : false,
            pattern: FormValidator.whiteSpaceRule("Adresse 1"),
          })}
          placeholder="Adresse 1"
          label="Adresse 1"
          required={required}
          errors={errors}
        />
        <Input
          {...form.register(path("address_2"), {
            pattern: FormValidator.whiteSpaceRule("Adresse 2"),
          })}
          placeholder="Adresse 2"
          label="Adresse 2"
          errors={errors}
        />
        <div className="grid grid-cols-[144px_1fr] gap-large">
          <Input
            {...form.register(path("postal_code"), {
              required: required
                ? FormValidator.required("Code postal")
                : false,
              pattern: FormValidator.whiteSpaceRule("Code postal"),
            })}
            placeholder="Code postal"
            label="Code postal"
            required={required}
            autoComplete="off"
            errors={errors}
          />
          <Input
            placeholder="Ville"
            label="Ville"
            {...form.register(path("city"), {
              required: required ? FormValidator.required("Ville") : false,
              pattern: FormValidator.whiteSpaceRule("Ville"),
            })}
            required={required}
            errors={errors}
          />
        </div>
        <div className="grid grid-cols-2 gap-large">
          <Input
            {...form.register(path("province"), {
              pattern: FormValidator.whiteSpaceRule("Province"),
            })}
            placeholder="Province"
            label="Province"
            errors={errors}
          />
          <Controller
            control={control}
            name={path("country_code")}
            rules={{
              required: required ? FormValidator.required("Pays") : false,
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <NextSelect
                  label="Pays"
                  required={required}
                  value={value}
                  options={countryOptions}
                  onChange={onChange}
                  name={path("country_code")}
                  errors={errors}
                />
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default AddressForm
