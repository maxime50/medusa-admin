import React from "react"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import Input from "../../../components/molecules/input"
import FormValidator from "../../../utils/form-validator"
import { NestedForm } from "../../../utils/nested-form"

export type EditTaxRateFormType = {
  name: string
  rate: number
  code: string
}

type EditTaxRateProps = {
  form: NestedForm<EditTaxRateFormType>
  lockName?: boolean
}

export const EditTaxRateDetails = ({
  lockName = false,
  form,
}: EditTaxRateProps) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-semibold mb-base">Détails</p>
      <Input
        disabled={lockName}
        label="Nom"
        prefix={
          lockName ? <LockIcon size={16} className="text-grey-40" /> : undefined
        }
        placeholder={lockName ? "Par défaut" : "Nom du taux"}
        {...register(path("name"), {
          required: !lockName ? FormValidator.required("Name") : undefined,
        })}
        required={!lockName}
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
      <Input
        type="number"
        min={0}
        max={100}
        step={0.01}
        formNoValidate
        label="Taux de taxe"
        prefix="%"
        placeholder="12"
        {...register(path("rate"), {
          min: FormValidator.min("Taux de taxe", 0),
          max: FormValidator.max("Taux de taxe", 100),
          required: FormValidator.required("Taux de taxe"),
          valueAsNumber: true,
        })}
        required
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
      <Input
        placeholder="1000"
        label="Code de taxe"
        {...register(path("code"), {
          required: FormValidator.required("Code de taxe"),
        })}
        required
        className="mb-base w-full min-w-[335px]"
        errors={errors}
      />
    </div>
  )
}
