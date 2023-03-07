import { Region } from "@medusajs/medusa"
import { useAdminStoreTaxProviders, useAdminUpdateRegion } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../components/atoms/checkbox"
import Button from "../../../components/fundamentals/button"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import Select from "../../../components/molecules/select"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"

type RegionTaxFormProps = {
  region: Region
}

type TaxProviderOption = Option | { label: string; value: null }

type RegionTaxFormData = {
  automatic_taxes: boolean
  gift_cards_taxable: boolean
  tax_provider_id: TaxProviderOption
}

export const RegionTaxForm = ({ region }: RegionTaxFormProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<RegionTaxFormData>({
    defaultValues: {
      automatic_taxes: region.automatic_taxes,
      gift_cards_taxable: region.gift_cards_taxable,
      tax_provider_id: {
        label:
          region.tax_provider_id === null
            ? "Fournisseur de taxes système"
            : region.tax_provider_id,
        value: region.tax_provider_id,
      },
    },
  })
  const notification = useNotification()

  useEffect(() => {
    reset({
      automatic_taxes: region.automatic_taxes,
      gift_cards_taxable: region.gift_cards_taxable,
      tax_provider_id: {
        label:
          region.tax_provider_id === null
            ? "Fournisseur de taxes système"
            : region.tax_provider_id,
        value: region.tax_provider_id,
      },
    })
  }, [region])

  const { isLoading: isProvidersLoading, tax_providers } =
    useAdminStoreTaxProviders()

  const updateRegion = useAdminUpdateRegion(region.id)

  const providerOptions = useMemo(() => {
    if (tax_providers) {
      return [
        {
          label: "Fournisseur de taxes système",
          value: null,
        },
        ...tax_providers.map((tp) => ({
          label: tp.id,
          value: tp.id,
        })),
      ]
    }

    return [
      {
        label: "Fournisseur de taxes système",
        value: null,
      },
    ]
  }, [tax_providers])

  const onSubmit = (data) => {
    const toSubmit = {
      ...data,
      tax_provider_id: data.tax_provider_id.value,
    }

    updateRegion.mutate(toSubmit, {
      onSuccess: () => {
        notification(
          "Succès",
          "Paramètres de la taxe régionale mis à jour avec succès.",
          "success"
        )
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <form className="flex flex-1 flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-1 flex-col gap-base">
        <Controller
          name="tax_provider_id"
          control={control}
          rules={{ required: true }}
          render={({ field: { value, onChange } }) => (
            <Select
              disabled={isProvidersLoading}
              label="Fournisseur de taxes"
              options={providerOptions}
              value={value}
              onChange={onChange}
              className="mb-base"
            />
          )}
        />
        <div className="item-center flex gap-x-1.5">
          <Checkbox
            className="inter-base-regular"
            {...register("automatic_taxes")}
            label="Calculer les taxes automatiquement ?"
          />
          <IconTooltip
            content={
              "Si cette option est cochée, la boutique appliquera automatiquement les calculs de taxes aux paniers dans cette région. Si la case n'est pas cochée, vous devrez calculer manuellement les taxes au moment du paiement."
            }
          />
        </div>
        <div className="item-center flex gap-x-1.5">
          <Checkbox
            className="inter-base-regular"
            {...register("gift_cards_taxable")}
            label="Appliquer les taxes aux cartes-cadeaux ?"
          />
          <IconTooltip
            content={
              "Si la case est cochée, les taxes seront appliquées aux cartes-cadeaux lors du paiement. Dans certains pays, la réglementation fiscale exige que les taxes soient appliquées aux cartes-cadeaux lors de l'achat."
            }
          />
        </div>
      </div>
      <div className="flex justify-end">
        {isDirty && (
          <Button
            loading={updateRegion.isLoading}
            variant="primary"
            size="medium"
            type="submit"
          >
            Sauvegarder
          </Button>
        )}
      </div>
    </form>
  )
}
