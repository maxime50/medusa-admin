import { Product } from "@medusajs/medusa"
import { useAdminDeleteProduct, useAdminUpdateProduct } from "medusa-react"
import * as React from "react"
import { useNavigate } from "react-router-dom"
import useImperativeDialog from "../../../hooks/use-imperative-dialog"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import PublishIcon from "../../fundamentals/icons/publish-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import { ActionType } from "../../molecules/actionables"
import useCopyProduct from "./use-copy-product"

const useProductActions = (product: Product) => {
  const navigate = useNavigate()
  const notification = useNotification()
  const dialog = useImperativeDialog()
  const copyProduct = useCopyProduct()
  const deleteProduct = useAdminDeleteProduct(product?.id)
  const updateProduct = useAdminUpdateProduct(product?.id)

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Supprimer le produit",
      text: "Êtes-vous sûr de vouloir supprimer ce produit ?",
    })

    if (shouldDelete) {
      deleteProduct.mutate()
    }
  }

  const getActions = (): ActionType[] => [
    {
      label: "Modifier",
      onClick: () => navigate(`/a/products/${product.id}`),
      icon: <EditIcon size={20} />,
    },
    {
      label: product.status === "published" ? "Dépublier" : "Publier",
      onClick: () => {
        const newStatus = product.status === "published" ? "brouillon" : "publié"
        updateProduct.mutate(
          {
            status: newStatus,
          },
          {
            onSuccess: () => {
              notification(
                "Succès",
                `Produit ${product.status === "published" ? "non publié" : "publié"
                } avec succès`,
                "success"
              )
            },
            onError: (err) =>
              notification("Erreur", getErrorMessage(err), "error"),
          }
        )
      },
      icon:
        product.status === "published" ? (
          <UnpublishIcon size={20} />
        ) : (
          <PublishIcon size={20} />
        ),
    },
    {
      label: "Dupliquer",
      onClick: () => copyProduct(product),
      icon: <DuplicateIcon size={20} />,
    },
    {
      label: "Supprimer",
      variant: "danger",
      onClick: handleDelete,
      icon: <TrashIcon size={20} />,
    },
  ]

  return {
    getActions,
  }
}

export default useProductActions
