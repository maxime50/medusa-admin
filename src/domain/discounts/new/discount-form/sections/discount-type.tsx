import clsx from "clsx"
import React from "react"
import { Controller, useWatch } from "react-hook-form"
import RadioGroup from "../../../../../components/organisms/radio-group"
import { DiscountRuleType } from "../../../types"
import { useDiscountForm } from "../form/discount-form-context"

const DiscountType = () => {
  const { control } = useDiscountForm()

  const regions = useWatch({
    control,
    name: "regions",
  })

  return (
    <Controller
      name="rule.type"
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
              value={DiscountRuleType.PERCENTAGE}
              className="flex-1"
              label="Pourcentage"
              description={"Rabais appliqué en %"}
            />
            <RadioGroup.Item
              value={DiscountRuleType.FIXED}
              className="flex-1"
              label="Montant fixe"
              description={"Rabais en montant fixe"}
              disabled={Array.isArray(regions) && regions.length > 1}
              disabledTooltip="Vous ne pouvez sélectionner qu'une seule région valide si vous souhaitez utiliser le type de montant fixe."
            />
            <RadioGroup.Item
              value={DiscountRuleType.FREE_SHIPPING}
              className="flex-1"
              label="Livraison gratuite"
              description={"Remplacer le montant de la livraison"}
            />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default DiscountType
