import { PriceList } from "@medusajs/medusa"
import clsx from "clsx"
import { useAdminCustomerGroups } from "medusa-react"
import React, { useState } from "react"
import { Controller } from "react-hook-form"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../components/atoms/switch"
import Select from "../../../../components/molecules/select"
import Accordion from "../../../../components/organisms/accordion"
import { weekFromNow } from "../../../../utils/date-utils"
import { usePriceListForm } from "../form/pricing-form-context"
import { ConfigurationFields } from "../types"

type ConfigurationProps = {
  priceList?: PriceList
}

const checkForEnabledConfigs = (config: ConfigurationFields): string[] => {
  const enabledConfigs: string[] = []

  if (config.customer_groups && config.customer_groups.length > 0) {
    enabledConfigs.push("customer_groups")
  }
  if (config.starts_at) {
    enabledConfigs.push("starts_at")
  }
  if (config.ends_at) {
    enabledConfigs.push("ends_at")
  }

  return enabledConfigs
}

const Configuration: React.FC<ConfigurationProps> = () => {
  const { customer_groups, isLoading } = useAdminCustomerGroups()
  const { control, handleConfigurationSwitch, configFields } =
    usePriceListForm()
  const [openItems, setOpenItems] = useState<string[]>(
    checkForEnabledConfigs(configFields)
  )

  return (
    <Accordion.Item
      forceMountContent
      title="Configuration"
      tooltip="Configuration optionnelle pour la liste de prix"
      value="configuration"
      description="Les remplacements de prix s'appliquent à partir du moment où vous cliquez sur le bouton publier."
    >
      <Accordion
        type="multiple"
        value={openItems}
        onValueChange={(values) => {
          handleConfigurationSwitch(values)
          setOpenItems(values)
        }}
      >
        <div className="mt-5">
          <Accordion.Item
            headingSize="medium"
            forceMountContent
            className="border-b-0"
            title="Date de début ?"
            subtitle="Programmer les remplacements de prix pour qu'ils soient activées ultérieurement."
            value="starts_at"
            customTrigger={
              <Switch checked={openItems.indexOf("starts_at") > -1} />
            }
          >
            <div
              className={clsx(
                "accordion-margin-transition flex items-center gap-xsmall",
                {
                  "mt-4": openItems.indexOf("starts_at") > -1,
                }
              )}
            >
              <Controller
                name="starts_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  const ensuredDate = value || new Date()
                  return (
                    <>
                      <DatePicker
                        date={ensuredDate}
                        label="Date de début"
                        onSubmitDate={onChange}
                      />
                      <TimePicker
                        date={ensuredDate}
                        label="Date de début"
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
            title="Date d'expiration ?"
            subtitle="Programmer les remplacements de prix pour les désactiver à l'avenir."
            value="ends_at"
            customTrigger={
              <Switch checked={openItems.indexOf("ends_at") > -1} />
            }
          >
            <div
              className={clsx(
                "accordion-margin-transition flex items-center gap-xsmall",
                {
                  "mt-4": openItems.indexOf("ends_at") > -1,
                }
              )}
            >
              <Controller
                name="ends_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  const ensuredDate = value || weekFromNow()
                  return (
                    <>
                      <DatePicker
                        date={ensuredDate}
                        label="Date de fin"
                        onSubmitDate={onChange}
                      />
                      <TimePicker
                        date={ensuredDate}
                        label="Date de fin"
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
            title="Disponibilité des clients"
            subtitle="Spécifiez les groupes de clients pour lesquels les remplacements de prix doivent s'appliquer."
            value="customer_groups"
            customTrigger={
              <Switch checked={openItems.indexOf("customer_groups") > -1} />
            }
          >
            <Controller
              name="customer_groups"
              control={control}
              render={({ field: { value, onChange, ref } }) => {
                return (
                  <div
                    className={clsx(
                      "accordion-margin-transition flex w-full items-center gap-xsmall",
                      {
                        "mt-4": openItems.indexOf("customer_groups") > -1,
                      }
                    )}
                  >
                    <Select
                      value={value}
                      label="Groupes de clients"
                      onChange={onChange}
                      isMultiSelect
                      fullWidth
                      enableSearch
                      hasSelectAll
                      isLoading={isLoading}
                      options={
                        customer_groups?.map((cg) => ({
                          label: cg.name,
                          value: cg.id,
                        })) || []
                      }
                      ref={ref}
                    />
                  </div>
                )
              }}
            />
          </Accordion.Item>
        </div>
      </Accordion>
    </Accordion.Item>
  )
}

export default Configuration
