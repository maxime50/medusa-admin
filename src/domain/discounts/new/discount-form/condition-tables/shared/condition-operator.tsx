import React from "react"
import RadioGroup from "../../../../../../components/organisms/radio-group"
import { DiscountConditionOperator } from "../../../../types"

type ConditionOperatorProps = {
  value: "in" | "not_in"
  onChange: (value: DiscountConditionOperator) => void
}

const ConditionOperator: React.FC<ConditionOperatorProps> = ({
  value,
  onChange,
}) => {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={onChange}
      className="mb-4 grid grid-cols-2 gap-base"
    >
      <RadioGroup.Item
        className="w-full"
        label="Doit être"
        value={DiscountConditionOperator.IN}
        description="S'applique aux articles sélectionnés"
      />
      <RadioGroup.Item
        className="w-full"
        label="Ne doit pas être"
        value={DiscountConditionOperator.NOT_IN}
        description="S'applique à tous les articles excepté ceux qui sont sélectionnés"
      />
    </RadioGroup.Root>
  )
}

export default ConditionOperator
