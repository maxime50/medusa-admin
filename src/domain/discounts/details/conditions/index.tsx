import { Discount } from "@medusajs/medusa"
import React, { useState } from "react"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import NumberedItem from "../../../../components/molecules/numbered-item"
import BodyCard from "../../../../components/organisms/body-card"
import AddCondition from "./add-condition"
import { ConditionsProvider } from "./add-condition/conditions-provider"
import EditConditionsModal from "./edit-condition/edit-condition-modal"
import { useDiscountConditions } from "./use-discount-conditions"

type DiscountDetailsConditionsProps = {
  discount: Discount
}

const DiscountDetailsConditions: React.FC<DiscountDetailsConditionsProps> = ({
  discount,
}) => {
  const [show, setShow] = useState(false)

  const { conditions, selectedCondition, deSelectCondition } =
    useDiscountConditions(discount)

  return (
    <ConditionsProvider discount={discount}>
      <BodyCard
        title="Conditions"
        className="min-h-[200px]"
        forceDropdown
        actionables={[
          {
            label: "Ajouter une condition",
            icon: <PlusIcon size={16} />,
            onClick: () => setShow(true),
          },
        ]}
      >
        {conditions.length ? (
          <div
            style={{
              gridTemplateRows: `repeat(${Math.ceil(
                conditions?.length / 2
              )}, minmax(0, 1fr))`,
            }}
            className="grid grid-flow-col grid-cols-2 gap-y-base gap-x-xlarge"
          >
            {conditions.map((condition, i) => (
              <NumberedItem
                key={i}
                title={condition.title}
                index={i + 1}
                description={condition.description}
                actions={condition.actions}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-y-small">
            <span className="inter-base-regular text-grey-50">
              Ce rabais n'a pas de conditions
            </span>
          </div>
        )}
      </BodyCard>
      <AddCondition show={show} onClose={() => setShow(false)} />
      {selectedCondition && (
        <EditConditionsModal
          open={!!selectedCondition}
          condition={selectedCondition}
          discount={discount}
          onClose={() => deSelectCondition()}
        />
      )}
    </ConditionsProvider>
  )
}

export default DiscountDetailsConditions
