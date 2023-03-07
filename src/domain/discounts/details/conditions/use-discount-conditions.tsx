import { Discount } from "@medusajs/medusa"
import {
  useAdminDiscount,
  useAdminDiscountRemoveCondition,
  useAdminGetDiscountCondition,
} from "medusa-react"
import React, { useState } from "react"
import EditIcon from "../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import { ActionType } from "../../../../components/molecules/actionables"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { DiscountConditionType } from "../../types"

export const useDiscountConditions = (discount: Discount) => {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    null
  )

  const { refetch } = useAdminDiscount(discount.id)
  const { discount_condition } = useAdminGetDiscountCondition(
    discount.id,
    selectedCondition!,
    {
      expand:
        "product_collections,product_tags,product_types,customer_groups,products",
    },
    { enabled: !!selectedCondition, cacheTime: 0 }
  )
  const { mutate } = useAdminDiscountRemoveCondition(discount.id)

  const notification = useNotification()

  const removeCondition = (conditionId: string) => {
    mutate(conditionId, {
      onSuccess: () => {
        notification("Succès", "Condition supprimée", "success")
        refetch()
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
    })
  }

  const itemized = discount.rule.conditions.map((condition) => ({
    type: condition.type,
    title: getTitle(condition.type),
    description: getDescription(condition.type),
    actions: [
      {
        label: "Modifier la condition",
        icon: <EditIcon size={16} />,
        variant: "ghost",
        onClick: () => setSelectedCondition(condition.id),
      },
      {
        label: "Supprimer la condtion",
        icon: <TrashIcon size={16} />,
        variant: "danger",
        onClick: () => removeCondition(condition.id),
      },
    ] as ActionType[],
  }))

  function deSelectCondition() {
    setSelectedCondition(null)
  }

  return {
    conditions: itemized,
    selectedCondition: discount_condition,
    deSelectCondition,
  }
}

const getTitle = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Produit"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Collection"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Tag"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Type"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Groupe de client"
  }
}

const getDescription = (type: DiscountConditionType) => {
  switch (type) {
    case DiscountConditionType.PRODUCTS:
      return "Le rabais est applicable à des produits spécifiques"
    case DiscountConditionType.PRODUCT_COLLECTIONS:
      return "Le rabais est applicable à des collections spécifiques"
    case DiscountConditionType.PRODUCT_TAGS:
      return "Le rabais est applicable à des tags de produit spécifiques"
    case DiscountConditionType.PRODUCT_TYPES:
      return "Le rabais est applicable à des types de produit spécifiques"
    case DiscountConditionType.CUSTOMER_GROUPS:
      return "Le rabais est applicable à des groupes de client spécifiques"
  }
}
