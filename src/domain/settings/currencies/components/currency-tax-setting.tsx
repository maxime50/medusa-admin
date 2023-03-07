import { Currency } from "@medusajs/medusa"
import { useQueryClient } from "@tanstack/react-query"
import { adminStoreKeys, useAdminUpdateCurrency } from "medusa-react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import CoinsIcon from "../../../../components/fundamentals/icons/coins-icon"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type CurrencyTaxSettingFormType = {
  includes_tax: boolean
}

type Props = {
  currency: Currency
  isDefault: boolean
}

const CurrencyTaxSetting = ({ currency, isDefault }: Props) => {
  const queryClient = useQueryClient()
  const { mutate } = useAdminUpdateCurrency(currency.code)
  const { handleSubmit, control, reset } = useForm<CurrencyTaxSettingFormType>({
    defaultValues: {
      includes_tax: currency.includes_tax,
    },
  })

  const notification = useNotification()

  useEffect(() => {
    reset({
      includes_tax: currency.includes_tax,
    })
  }, [currency])

  const onSubmit = handleSubmit((data: CurrencyTaxSettingFormType) => {
    mutate(data, {
      onSuccess: () => {
        notification("Succès", "Devise mise à jour avec succès", "success")

        // When we update a currency, we need to invalidate the store in order for this change to be reflected across admin
        queryClient.invalidateQueries(adminStoreKeys.all)
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
        reset({
          includes_tax: currency.includes_tax,
        })
      },
    })
  })

  return (
    <form>
      <div className="inter-base-regular flex items-center justify-between">
        <div className="flex items-center gap-x-base">
          <div className="flex h-xlarge w-xlarge items-center justify-center rounded-rounded bg-grey-10">
            <CoinsIcon size={20} className="text-grey-50" />
          </div>
          <div className="flex items-center gap-x-xsmall">
            <p className="inter-base-semibold text-grey-90">
              {currency.code.toUpperCase()}
            </p>
            <p className="inter-small-regular text-grey-50">{currency.name}</p>
          </div>
          {isDefault && (
            <div className="rounded-rounded bg-grey-10 py-[2px] px-xsmall">
              <p className="inter-small-semibold text-grey-50">Par défaut</p>
            </div>
          )}
        </div>
        <Controller
          control={control}
          name="includes_tax"
          render={({ field: { value, onChange } }) => {
            return (
              <Switch
                checked={value}
                onCheckedChange={(data) => {
                  onChange(data)
                  onSubmit()
                }}
              />
            )
          }}
        />
      </div>
    </form>
  )
}

export default CurrencyTaxSetting
