import React from "react"
import InputField from "../../../../components/molecules/input"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"

export type DimensionsFormType = {
  length: number | null
  width: number | null
  height: number | null
  weight: number | null
}

type DimensionsFormProps = {
  form: NestedForm<DimensionsFormType>
}

/**
 * Re-usable nested form used to submit dimensions information for products and their variants.
 * @example
 * <DimensionsForm form={nestedForm(form, "dimensions")} />
 */
const DimensionsForm = ({ form }: DimensionsFormProps) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div className="grid grid-cols-4 gap-x-large">
      <InputField
        label="Largeur"
        placeholder="100..."
        type="number"
        {...register(path("width"), {
          min: FormValidator.nonNegativeNumberRule("Largeur"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
      <InputField
        label="Longueur"
        placeholder="100..."
        type="number"
        {...register(path("length"), {
          min: FormValidator.nonNegativeNumberRule("Longueur"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
      <InputField
        label="Hauteur"
        placeholder="100..."
        type="number"
        {...register(path("height"), {
          min: FormValidator.nonNegativeNumberRule("Hauteur"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
      <InputField
        label="Poids"
        placeholder="100..."
        type="number"
        {...register(path("weight"), {
          min: FormValidator.nonNegativeNumberRule("Poids"),
          valueAsNumber: true,
        })}
        errors={errors}
      />
    </div>
  )
}

export default DimensionsForm
