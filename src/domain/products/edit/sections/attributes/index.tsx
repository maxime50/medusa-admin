import { Product } from "@medusajs/medusa"
import React from "react"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import { ActionType } from "../../../../../components/molecules/actionables"
import Section from "../../../../../components/organisms/section"
import useToggleState from "../../../../../hooks/use-toggle-state"
import AttributeModal from "./attribute-modal"

type Props = {
  product: Product
}

const AttributesSection = ({ product }: Props) => {
  const { state, toggle, close } = useToggleState()

  const actions: ActionType[] = [
    {
      label: "Modifier les attributs",
      onClick: toggle,
      icon: <EditIcon size={20} />,
    },
  ]

  return (
    <>
      <Section title="Attributs" actions={actions} forceDropdown>
        <div className="mb-large mt-base flex flex-col gap-y-xsmall">
          <h2 className="inter-base-semibold">Dimensions</h2>
          <div className="flex flex-col gap-y-xsmall">
            <Attribute attribute="Hauteur" value={product.height} />
            <Attribute attribute="Largeur" value={product.width} />
            <Attribute attribute="Longueur" value={product.length} />
            <Attribute attribute="Poids" value={product.weight} />
          </div>
        </div>
        <div className="flex flex-col gap-y-xsmall">
          <h2 className="inter-base-semibold">Customs</h2>
          <div className="flex flex-col gap-y-xsmall">
            <Attribute attribute="Code MID" value={product.mid_code} />
            <Attribute attribute="Code HS" value={product.hs_code} />
            <Attribute
              attribute="Pays d'origine"
              value={product.origin_country}
            />
          </div>
        </div>
      </Section>

      <AttributeModal onClose={close} open={state} product={product} />
    </>
  )
}

type AttributeProps = {
  attribute: string
  value: string | number | null
}

const Attribute = ({ attribute, value }: AttributeProps) => {
  return (
    <div className="inter-base-regular flex w-full items-center justify-between text-grey-50">
      <p>{attribute}</p>
      <p>{value || "–"}</p>
    </div>
  )
}

export default AttributesSection
