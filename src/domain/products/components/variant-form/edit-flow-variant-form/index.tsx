import React from "react"
import { useFieldArray, UseFormReturn } from "react-hook-form"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import InputField from "../../../../../components/molecules/input"
import Accordion from "../../../../../components/organisms/accordion"
import { nestedForm } from "../../../../../utils/nested-form"
import CustomsForm, { CustomsFormType } from "../../customs-form"
import DimensionsForm, { DimensionsFormType } from "../../dimensions-form"
import { PricesFormType } from "../../prices-form"
import VariantGeneralForm, {
  VariantGeneralFormType,
} from "../variant-general-form"
import VariantPricesForm from "../variant-prices-form"
import VariantStockForm, { VariantStockFormType } from "../variant-stock-form"

export type EditFlowVariantFormType = {
  /**
   * Used to identify the variant during product create flow. Will not be submitted to the backend.
   */
  _internal_id?: string
  general: VariantGeneralFormType
  prices: PricesFormType
  stock: VariantStockFormType
  options: {
    title: string
    value: string
    id: string
  }[]
  customs: CustomsFormType
  dimensions: DimensionsFormType
}

type Props = {
  form: UseFormReturn<EditFlowVariantFormType, any>
}

/**
 * Re-usable Product Variant form used to add and edit product variants.
 * @example
 * const MyForm = () => {
 *   const form = useForm<VariantFormType>()
 *   const { handleSubmit } = form
 *
 *   const onSubmit = handleSubmit((data) => {
 *     // do something with data
 *   })
 *
 *   return (
 *     <form onSubmit={onSubmit}>
 *       <VariantForm form={form} />
 *       <Button type="submit">Submit</Button>
 *     </form>
 *   )
 * }
 */
const EditFlowVariantForm = ({ form }: Props) => {
  const { fields } = useFieldArray({
    control: form.control,
    name: "options",
  })

  return (
    <Accordion type="multiple" defaultValue={["general"]}>
      <Accordion.Item title="Général" value="general" required>
        <div>
          <VariantGeneralForm form={nestedForm(form, "general")} />
          <div className="mt-xlarge">
            <div className="mb-base flex items-center gap-x-2xsmall">
              <h3 className="inter-base-semibold">Options</h3>
              <IconTooltip
                type="info"
                content="Les options sont utilisées pour définir la couleur, la taille, etc. de la variante."
              />
            </div>
            <div className="grid grid-cols-2 gap-large pb-2xsmall">
              {fields.map((field, index) => {
                return (
                  <InputField
                    required
                    key={field.id}
                    label={field.title}
                    {...form.register(`options.${index}.value`, {
                      required: `La valeur de l'option pour ${field.title} est obligatoire`,
                    })}
                    errors={form.formState.errors}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </Accordion.Item>
      <Accordion.Item title="Prix" value="pricing">
        <VariantPricesForm form={nestedForm(form, "prices")} />
      </Accordion.Item>
      <Accordion.Item title="Stock & Inventaire" value="stock">
        <VariantStockForm form={nestedForm(form, "stock")} />
      </Accordion.Item>
      {/* <Accordion.Item title="Livraison" value="shipping"> */}
      {/*   <p className="inter-base-regular text-grey-50"> */}
      {/*     Les informations d'expédition peuvent être requises en fonction de */}
      {/*     votre fournisseur de services d'expédition et si vous expédiez à */}
      {/*     l'étranger ou non. */}
      {/*   </p> */}
      {/*   <div className="mt-large"> */}
      {/*     <h3 className="inter-base-semibold mb-2xsmall">Dimensions</h3> */}
      {/*     <p className="inter-base-regular mb-large text-grey-50"> */}
      {/*       Configurer pour calculer les prix d'expédition. */}
      {/*     </p> */}
      {/*     <DimensionsForm form={nestedForm(form, "dimensions")} /> */}
      {/*   </div> */}
      {/*   <div className="mt-xlarge"> */}
      {/*     <h3 className="inter-base-semibold mb-2xsmall">Customs</h3> */}
      {/*     <p className="inter-base-regular mb-large text-grey-50"> */}
      {/*       Configurer si vous expédiez au niveau international. */}
      {/*     </p> */}
      {/*     <CustomsForm form={nestedForm(form, "customs")} /> */}
      {/*   </div> */}
      {/* </Accordion.Item> */}
    </Accordion>
  )
}

export default EditFlowVariantForm
