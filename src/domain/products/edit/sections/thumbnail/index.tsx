import { Product } from "@medusajs/medusa"
import clsx from "clsx"
import React, { MouseEventHandler } from "react"
import TwoStepDelete from "../../../../../components/atoms/two-step-delete"
import Button from "../../../../../components/fundamentals/button"
import Section from "../../../../../components/organisms/section"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { getErrorMessage } from "../../../../../utils/error-messages"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import ThumbnailModal from "./thumbnail-modal"

type Props = {
  product: Product
}

const TumbnailSection = ({ product }: Props) => {
  const { onUpdate, updating } = useEditProductActions(product.id)
  const { state, toggle, close } = useToggleState()

  const notification = useNotification()

  const handleDelete = () => {
    onUpdate(
      {
        // @ts-ignore
        thumbnail: null,
      },
      {
        onSuccess: () => {
          notification("Succès", "Vignette supprimée avec succès", "success")
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      }
    )
  }

  const handleImageFullscreen: MouseEventHandler<HTMLImageElement> = (e) => {
    const element = e.target as HTMLImageElement
    if (!element) return

    const enterFullscreen = () => {
      // Element to fullscreen

      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      } else if (element.webkitEnterFullscreen) {
        element.webkitEnterFullscreen()
      }
    }

    enterFullscreen()
  }

  return (
    <>
      <Section
        title="Image principale"
        customActions={
          <div className="flex items-center gap-x-xsmall">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={toggle}
            >
              {product.thumbnail ? "Modifier" : "Importer"}
            </Button>
            {product.thumbnail && (
              <TwoStepDelete onDelete={handleDelete} deleting={updating} />
            )}
          </div>
        }
      >
        <div
          className={clsx("mt-base grid grid-cols-3 gap-xsmall", {
            hidden: !product.thumbnail,
          })}
        >
          {product.thumbnail && (
            <div className="flex aspect-square items-center justify-center">
              <img
                onClick={handleImageFullscreen}
                src={product.thumbnail}
                alt={`Vignette pour ${product.title}`}
                className="max-h-full max-w-full rounded-rounded object-contain"
              />
            </div>
          )}
        </div>
      </Section>

      <ThumbnailModal product={product} open={state} onClose={close} />
    </>
  )
}

export default TumbnailSection
