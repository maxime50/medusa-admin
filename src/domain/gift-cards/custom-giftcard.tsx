import { useAdminCreateGiftCard, useAdminRegions } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Button from "../../components/fundamentals/button"
import InputField from "../../components/molecules/input"
import Modal from "../../components/molecules/modal"
import Select from "../../components/molecules/select"
import TextArea from "../../components/molecules/textarea"
import CurrencyInput from "../../components/organisms/currency-input"
import useNotification from "../../hooks/use-notification"
import { getErrorMessage } from "../../utils/error-messages"
import { focusByName } from "../../utils/focus-by-name"
import { validateEmail } from "../../utils/validate-email"

type CustomGiftcardProps = {
  onDismiss: () => void
}

const CustomGiftcard: React.FC<CustomGiftcardProps> = ({ onDismiss }) => {
  const { isLoading, regions } = useAdminRegions()
  const [selectedRegion, setSelectedRegion] = useState<any>(null)
  const [giftCardAmount, setGiftCardAmount] = useState(0)

  const { register, handleSubmit } = useForm()

  const notification = useNotification()

  const { mutate, isLoading: isSubmitting } = useAdminCreateGiftCard()

  useEffect(() => {
    if (!isLoading) {
      setSelectedRegion({
        value: regions[0],
        label: regions[0].name,
      })
    }
  }, [isLoading])

  const onSubmit = (data) => {
    if (!giftCardAmount) {
      notification("Erreur", "Veuillez indiquer un montant", "error")
      focusByName("amount")
      return
    }

    if (!validateEmail(data.metadata.email)) {
      notification("Erreur", "Adresse courriel invalide", "error")
      focusByName("metadata.email")
      return
    }

    const update = {
      region_id: selectedRegion.value.id,
      value: Math.round(
        giftCardAmount / (1 + selectedRegion.value.tax_rate / 100)
      ),
      ...data,
    }

    mutate(update, {
      onSuccess: () => {
        notification(
          "Succès",
          "Carte cadeau personnalisée créée avec succès",
          "success"
        )
        onDismiss()
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
        onDismiss()
      },
    })
  }

  return (
    <Modal handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Carte Cadeau Personnalisée</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-base-semibold">Valeur</span>
            <div className="mt-4 flex gap-x-2xsmall">
              <div className="w-[267px]">
                <Select
                  label={"Région"}
                  value={selectedRegion}
                  onChange={(value) => setSelectedRegion(value)}
                  options={
                    regions?.map((r) => ({
                      value: r,
                      label: r.name,
                    })) || []
                  }
                />
              </div>
              <div className="w-[415px]">
                <CurrencyInput.Root
                  size="medium"
                  currencyCodes={
                    isLoading ? undefined : regions?.map((r) => r.currency_code)
                  }
                  readOnly
                  currentCurrency={selectedRegion?.value?.currency_code}
                >
                  <CurrencyInput.Amount
                    label={"Montant"}
                    amount={giftCardAmount}
                    onChange={(value) => {
                      setGiftCardAmount(value || 0)
                    }}
                    name="amount"
                    required={true}
                  />
                </CurrencyInput.Root>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <span className="inter-base-semibold">Destinataire</span>
            <div className="mt-4 grid grid-cols-1 gap-y-xsmall">
              <InputField
                label={"Courriel"}
                required
                {...register("metadata.email", { required: true })}
                placeholder="exemple@hotmail.com"
                type="email"
              />
              <TextArea
                className="mt-3"
                label={"Message personnel"}
                rows={7}
                placeholder="Quelque chose de gentil pour quelqu'un de spécial"
                {...register("metadata.personal_message")}
              />
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end gap-x-xsmall">
            <Button
              variant="ghost"
              onClick={onDismiss}
              size="small"
              className="w-[112px]"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              onClick={handleSubmit(onSubmit)}
              size="small"
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Créer & Envoyer
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CustomGiftcard
