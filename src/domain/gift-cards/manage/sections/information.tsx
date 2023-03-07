import { Product } from "@medusajs/medusa"
import {
  useAdminDeleteProduct,
  useAdminProductTypes,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import { Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import UnpublishIcon from "../../../../components/fundamentals/icons/unpublish-icon"
import Input from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import StatusSelector from "../../../../components/molecules/status-selector"
import TagInput from "../../../../components/molecules/tag-input"
import TextArea from "../../../../components/molecules/textarea"
import BodyCard from "../../../../components/organisms/body-card"
import DetailsCollapsible from "../../../../components/organisms/details-collapsible"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import FormValidator from "../../../../utils/form-validator"
import { useGiftCardForm } from "../form/gift-card-form-context"

type InformationProps = {
  giftCard: Omit<Product, "beforeInsert">
}

const Information: React.FC<InformationProps> = ({ giftCard }) => {
  const {
    form: {
      register,
      setValue,
      control,
      formState: { errors },
    },
  } = useGiftCardForm()
  const navigate = useNavigate()
  const notification = useNotification()
  const { product_types } = useAdminProductTypes(undefined, {
    cacheTime: 0,
  })

  const typeOptions =
    product_types?.map((tag) => ({ label: tag.value, value: tag.id })) || []

  const updateGiftCard = useAdminUpdateProduct(giftCard.id)
  const deleteGiftCard = useAdminDeleteProduct(giftCard.id)

  const setNewType = (value: string) => {
    const newType = {
      label: value,
      value,
    }

    typeOptions.push(newType)
    setValue("type", newType)

    return newType
  }

  const onUpdate = () => {
    updateGiftCard.mutate(
      {
        // @ts-ignore
        status: giftCard.status === "draft" ? "published" : "draft",
      },
      {
        onSuccess: () => {
          notification(
            "Succès",
            "Carte cadeau a été mise à jour avec succès",
            "success"
          )
        },
        onError: (error) => {
          notification("Erreur", getErrorMessage(error), "error")
        },
      }
    )
  }

  const onDelete = () => {
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        navigate("/a/gift-cards")
        notification(
          "Succès",
          "Carte cadeau a été mise à jour avec succès",
          "success"
        )
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <BodyCard
      title="Paramètres de la Carte Cadeau"
      subtitle="Gérer les paramètres de votre carte cadeau"
      className={"h-auto w-full"}
      status={
        <GiftCardStatusSelector
          currentStatus={giftCard.status}
          onUpdate={onUpdate}
        />
      }
      actionables={[
        {
          label:
            giftCard?.status !== "published"
              ? "Publier la carte cadeau"
              : "Dépublier la carte cadeau",
          onClick: onUpdate,
          icon: <UnpublishIcon size="16" />,
        },
        {
          label: "Supprimer la carte cadeau",
          onClick: onDelete,
          variant: "danger",
          icon: <TrashIcon size="16" />,
        },
      ]}
    >
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-large">
          <Input
            label="Nom"
            placeholder="Ajouter un nom"
            required
            defaultValue={giftCard?.title}
            {...register("title", {
              required: FormValidator.required("Nom"),
              pattern: FormValidator.whiteSpaceRule("Nom"),
              minLength: FormValidator.minOneCharRule("Nom"),
            })}
            errors={errors}
          />
          <Input
            label="Sous-titre"
            placeholder="Ajouter un sous-titre"
            {...register("subtitle", {
              pattern: FormValidator.whiteSpaceRule("Sous-titre"),
              minLength: FormValidator.minOneCharRule("Sous-titre"),
            })}
            errors={errors}
          />
          <TextArea
            label="Description"
            placeholder="Ajouter une description"
            {...register("description", {
              pattern: FormValidator.whiteSpaceRule("Description"),
              minLength: FormValidator.minOneCharRule("Description"),
            })}
            errors={errors}
          />
        </div>
        <DetailsCollapsible
          triggerProps={{ className: "ml-2" }}
          contentProps={{
            forceMount: true,
          }}
        >
          <div className="grid grid-cols-2 gap-large">
            <Input
              label="Handle"
              placeholder="Product handle"
              {...register("handle", {
                pattern: FormValidator.whiteSpaceRule("Handle"),
                minLength: FormValidator.minOneCharRule("Handle"),
              })}
              tooltipContent="URL du produit"
              errors={errors}
            />
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Type"
                    placeholder="Sélectionner le type..."
                    options={typeOptions}
                    onChange={onChange}
                    value={value}
                    isCreatable
                    onCreateOption={(value) => {
                      return setNewType(value)
                    }}
                    clearSelected
                  />
                )
              }}
            />
            <Controller
              name="tags"
              render={({ field: { onChange, value } }) => {
                return (
                  <TagInput
                    label="Tags (séparés par une virgule)"
                    className="w-full"
                    placeholder="Été, Automne..."
                    onChange={onChange}
                    values={value || []}
                  />
                )
              }}
              control={control}
            />
          </div>
        </DetailsCollapsible>
      </div>
    </BodyCard>
  )
}

const GiftCardStatusSelector = ({
  currentStatus,
  onUpdate,
}: {
  currentStatus: "draft" | "proposed" | "published" | "rejected"
  onUpdate: () => void
}) => {
  return (
    <StatusSelector
      activeState="Publiée"
      draftState="Brouillon"
      isDraft={currentStatus === "draft"}
      onChange={onUpdate}
    />
  )
}

export default Information
