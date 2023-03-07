import {
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsProductVariantsVariantReq,
} from "@medusajs/medusa"
import {
  useAdminCreateVariant,
  useAdminDeleteProduct,
  useAdminDeleteVariant,
  useAdminProduct,
  useAdminUpdateProduct,
  useAdminUpdateVariant,
} from "medusa-react"
import { useNavigate } from "react-router-dom"
import useImperativeDialog from "../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

const useEditProductActions = (productId: string) => {
  const dialog = useImperativeDialog()
  const navigate = useNavigate()
  const notification = useNotification()
  const getProduct = useAdminProduct(productId)
  const updateProduct = useAdminUpdateProduct(productId)
  const deleteProduct = useAdminDeleteProduct(productId)
  const updateVariant = useAdminUpdateVariant(productId)
  const deleteVariant = useAdminDeleteVariant(productId)
  const addVariant = useAdminCreateVariant(productId)

  const onDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Supprimer le produit",
      text: "Êtes-vous sûr de vouloir supprimer ce produit ?",
    })
    if (shouldDelete) {
      deleteProduct.mutate(undefined, {
        onSuccess: () => {
          notification("Succès", "Produit supprimé avec succès", "success")
          navigate("/a/products/")
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      })
    }
  }

  const onAddVariant = (
    payload: AdminPostProductsProductVariantsReq,
    onSuccess: () => void,
    successMessage = "La variante a été créée avec succès"
  ) => {
    addVariant.mutate(payload, {
      onSuccess: () => {
        notification("Succès", successMessage, "success")
        getProduct.refetch()
        onSuccess()
      },
      onError: (err) => {
        notification("Erreur", getErrorMessage(err), "error")
      },
    })
  }

  const onUpdateVariant = (
    id: string,
    payload: Partial<AdminPostProductsProductVariantsVariantReq>,
    onSuccess: () => void,
    successMessage = "La variante a été mise à jour avec succès"
  ) => {
    updateVariant.mutate(
      // @ts-ignore - TODO fix type on request
      { variant_id: id, ...payload },
      {
        onSuccess: () => {
          notification("Succès", successMessage, "success")
          getProduct.refetch()
          onSuccess()
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      }
    )
  }

  const onDeleteVariant = (
    variantId: string,
    onSuccess?: () => void,
    successMessage = "La variante a été supprimée avec succès"
  ) => {
    deleteVariant.mutate(variantId, {
      onSuccess: () => {
        notification("Succès", successMessage, "success")
        getProduct.refetch()
        if (onSuccess) {
          onSuccess()
        }
      },
      onError: (err) => {
        notification("Erreur", getErrorMessage(err), "error")
      },
    })
  }

  const onUpdate = (
    payload: Partial<AdminPostProductsProductReq>,
    onSuccess: () => void,
    successMessage = "Le produit a été mis à jour avec succès"
  ) => {
    updateProduct.mutate(
      // @ts-ignore TODO fix images being required
      payload,
      {
        onSuccess: () => {
          notification("Succès", successMessage, "success")
          onSuccess()
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      }
    )
  }

  const onStatusChange = (currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "brouillon" : "publié"
    updateProduct.mutate(
      {
        // @ts-ignore TODO fix update type in API
        status: newStatus,
      },
      {
        onSuccess: () => {
          const pastTense = newStatus === "published" ? "publié" : "brouillon"
          notification("Succès", `Produit ${pastTense} avec succès`, "success")
        },
        onError: (err) => {
          notification("Oups", getErrorMessage(err), "error")
        },
      }
    )
  }

  return {
    getProduct,
    onDelete,
    onStatusChange,
    onUpdate,
    onAddVariant,
    onUpdateVariant,
    onDeleteVariant,
    updating: updateProduct.isLoading,
    deleting: deleteProduct.isLoading,
    addingVariant: addVariant.isLoading,
    updatingVariant: updateVariant.isLoading,
    deletingVariant: deleteVariant.isLoading,
  }
}

export default useEditProductActions
