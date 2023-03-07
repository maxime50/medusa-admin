import { Order } from "@medusajs/medusa"
import { useAdminRefundPayment } from "medusa-react"
import React, { useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"

import Button from "../../../../components/fundamentals/button"
import AlertIcon from "../../../../components/fundamentals/icons/alert-icon"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import Select from "../../../../components/molecules/select"
import TextArea from "../../../../components/molecules/textarea"
import CurrencyInput from "../../../../components/organisms/currency-input"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"
import FormValidator from "../../../../utils/form-validator"

type RefundMenuFormData = {
  amount: number
  reason: Option
  no_notification: boolean
  note?: string
}

const reasonOptions = [
  { label: "Rabais", value: "discount" },
  { label: "Autre", value: "other" },
]

type RefundMenuProps = {
  order: Order
  onDismiss: () => void
  initialAmount?: number
  initialReason: "other" | "discount"
}

const RefundMenu = ({
  order,
  onDismiss,
  initialAmount,
  initialReason,
}: RefundMenuProps) => {
  const { register, handleSubmit, control } = useForm<RefundMenuFormData>({
    defaultValues: {
      amount: initialAmount,
      reason: reasonOptions[initialReason === "other" ? 1 : 0],
    },
  })

  const [noNotification, setNoNotification] = useState(order.no_notification)

  const notification = useNotification()
  const { mutate, isLoading } = useAdminRefundPayment(order.id)

  const refundable = useMemo(() => {
    return order.paid_total - order.refunded_total
  }, [order])

  const handleValidateRefundAmount = (value) => {
    return value <= refundable
  }

  const onSubmit = (data: RefundMenuFormData) => {
    mutate(
      {
        amount: data.amount,
        reason: data.reason.value,
        no_notification: noNotification,
        note: data.note,
      },
      {
        onSuccess: () => {
          notification("Succès", "Commande remboursée avec succès", "success")
          onDismiss()
        },
        onError: (error) => {
          notification("Erreur", getErrorMessage(error), "error")
        },
      }
    )
  }

  const isSystemPayment = order.payments.some((p) => p.provider_id === "system")

  return (
    <Modal handleClose={onDismiss}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          <Modal.Header handleClose={onDismiss}>
            <h2 className="inter-xlarge-semibold">Rembourser</h2>
          </Modal.Header>
          <Modal.Content>
            {isSystemPayment && (
              <div className="inter-small-regular mb-6 flex rounded-rounded bg-orange-5 p-4 text-orange-50">
                <div className="mr-3 h-full">
                  <AlertIcon size={20} />
                </div>
                <div className="flex flex-col">
                  <span className="inter-small-semibold">Attention !</span>
                  Un ou plusieurs de vos paiements sont des paiements de
                  système. Les captures et les remboursements ne sont pas gérés
                  par ce logiciel.
                </div>
              </div>
            )}
            <span className="inter-base-semibold">Détails</span>
            <div className="mt-4 grid gap-y-base">
              <CurrencyInput.Root
                size="small"
                currentCurrency={order.currency_code}
                readOnly
              >
                <Controller
                  name="amount"
                  control={control}
                  rules={{
                    required: FormValidator.required("Montant"),
                    min: FormValidator.min("Montant", 1),
                    max: FormValidator.maxInteger(
                      "Montant",
                      order.currency_code
                    ),
                  }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <CurrencyInput.Amount
                      label={"Montant à rembourser"}
                      amount={value}
                      onBlur={onBlur}
                      invalidMessage={`On ne peut pas rembourser plus que le total net de la commande.`}
                      onValidate={handleValidateRefundAmount}
                      onChange={onChange}
                    />
                  )}
                />
              </CurrencyInput.Root>
              <Controller
                name="reason"
                control={control}
                defaultValue={{ label: "Rabais", value: "discount" }}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <Select
                    label="Raison"
                    options={reasonOptions}
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
              <TextArea
                {...register("note")}
                label="Note"
                placeholder="Rabais pour les clients fidèles"
              />
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full  justify-between">
              <div
                className="flex h-full cursor-pointer items-center"
                onClick={() => setNoNotification(!noNotification)}
              >
                <div
                  className={`flex h-5 w-5 justify-center rounded-base border border-grey-30 text-grey-0 ${
                    !noNotification && "bg-violet-60"
                  }`}
                >
                  <span className="self-center">
                    {!noNotification && <CheckIcon size={16} />}
                  </span>
                </div>
                <input
                  id="noNotification"
                  className="hidden"
                  name="noNotification"
                  checked={!noNotification}
                  onChange={() => setNoNotification(!noNotification)}
                  type="checkbox"
                />
                <span className="ml-3 flex items-center gap-x-xsmall text-grey-90">
                  Envoyer une notification
                  <IconTooltip content="Notify customer of created return" />
                </span>
              </div>
              <div className="flex gap-x-xsmall">
                <Button
                  onClick={onDismiss}
                  size="small"
                  className="w-[112px]"
                  variant="ghost"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  size="small"
                  className="w-[112px]"
                  variant="primary"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Compléter
                </Button>
              </div>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default RefundMenu
