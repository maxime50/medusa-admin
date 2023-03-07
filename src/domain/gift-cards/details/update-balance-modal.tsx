import { AdminPostGiftCardsGiftCardReq, GiftCard } from "@medusajs/medusa"
import clsx from "clsx"
import React from "react"
import { Controller, useForm, useWatch } from "react-hook-form"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import Modal from "../../../components/molecules/modal"
import CurrencyInput from "../../../components/organisms/currency-input"

type UpdateBalanceModalProps = {
  handleClose: () => void
  handleSave: (update: AdminPostGiftCardsGiftCardReq) => void
  currencyCode: string
  giftCard: GiftCard
  updating: boolean
}

type UpdateBalanceModalFormData = {
  balance: number
}

const UpdateBalanceModal = ({
  handleClose,
  handleSave,
  currencyCode,
  giftCard,
  updating,
}: UpdateBalanceModalProps) => {
  const { control, handleSubmit } = useForm<UpdateBalanceModalFormData>({
    defaultValues: {
      balance: giftCard.balance,
    },
  })

  const balance = useWatch({
    control,
    name: "balance",
  })

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <form onSubmit={handleSubmit(handleSave)}>
          <Modal.Header handleClose={handleClose}>
            <span className="inter-xlarge-semibold">
              Mettre à jour la balance
            </span>
            <span
              className={clsx(
                "inter-small-regular mt-2xsmall text-rose-50 transition-display delay-75",
                {
                  hidden: !(balance > giftCard.value),
                }
              )}
            >
              Le solde ne peut pas être mis à jour à une valeur supérieure au
              montant initial.
            </span>
          </Modal.Header>
          <Modal.Content>
            <CurrencyInput.Root
              readOnly
              currentCurrency={currencyCode}
              size="small"
            >
              <Controller
                control={control}
                name="balance"
                rules={{
                  required: true,
                }}
                render={({ field: { value, onChange } }) => {
                  return (
                    <CurrencyInput.Amount
                      amount={value}
                      label="Prix"
                      onChange={onChange}
                    />
                  )
                }}
              />
            </CurrencyInput.Root>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button
                variant="ghost"
                size="small"
                onClick={handleClose}
                className="mr-2"
                type="button"
              >
                Annuler
              </Button>
              <Button
                loading={updating}
                variant="primary"
                className="min-w-[100px]"
                size="small"
                type="submit"
                disabled={balance > giftCard.value || updating}
              >
                {balance > giftCard.value ? (
                  <Tooltip content="Le solde est supérieur à la valeur initiale">
                    Sauvegarder
                  </Tooltip>
                ) : (
                  "Sauvegarder"
                )}
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}
export default UpdateBalanceModal
