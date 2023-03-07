import clsx from "clsx"
import React from "react"
import { Controller } from "react-hook-form"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { AllocationType } from "../../../types"
import { useDiscountForm } from "../form/discount-form-context"

const DiscountAllocation = () => {
  const { control } = useDiscountForm()

  return (
    <Controller
      name="rule.allocation"
      control={control}
      rules={{ required: true }}
      render={({ field: { onChange, value } }) => {
        return (
          <RadioGroup.Root
            value={value}
            onValueChange={onChange}
            className={clsx("mt-base flex items-center gap-base px-1")}
          >
            <RadioGroup.Item
              value={AllocationType.TOTAL}
              className="flex-1"
              label="Montant total"
              description="Appliquer au montant total"
            />
            <RadioGroup.Item
              value={AllocationType.ITEM}
              className="flex-1"
              label="Spécificité de l'article"
              description="S'applique à tous les articles autorisés"
            />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default DiscountAllocation
