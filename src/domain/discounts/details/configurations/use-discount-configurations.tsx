import { Discount } from "@medusajs/medusa"
import { parse } from "iso8601-duration"
import { useAdminUpdateDiscount } from "medusa-react"
import moment from "moment"
import React, { ReactNode } from "react"
import ClockIcon from "../../../../components/fundamentals/icons/clock-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { removeNullish } from "../../../../utils/remove-nullish"

type displaySetting = {
  title: string
  description: ReactNode
  actions?: ActionType[]
}

const DisplaySettingsDateDescription = ({ date }: { date: Date }) => (
  <div className="inter-small-regular flex text-grey-50 ">
    {moment.utc(date).format("ddd, DD MMM YYYY")}
    <span className="ml-3 flex items-center">
      <ClockIcon size={16} />
      <span className="ml-2.5">{moment.utc(date).format("UTC HH:mm")}</span>
    </span>
  </div>
)

const CommonDescription = ({ text }) => (
  <span className="inter-small-regular text-grey-50">{text}</span>
)

const useDiscountConfigurations = (discount: Discount) => {
  const updateDiscount = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const conditions: displaySetting[] = []

  conditions.push({
    title: "Date de début",
    description: <DisplaySettingsDateDescription date={discount.starts_at} />,
  })

  if (discount.ends_at) {
    conditions.push({
      title: "Date de fin",
      description: <DisplaySettingsDateDescription date={discount.ends_at} />,
      actions: [
        {
          label: "Supprimer la configuration",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { ends_at: null },
              {
                onSuccess: () => {
                  notification(
                    "Succès",
                    "Date de fin du rabais supprimée",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Erreur", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.usage_limit) {
    conditions.push({
      title: "Nombre d'utilisations",
      description: (
        <CommonDescription text={discount.usage_limit.toLocaleString("en")} />
      ),
      actions: [
        {
          label: "Supprimer la configuration",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { usage_limit: null },
              {
                onSuccess: () => {
                  notification(
                    "Succès",
                    "Limite de nombre d'utilisation supprimée",
                    "success"
                  )
                },
                onError: (error) => {
                  notification("Erreur", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }
  if (discount.valid_duration) {
    conditions.push({
      title: "Duration",
      description: (
        <CommonDescription
          text={Object.entries(removeNullish(parse(discount.valid_duration)))
            .map(([key, value]) => `${value} ${key}`)
            .join(", ")}
        />
      ),
      actions: [
        {
          label: "Supprimer le paramètre",
          icon: <TrashIcon size={20} />,
          variant: "danger",
          onClick: async () =>
            await updateDiscount.mutateAsync(
              { valid_duration: null },
              {
                onSuccess: () => {
                  notification("Succès", "Durée du rabais supprimée", "success")
                },
                onError: (error) => {
                  notification("Erreur", getErrorMessage(error), "error")
                },
              }
            ),
        },
      ],
    })
  }

  return conditions
}

export default useDiscountConfigurations
