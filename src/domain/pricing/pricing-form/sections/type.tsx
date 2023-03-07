import React from "react"
import { Controller } from "react-hook-form"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { usePriceListForm } from "../form/pricing-form-context"
import { PriceListType } from "../types"

const Type = () => {
  const { control } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      value="type"
      title="Type de liste de prix"
      description="Sélectionner le type de liste de prix"
      tooltip="Contrairement aux prix de vente, une annulation de prix n'indiquera pas au client que le prix fait partie d'une vente."
    >
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => {
          return (
            <RadioGroup.Root
              value={value ?? undefined}
              onValueChange={onChange}
              className="accordion-margin-transition flex items-center gap-base group-radix-state-open:mt-5"
            >
              <RadioGroup.Item
                value={PriceListType.SALE}
                className="flex-1"
                label="Vente"
                description="Utilisez cette option si vous créez des prix pour une vente."
              />
              <RadioGroup.Item
                value={PriceListType.OVERRIDE}
                className="flex-1"
                label="Remplacement"
                description="Option pour remplacer des prix"
              />
            </RadioGroup.Root>
          )
        }}
      />
    </Accordion.Item>
  )
}

export default Type
