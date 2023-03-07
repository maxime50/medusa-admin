import React from "react"

import Actionables from "../../../components/molecules/actionables"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Badge from "../../../components/fundamentals/badge"

export const TaxRuleItem = ({ onEdit, onDelete, index, name, description }) => {
  return (
    <div className="flex items-center gap-base rounded-rounded border p-base">
      <div>
        <Badge
          className="inter-base-semibold flex h-[40px] w-[40px] items-center justify-center"
          variant="default"
        >
          §{index}
        </Badge>
      </div>
      <div className="flex-1">
        <div className="inter-small-semibold">{name}</div>
        <div className="inter-small-regular text-grey-50">{description}</div>
      </div>
      <div>
        <Actionables
          forceDropdown
          actions={[
            {
              label: "Modifier",
              onClick: () => onEdit(),
              icon: <EditIcon size={20} />,
            },
            {
              label: "Supprimer la règle",
              variant: "danger",
              onClick: () => onDelete(),
              icon: <TrashIcon size={20} />,
            },
          ]}
        />
      </div>
    </div>
  )
}
