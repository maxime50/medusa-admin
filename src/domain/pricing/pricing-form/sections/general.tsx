import React from "react"
import { Controller } from "react-hook-form"
import Switch from "../../../../components/atoms/switch"
import FeatureToggle from "../../../../components/fundamentals/feature-toggle"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import { usePriceListForm } from "../form/pricing-form-context"

const General = () => {
  const { control, register } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      title="Général"
      tooltip="Informations générales pour la liste de prix."
      value="general"
    >
      <div className="accordion-margin-transition flex flex-col gap-y-small group-radix-state-open:mt-5">
        <InputField
          label="Nom"
          required
          placeholder="B2B, Black Friday..."
          {...register("name", { required: "Nom requis" })}
        />
        <InputField
          label="Description"
          required
          placeholder="Pour nos partenaires commerciaux..."
          {...register("description", { required: "Description requise" })}
        />
        <FeatureToggle featureFlag="tax_inclusive_pricing">
          <div className="mt-3">
            <div className="flex justify-between">
              <h2 className="inter-base-semibold">Prix taxes incluses</h2>
              <Controller
                control={control}
                name="includes_tax"
                render={({ field: { value, onChange } }) => {
                  return <Switch checked={!!value} onCheckedChange={onChange} />
                }}
              />
            </div>
            <p className="inter-base-regular text-grey-50">
              Choisissez de rendre tous les prix taxes incluses de cette liste.
            </p>
          </div>
        </FeatureToggle>
      </div>
    </Accordion.Item>
  )
}

export default General
