import { AdminPostProductsReq } from "@medusajs/medusa"
import { useAdminCreateProduct } from "medusa-react"
import { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/fundamentals/button"
import FeatureToggle from "../../../components/fundamentals/feature-toggle"
import CrossIcon from "../../../components/fundamentals/icons/cross-icon"
import FocusModal from "../../../components/molecules/modal/focus-modal"
import Accordion from "../../../components/organisms/accordion"
import { useFeatureFlag } from "../../../context/feature-flag"
import useNotification from "../../../hooks/use-notification"
import { FormImage, ProductStatus } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import { prepareImages } from "../../../utils/images"
import { nestedForm } from "../../../utils/nested-form"
import CustomsForm, { CustomsFormType } from "../components/customs-form"
import DimensionsForm, {
  DimensionsFormType,
} from "../components/dimensions-form"
import DiscountableForm, {
  DiscountableFormType,
} from "../components/discountable-form"
import GeneralForm, { GeneralFormType } from "../components/general-form"
import MediaForm, { MediaFormType } from "../components/media-form"
import OrganizeForm, { OrganizeFormType } from "../components/organize-form"
import { PricesFormType } from "../components/prices-form"
import ThumbnailForm, { ThumbnailFormType } from "../components/thumbnail-form"
import AddSalesChannelsForm, {
  AddSalesChannelsFormType,
} from "./add-sales-channels"
import AddVariantsForm, { AddVariantsFormType } from "./add-variants"

type NewProductForm = {
  general: GeneralFormType
  discounted: DiscountableFormType
  organize: OrganizeFormType
  variants: AddVariantsFormType
  customs: CustomsFormType
  dimensions: DimensionsFormType
  thumbnail: ThumbnailFormType
  media: MediaFormType
  salesChannels: AddSalesChannelsFormType
}

type Props = {
  onClose: () => void
}

const NewProduct = ({ onClose }: Props) => {
  const form = useForm<NewProductForm>({
    defaultValues: createBlank(),
  })
  const { mutate } = useAdminCreateProduct()
  const navigate = useNavigate()
  const notification = useNotification()

  const watchedCustoms = useWatch({
    control: form.control,
    name: "customs",
  })

  const watchedDimensions = useWatch({
    control: form.control,
    name: "dimensions",
  })

  const {
    handleSubmit,
    formState: { isDirty },
    reset,
  } = form

  const closeAndReset = () => {
    reset(createBlank())
    onClose()
  }

  useEffect(() => {
    reset(createBlank())
  }, [])

  const { isFeatureEnabled } = useFeatureFlag()

  const onSubmit = (publish = true) =>
    handleSubmit(async (data) => {
      const payload = createPayload(
        data,
        publish,
        isFeatureEnabled("sales_channels")
      )

      if (data.media?.images?.length) {
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

        payload.images = urls
      }

      if (data.thumbnail?.images?.length) {
        let preppedImages: FormImage[] = []

        try {
          preppedImages = await prepareImages(data.thumbnail.images)
        } catch (error) {
          let errorMessage =
            "Un problème s'est produit lors du téléchargement de la vignette."
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

        payload.thumbnail = urls[0]
      }

      mutate(payload, {
        onSuccess: ({ product }) => {
          closeAndReset()
          navigate(`/a/products/${product.id}`)
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      })
    })

  return (
    <form className="w-full">
      <FocusModal>
        <FocusModal.Header>
          <div className="flex w-full justify-between px-8 medium:w-8/12">
            <Button
              size="small"
              variant="ghost"
              type="button"
              onClick={closeAndReset}
            >
              <CrossIcon size={20} />
            </Button>
            <div className="flex gap-x-small">
              <Button
                size="small"
                variant="secondary"
                type="button"
                disabled={!isDirty}
                onClick={onSubmit(false)}
              >
                Sauvegarder comme brouillon
              </Button>
              <Button
                size="small"
                variant="primary"
                type="button"
                disabled={!isDirty}
                onClick={onSubmit(true)}
              >
                Publier le produit
              </Button>
            </div>
          </div>
        </FocusModal.Header>
        <FocusModal.Main className="no-scrollbar flex w-full justify-center">
          <div className="my-16 max-w-[700px] small:w-4/5 medium:w-7/12 large:w-6/12">
            <Accordion defaultValue={["general"]} type="multiple">
              <Accordion.Item
                value={"general"}
                title="Information général"
                required
              >
                <p className="inter-base-regular text-grey-50">
                  Pour commencer à vendre, il suffit d'un titre et d'un prix.
                </p>
                <div className="mt-xlarge flex flex-col gap-y-xlarge">
                  <GeneralForm
                    form={nestedForm(form, "general")}
                    requireHandle={false}
                  />
                  <DiscountableForm form={nestedForm(form, "discounted")} />
                </div>
              </Accordion.Item>
              <Accordion.Item title="Organisation du produit" value="organize">
                <p className="inter-base-regular text-grey-50">
                  Nous aide à mieux organiser le produit
                </p>
                <div className="mt-xlarge flex flex-col gap-y-xlarge pb-xsmall">
                  <div>
                    <OrganizeForm form={nestedForm(form, "organize")} />
                    <FeatureToggle featureFlag="sales_channels">
                      <div className="mt-xlarge">
                        <AddSalesChannelsForm
                          form={nestedForm(form, "salesChannels")}
                        />
                      </div>
                    </FeatureToggle>
                  </div>
                </div>
              </Accordion.Item>
              <Accordion.Item title="Variantes" value="variants">
                <p className="inter-base-regular text-grey-50">
                  Ajouter des variantes de ce produit.
                  <br />
                  Utile pour offrir aux clients différentes options de couleur,
                  de format, taille, forme, etc.
                </p>
                <div className="mt-large">
                  <AddVariantsForm
                    form={nestedForm(form, "variants")}
                    productCustoms={watchedCustoms}
                    productDimensions={watchedDimensions}
                  />
                </div>
              </Accordion.Item>
              {/* <Accordion.Item title="Attributs" value="attributes"> */}
              {/*   <p className="inter-base-regular text-grey-50"> */}
              {/*     Utilisé à des fins d'expédition et de douane. */}
              {/*   </p> */}
              {/*   <div className="my-xlarge"> */}
              {/*     <h3 className="inter-base-semibold mb-base">Dimensions</h3> */}
              {/*     <DimensionsForm form={nestedForm(form, "dimensions")} /> */}
              {/*   </div> */}
              {/*   <div> */}
              {/*     <h3 className="inter-base-semibold mb-base">Customs</h3> */}
              {/*     <CustomsForm form={nestedForm(form, "customs")} /> */}
              {/*   </div> */}
              {/* </Accordion.Item> */}
              <Accordion.Item title="Vignette" value="thumbnail">
                <p className="inter-base-regular mb-large text-grey-50">
                  Utilisée comme image principale pour représenter le produit
                  lors du paiement, du partage sur les réseaux sociaux, etc.
                </p>
                <ThumbnailForm form={nestedForm(form, "thumbnail")} />
              </Accordion.Item>
              <Accordion.Item title="Images" value="media">
                <p className="inter-base-regular mb-large text-grey-50">
                  Ajouter des images au produit.
                </p>
                <MediaForm form={nestedForm(form, "media")} />
              </Accordion.Item>
            </Accordion>
          </div>
        </FocusModal.Main>
      </FocusModal>
    </form>
  )
}

const createPayload = (
  data: NewProductForm,
  publish = true,
  salesChannelsEnabled = false
): AdminPostProductsReq => {
  const payload: AdminPostProductsReq = {
    title: data.general.title,
    subtitle: data.general.subtitle || undefined,
    material: data.general.material || undefined,
    handle: data.general.handle,
    discountable: data.discounted.value,
    is_giftcard: false,
    collection_id: data.organize.collection?.value,
    description: data.general.description || undefined,
    height: data.dimensions.height || undefined,
    length: data.dimensions.length || undefined,
    weight: data.dimensions.weight || undefined,
    width: data.dimensions.width || undefined,
    hs_code: data.customs.hs_code || undefined,
    mid_code: data.customs.mid_code || undefined,
    type: data.organize.type
      ? {
          value: data.organize.type.label,
          id: data.organize.type.value,
        }
      : undefined,
    tags: data.organize.tags
      ? data.organize.tags.map((t) => ({
          value: t,
        }))
      : undefined,
    origin_country: data.customs.origin_country?.value || undefined,
    options: data.variants.options.map((o) => ({
      title: o.title,
    })),
    variants: data.variants.entries.map((v) => ({
      title: v.general.title!,
      material: v.general.material || undefined,
      inventory_quantity: v.stock.inventory_quantity || 0,
      prices: getVariantPrices(v.prices),
      allow_backorder: v.stock.allow_backorder,
      sku: v.stock.sku || undefined,
      barcode: v.stock.barcode || undefined,
      options: v.options.map((o) => ({
        value: o.option?.value!,
      })),
      ean: v.stock.ean || undefined,
      upc: v.stock.upc || undefined,
      height: v.dimensions.height || undefined,
      length: v.dimensions.length || undefined,
      weight: v.dimensions.weight || undefined,
      width: v.dimensions.width || undefined,
      hs_code: v.customs.hs_code || undefined,
      mid_code: v.customs.mid_code || undefined,
      origin_country: v.customs.origin_country?.value || undefined,
      manage_inventory: v.stock.manage_inventory,
    })),
    // @ts-ignore
    status: publish ? ProductStatus.PUBLISHED : ProductStatus.DRAFT,
  }

  if (salesChannelsEnabled) {
    payload.sales_channels = data.salesChannels.channels.map((c) => ({
      id: c.id,
    }))
  }

  return payload
}

const createBlank = (): NewProductForm => {
  return {
    general: {
      title: "",
      material: null,
      subtitle: null,
      description: null,
      handle: "",
    },
    customs: {
      hs_code: null,
      mid_code: null,
      origin_country: null,
    },
    dimensions: {
      height: null,
      length: null,
      weight: null,
      width: null,
    },
    discounted: {
      value: true,
    },
    media: {
      images: [],
    },
    organize: {
      collection: null,
      tags: null,
      type: null,
    },
    salesChannels: {
      channels: [],
    },
    thumbnail: {
      images: [],
    },
    variants: {
      entries: [],
      options: [],
    },
  }
}

const getVariantPrices = (prices: PricesFormType) => {
  const priceArray = prices.prices
    .filter((price) => typeof price.amount === "number")
    .map((price) => {
      return {
        amount: price.amount as number,
        currency_code: price.region_id ? undefined : price.currency_code,
        region_id: price.region_id || undefined,
      }
    })

  return priceArray
}

export default NewProduct
