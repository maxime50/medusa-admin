import React from "react"
import InputField from "../../../../../components/molecules/input"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantGeneralFormType = {
  title: string | null
  material: string | null
}

type Props = {
  form: NestedForm<VariantGeneralFormType>
}

const VariantGeneralForm = ({ form }: Props) => {
  const {
    path,
    register,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configurer les informations générales pour cette variante.
      </p>
      <div className="pt-large">
        <div className="grid grid-cols-1 gap-x-large">
          <InputField
            label="Titre personnalisé"
            placeholder="Rouge / XL..."
            {...register(path("title"), {
              pattern: FormValidator.whiteSpaceRule("Titre"),
            })}
            errors={errors}
          />
          {/* <InputField */}
          {/*   label="Matériel" */}
          {/*   placeholder="100% stainless..." */}
          {/*   {...form.register(path("material"), { */}
          {/*     pattern: FormValidator.whiteSpaceRule("Matériel"), */}
          {/*   })} */}
          {/*   errors={errors} */}
          {/* /> */}
        </div>
      </div>
    </div>
  )
}

export default VariantGeneralForm
