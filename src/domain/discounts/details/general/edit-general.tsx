import { Discount } from "@medusajs/medusa"
import { useAdminRegions, useAdminUpdateDiscount } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import { NextSelect } from "../../../../components/molecules/select/next-select"
import TextArea from "../../../../components/molecules/textarea"
import CurrencyInput from "../../../../components/organisms/currency-input"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"

type EditGeneralProps = {
  discount: Discount
  onClose: () => void
}

type GeneralForm = {
  regions: Option[]
  code: string
  description: string
  value: number
}

const EditGeneral: React.FC<EditGeneralProps> = ({ discount, onClose }) => {
  const { mutate, isLoading } = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const { control, handleSubmit, reset, register } = useForm<GeneralForm>({
    defaultValues: mapGeneral(discount),
  })

  const onSubmit = (data: GeneralForm) => {
    mutate(
      {
        regions: data.regions.map((r) => r.value),
        code: data.code,
        rule: {
          id: discount.rule.id,
          description: data.description,
          value: data.value,
          allocation: discount.rule.allocation,
        },
      },
      {
        onSuccess: ({ discount }) => {
          notification("Succès", "Rabais mis à jour avec succès", "success")
          reset(mapGeneral(discount))
          onClose()
        },
        onError: (error) => {
          notification("Erreur", getErrorMessage(error), "error")
        },
      }
    )
  }

  useEffect(() => {
    reset(mapGeneral(discount))
  }, [discount])

  const type = discount.rule.type

  const { regions } = useAdminRegions()

  const regionOptions = useMemo(() => {
    return regions
      ? regions.map((r) => ({
          label: r.name,
          value: r.id,
        }))
      : []
  }, [regions])

  const selectedRegions = useWatch({
    control,
    name: "regions",
  })

  const fixedCurrency = useMemo(() => {
    if (type === "fixed" && selectedRegions?.length) {
      return regions?.find((r) => r.id === selectedRegions[0].value)
        ?.currency_code
    }
  }, [selectedRegions, type, regions])

  return (
    <Modal handleClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onClose}>
            <h1 className="inter-xlarge-semibold">
              Modifier les informations générales
            </h1>
          </Modal.Header>
          <Modal.Content>
            <Controller
              name="regions"
              control={control}
              rules={{
                required: "Au moins une région est requise",
                validate: (value) =>
                  Array.isArray(value) ? value.length > 0 : !!value,
              }}
              render={({ field: { value, onChange } }) => {
                return (
                  <NextSelect
                    value={value}
                    onChange={(value) => {
                      onChange(type === "fixed" ? [value] : value)
                    }}
                    label="Choisir des régions valides"
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
                        currentCurrency={fixedCurrency ?? "USD"}
                        readOnly
                        hideCurrency
                      >
                        <Controller
                          name="value"
                          control={control}
                          rules={{
                            required: "Montant requis",
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
                        {...register("value", {
                          required: "Pourcentage requis",
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
              <span>Lettres majuscules et chiffres uniquement.</span>
            </div>
            <TextArea
              label="Description"
              required
              placeholder="Promo d'été 2023"
              rows={1}
              {...register("description", {
                required: "Description requise",
              })}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button
                variant="ghost"
                size="small"
                className="min-w-[128px]"
                type="button"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="small"
                className="min-w-[128px]"
                type="submit"
                disabled={isLoading}
                loading={isLoading}
              >
                Sauvegarder
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

const mapGeneral = (discount: Discount): GeneralForm => {
  return {
    regions: discount.regions.map((r) => ({ label: r.name, value: r.id })),
    code: discount.code,
    description: discount.rule.description,
    value: discount.rule.value,
  }
}

export default EditGeneral
