import { Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import useNotification from "../../../../../hooks/use-notification"
import { FormImage } from "../../../../../types/shared"
import { prepareImages } from "../../../../../utils/images"
import { nestedForm } from "../../../../../utils/nested-form"
import MediaForm, { MediaFormType } from "../../../components/media-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  product: Product
  open: boolean
  onClose: () => void
}

type MediaFormWrapper = {
  media: MediaFormType
}

const MediaModal = ({ product, open, onClose }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const form = useForm<MediaFormWrapper>({
    defaultValues: getDefaultValues(product),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const notification = useNotification()

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const onReset = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit(async (data) => {
    let preppedImages: FormImage[] = []

    try {
      preppedImages = await prepareImages(data.media.images)
    } catch (error) {
      let errorMessage =
        "Un problème s'est produit lors du téléchargement des images."
      const response = (error as any).response as Response

      if (response.status === 500) {
        errorMessage =
          errorMessage +
          " " +
          "Il se peut qu'aucun service de fichiers ne soit configuré."
      }

      notification("Erreur", errorMessage, "error")
      return
    }
    const urls = preppedImages.map((image) => image.url)

    onUpdate(
      {
        images: urls,
      },
      onReset
    )
  })

  return (
    <Modal open={open} handleClose={onReset} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onReset}>
          <h1 className="inter-xlarge-semibold m-0">Téléverser des images</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <div>
              <h2 className="inter-large-semibold mb-2xsmall">Images</h2>
              <p className="inter-base-regular mb-large text-grey-50">
                Ajouter des images supplémentaires au produit
              </p>
              <div>
                <MediaForm form={nestedForm(form, "media")} />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-x-2">
              <Button
                size="small"
                variant="secondary"
                type="button"
                onClick={onReset}
              >
                Annuler
              </Button>
              <Button
                size="small"
                variant="primary"
                type="submit"
                disabled={!isDirty}
                loading={updating}
              >
                Sauvegarder
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): MediaFormWrapper => {
  return {
    media: {
      images:
        product.images?.map((image) => ({
          url: image.url,
          selected: false,
        })) || [],
    },
  }
}

export default MediaModal
