import { Product } from "@medusajs/medusa"
import { useAdminCreateVariant } from "medusa-react"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import FormValidator from "../../../utils/form-validator"
import Button from "../../fundamentals/button"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import IconTooltip from "../../molecules/icon-tooltip"
import Modal from "../../molecules/modal"
import CurrencyInput from "../currency-input"
import { useValuesFieldArray } from "./use-values-field-array"

type AddDenominationModalProps = {
  giftCard: Omit<Product, "beforeInsert">
  storeCurrency: string
  currencyCodes: string[]
  handleClose: () => void
}

const AddDenominationModal: React.FC<AddDenominationModalProps> = ({
  giftCard,
  storeCurrency,
  currencyCodes,
  handleClose,
}) => {
  const { watch, handleSubmit, control } = useForm<{
    default_price: number
    prices: {
      price: {
        amount: number
        currency_code: string
      }
    }[]
  }>()
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateVariant(giftCard.id)

  // passed to useValuesFieldArray so new prices are intialized with the currenct default price
  const defaultValue = watch("default_price", 10000)

  const { fields, appendPrice, deletePrice, availableCurrencies } =
    useValuesFieldArray(
      currencyCodes,
      {
        control,
        name: "prices",
        keyName: "indexId",
      },
      {
        defaultAmount: defaultValue,
        defaultCurrencyCode: storeCurrency,
      }
    )

  const onSubmit = async (data: any) => {
    const prices = [
      {
        amount: data.default_price,
        currency_code: storeCurrency,
      },
    ]

    if (data.prices) {
      data.prices.forEach((p) => {
        prices.push({
          amount: p.price.amount,
          currency_code: p.price.currency_code,
        })
      })
    }

    mutate(
      {
        title: `${giftCard.variants.length}`,
        options: [
          {
            value: `${data.default_price}`,
            option_id: giftCard.options[0].id,
          },
        ],
        prices,
        inventory_quantity: 0,
        manage_inventory: false,
      },
      {
        onSuccess: () => {
          notification("Succès", "Dénomination ajoutée avec succès", "success")
          handleClose()
        },
        onError: (error) => {
          const errorMessage = () => {
            // @ts-ignore
            if (error.response?.data?.type === "duplicate_error") {
              return `Une dénomination avec cette valeur par défaut existe déjà`
            } else {
              return getErrorMessage(error)
            }
          }

          notification("Erreur", errorMessage(), "error")
        },
      }
    )
  }

  return (
    <Modal handleClose={handleClose} isLargeModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              Ajouter une dénomination
            </span>
          </Modal.Header>
          <Modal.Content>
            <div className="mb-xlarge flex-1">
              <div className="mb-base flex gap-x-2">
                <h3 className="inter-base-semibold">Valeur par défaut</h3>
                <IconTooltip content="Il s'agit de la dénomination dans la devise par défaut de la boutique." />
              </div>
              <Controller
                control={control}
                name="default_price"
                rules={{
                  required: "Valeur par défaut requis",
                  max: FormValidator.maxInteger(
                    "Valeur par défaut",
                    storeCurrency
                  ),
                }}
                render={({ field: { onChange, value, ref } }) => {
                  return (
                    <CurrencyInput.Root
                      currentCurrency={storeCurrency}
                      readOnly
                      size="medium"
                    >
                      <CurrencyInput.Amount
                        ref={ref}
                        label="Montant"
                        amount={value}
                        onChange={onChange}
                      />
                    </CurrencyInput.Root>
                  )
                }}
              />
            </div>
            <div>
              <div className="mb-base flex gap-x-2">
                <h3 className="inter-base-semibold">Autres valeurs</h3>
                <IconTooltip content="Here you can add values in other currencies" />
              </div>
              <div className="flex flex-col gap-y-xsmall">
                {fields.map((field, index) => {
                  return (
                    <div
                      key={field.indexId}
                      className="mb-xsmall flex items-end last:mb-0"
                    >
                      <div className="flex-1">
                        <Controller
                          control={control}
                          key={field.indexId}
                          name={`prices.${index}.price`}
                          rules={{
                            required: FormValidator.required("Prix"),
                            validate: (val) => {
                              return FormValidator.validateMaxInteger(
                                "Prix",
                                val.amount,
                                val.currency_code
                              )
                            },
                          }}
                          defaultValue={field.price}
                          render={({ field: { onChange, value } }) => {
                            const codes = [
                              value?.currency_code,
                              ...availableCurrencies,
                            ]
                            codes.sort()
                            return (
                              <CurrencyInput.Root
                                currencyCodes={codes}
                                currentCurrency={value?.currency_code}
                                size="medium"
                                readOnly={index === 0}
                                onChange={(code) =>
                                  onChange({ ...value, currency_code: code })
                                }
                              >
                                <CurrencyInput.Amount
                                  label="Montant"
                                  onChange={(amount) =>
                                    onChange({ ...value, amount })
                                  }
                                  amount={value?.amount}
                                />
                              </CurrencyInput.Root>
                            )
                          }}
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="small"
                        className="ml-large h-10 w-10"
                        type="button"
                      >
                        <TrashIcon
                          onClick={deletePrice(index)}
                          className="text-grey-40"
                          size="20"
                        />
                      </Button>
                    </div>
                  )
                })}
              </div>
              <div className="mt-large mb-small">
                <Button
                  onClick={appendPrice}
                  type="button"
                  variant="ghost"
                  size="small"
                  disabled={availableCurrencies?.length === 0}
                >
                  <PlusIcon size={20} />
                  Ajouter un prix
                </Button>
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2 min-w-[130px] justify-center"
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="small"
                className="mr-2 min-w-[130px] justify-center"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
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

export default AddDenominationModal
