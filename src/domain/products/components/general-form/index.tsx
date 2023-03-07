import React from "react"
import InputField from "../../../../components/molecules/input"
import TextArea from "../../../../components/molecules/textarea"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"

export type GeneralFormType = {
  title: string
  subtitle: string | null
  handle: string
  material: string | null
  description: string | null
}

type Props = {
  form: NestedForm<GeneralFormType>
  requireHandle?: boolean
}

const GeneralForm = ({ form, requireHandle = true }: Props) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <div className="mb-small grid grid-cols-2 gap-x-large">
        <InputField
          label="Titre"
          placeholder="Bracelet ID Tendances"
          required
          {...register(path("title"), {
            required: "Titre requis",
            minLength: {
              value: 1,
              message: "Le titre doit être composé d'au moins 1 caractère",
            },
            pattern: FormValidator.whiteSpaceRule("Titre"),
          })}
          errors={errors}
        />
        <InputField
          label="Sous-titre"
          placeholder="merveilleux bracelet fait pierres..."
          {...register(path("subtitle"), {
            pattern: FormValidator.whiteSpaceRule("Sous-titre"),
          })}
          errors={errors}
        />
      </div>
      <p className="inter-base-regular mb-large text-grey-50">
        Donnez à votre produit un titre court et clair.
      </p>
      <div className="mb-large grid grid-cols-2 gap-x-large">
        <InputField
          label="Handle"
          tooltipContent={
            !requireHandle
              ? "Le handle est la partie de l'URL qui identifie le produit. S'il n'est pas spécifié, il sera généré à partir du titre."
              : undefined
          }
          placeholder="bracelet-id-tendances"
          required={requireHandle}
          {...register(path("handle"), {
            required: requireHandle ? "Handle requis" : undefined,
            minLength: FormValidator.minOneCharRule("Handle"),
            pattern: FormValidator.whiteSpaceRule("Handle"),
          })}
          prefix="/"
          errors={errors}
        />
        <InputField
          label="Matériel"
          placeholder="100% stainless"
          {...register(path("material"), {
            minLength: FormValidator.minOneCharRule("Matériel"),
            pattern: FormValidator.whiteSpaceRule("Matériel"),
          })}
          errors={errors}
        />
      </div>
      <TextArea
        label="Description"
        placeholder="Merveilleux bracelet fait vraies pierres..."
        rows={3}
        className="mb-small"
        {...register(path("description"))}
        errors={errors}
      />
      <p className="inter-base-regular text-grey-50">
        Donnez à votre produit une description courte et claire.
        <br />
        120 à 160 caractères est recommandées pour le référecement Google.
      </p>
    </div>
  )
}

export default GeneralForm
