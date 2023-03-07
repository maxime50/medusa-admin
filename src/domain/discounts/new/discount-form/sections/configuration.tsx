import { Discount } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import DatePicker from "../../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../../components/atoms/switch"
import AvailabilityDuration from "../../../../../components/molecules/availability-duration"
import InputField from "../../../../../components/molecules/input"
import Accordion from "../../../../../components/organisms/accordion"
import { useDiscountForm } from "../form/discount-form-context"

type SettingsProps = {
  isEdit?: boolean
  promotion?: Discount
}

const getActiveTabs = (promotion: Discount) => {
  const activeTabs: string[] = []

  if (promotion.usage_limit !== null) {
    activeTabs.push("usage_limit")
  }

  if (promotion.starts_at !== null) {
    activeTabs.push("starts_at")
  }

  if (promotion.ends_at !== null) {
    activeTabs.push("ends_at")
  }

  if (promotion.valid_duration !== null) {
    activeTabs.push("valid_duration")
  }

  return activeTabs
}

const Settings: React.FC<SettingsProps> = ({ promotion, isEdit = false }) => {
  const {
    register,
    control,
    isDynamic,
    hasExpiryDate,
    handleConfigurationChanged,
  } = useDiscountForm()

  const [openItems, setOpenItems] = React.useState<string[]>(
    isEdit && promotion
      ? getActiveTabs(promotion)
      : [...(hasExpiryDate ? ["ends_at"] : [])]
  )

  const marginTransition =
    "transition-[margin] duration-300 ease-[cubic-bezier(0.87, 0, 0.13, 1) forwards]"

  const [render, setRender] = useState(false)
  useEffect(() => {
    setTimeout(() => setRender(true), 300)
  }, [])

  return (
    <div className="flex flex-col">
      <Accordion
        className="pt-7 text-grey-90"
        type="multiple"
        value={openItems || []}
        onValueChange={(values) => {
          handleConfigurationChanged(values)

          setOpenItems(values)
        }}
      >
        {render && (
          <>
            <Accordion.Item
              headingSize="medium"
              forceMountContent
              className="border-b-0"
              title="Date de départ"
              subtitle="Programmer l'activation du rabais dans le futur."
              tooltip="Si vous souhaitez programmer l'activation de la réduction dans le futur, vous pouvez définir ici une date de début, sinon la réduction sera active immédiatement."
              value="starts_at"
              customTrigger={
                <Switch checked={openItems.indexOf("starts_at") > -1} />
              }
            >
              <div
                className={clsx(
                  "flex items-center gap-xsmall",
                  marginTransition,
                  {
                    "mt-4": openItems.indexOf("starts_at") > -1,
                  }
                )}
              >
                <Controller
                  name="starts_at"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    const date = value || new Date()
                    return (
                      <>
                        <DatePicker
                          date={date}
                          label="Start date"
                          onSubmitDate={onChange}
                        />
                        <TimePicker
                          label="Start time"
                          date={date}
                          onSubmitDate={onChange}
                        />
                      </>
                    )
                  }}
                />
              </div>
            </Accordion.Item>
            <Accordion.Item
              headingSize="medium"
              forceMountContent
              className="border-b-0"
              title="La remise a une date d'expiration ?"
              subtitle="Programmer la désactivation de la remise dans le futur."
              tooltip="Si vous souhaitez programmer la désactivation de la remise à l'avenir, vous pouvez fixer une date d'expiration ici."
              value="ends_at"
              customTrigger={
                <Switch checked={openItems.indexOf("ends_at") > -1} />
              }
            >
              <div
                className={clsx(
                  "flex items-center gap-xsmall",
                  marginTransition,
                  {
                    "mt-4": openItems.indexOf("ends_at") > -1,
                  }
                )}
              >
                <Controller
                  name="ends_at"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    const date =
                      value ||
                      new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    return (
                      <>
                        <DatePicker
                          date={date}
                          label="Date d'expiration"
                          onSubmitDate={onChange}
                        />
                        <TimePicker
                          label="Heure de fin"
                          date={date}
                          onSubmitDate={onChange}
                        />
                      </>
                    )
                  }}
                />
              </div>
            </Accordion.Item>
            <Accordion.Item
              headingSize="medium"
              forceMountContent
              className="border-b-0"
              title="Limiter le nombre d'utilisations"
              subtitle="La limite s'applique à tous les clients de la boutiques"
              tooltip="Si vous souhaitez limiter le nombre de fois qu'un client peut bénéficier de cette réduction, vous pouvez fixer une limite ici."
              value="usage_limit"
              customTrigger={
                <Switch checked={openItems.indexOf("usage_limit") > -1} />
              }
            >
              <div
                className={clsx(marginTransition, {
                  "mt-4": openItems.indexOf("usage_limit") > -1,
                })}
              >
                <InputField
                  {...register("usage_limit", { valueAsNumber: true })}
                  label="Nombre d'utilisations"
                  type="number"
                  placeholder="5"
                  min={1}
                />
              </div>
            </Accordion.Item>

            {isDynamic && (
              <Accordion.Item
                disabled={!isDynamic}
                headingSize="medium"
                forceMountContent
                title="Durée de la disponibilité ?"
                className="border-b-0"
                subtitle="Définir la duration du rabais"
                tooltip="Sélectionner un type de rabais"
                value="valid_duration"
                customTrigger={
                  <Switch checked={openItems.indexOf("valid_duration") > -1} />
                }
              >
                <div
                  className={clsx(marginTransition, {
                    "mt-4": openItems.indexOf("valid_duration") > -1,
                  })}
                >
                  <Controller
                    name="valid_duration"
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <AvailabilityDuration
                          value={value ?? undefined}
                          onChange={onChange}
                        />
                      )
                    }}
                  />
                </div>
              </Accordion.Item>
            )}
          </>
        )}
      </Accordion>
    </div>
  )
}

export default Settings
