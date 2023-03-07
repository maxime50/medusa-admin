import { Product } from "@medusajs/medusa"
import React from "react"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import MediaModal from "./media-modal"

type Props = {
  product: Product
}

const MediaSection = ({ product }: Props) => {
  const { state, close, toggle } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Modifier les médias",
      onClick: toggle,
    },
  ]

  return (
    <>
      <Section title="Média" actions={actions}>
        {product.images && product.images.length > 0 && (
          <div className="mt-base grid grid-cols-3 gap-xsmall">
            {product.images.map((image, index) => {
              return (
                <div
                  key={image.id}
                  className="flex aspect-square items-center justify-center"
                >
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="max-h-full max-w-full rounded-rounded object-contain"
                  />
                </div>
              )
            })}
          </div>
        )}
      </Section>

      <MediaModal product={product} open={state} onClose={close} />
    </>
  )
}

export default MediaSection
