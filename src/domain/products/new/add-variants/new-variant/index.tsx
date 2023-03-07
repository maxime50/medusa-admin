import clsx from "clsx"
import type { Identifier, XYCoord } from "dnd-core"
import React, { useEffect, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { useForm } from "react-hook-form"
import Tooltip from "../../../../../components/atoms/tooltip"
import Button from "../../../../../components/fundamentals/button"
import CheckCircleFillIcon from "../../../../../components/fundamentals/icons/check-circle-fill-icon"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import GripIcon from "../../../../../components/fundamentals/icons/grip-icon"
import MoreHorizontalIcon from "../../../../../components/fundamentals/icons/more-horizontal-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Actionables from "../../../../../components/molecules/actionables"
import IconTooltip from "../../../../../components/molecules/icon-tooltip"
import Modal from "../../../../../components/molecules/modal"
import useImperativeDialog from "../../../../../hooks/use-imperative-dialog"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { DragItem } from "../../../../../types/shared"
import { CustomsFormType } from "../../../components/customs-form"
import { DimensionsFormType } from "../../../components/dimensions-form"
import CreateFlowVariantForm, {
  CreateFlowVariantFormType,
} from "../../../components/variant-form/create-flow-variant-form"
import { VariantOptionValueType } from "../../../components/variant-form/variant-select-options-form"

const ItemTypes = {
  CARD: "card",
}

type Props = {
  id: string
  source: CreateFlowVariantFormType
  index: number
  save: (index: number, variant: CreateFlowVariantFormType) => boolean
  remove: (index: number) => void
  move: (dragIndex: number, hoverIndex: number) => void
  options: VariantOptionValueType[]
  onCreateOption: (optionId: string, value: string) => void
  productDimensions: DimensionsFormType
  productCustoms: CustomsFormType
}

const NewVariant = ({
  id,
  source,
  index,
  save,
  remove,
  move,
  options,
  onCreateOption,
  productDimensions,
  productCustoms,
}: Props) => {
  const { state, toggle, close } = useToggleState()
  const localForm = useForm<CreateFlowVariantFormType>({
    defaultValues: source,
  })

  const { handleSubmit, reset } = localForm

  useEffect(() => {
    reset(source)
  }, [source])

  const closeAndReset = () => {
    reset(source)
    close()
  }

  const onUpdate = handleSubmit((data) => {
    const payload = {
      ...data,
      title: data.general.title
        ? data.general.title
        : data.options.map((vo) => vo.option?.value).join(" / "),
    }

    const saved = save(index, payload)

    if (!saved) {
      localForm.setError("options", {
        type: "deps",
        message: "Une variante avec ces options existe déjà.",
      })
      return
    }

    closeAndReset()
  })

  const warning = useImperativeDialog()

  const onDelete = async () => {
    const confirmed = await warning({
      text: "Êtes-vous sûr de vouloir supprimer cette variante ?",
      heading: "Delete Variant",
    })

    if (confirmed) {
      remove(index)
    }
  }

  const ref = useRef<HTMLDivElement>(null)
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      move(dragIndex, hoverIndex)

      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <>
      <div
        ref={preview}
        data-handler-id={handlerId}
        className={clsx(
          "grid h-16 translate-y-0 translate-x-0 grid-cols-[32px_1fr_90px_100px_48px] rounded-rounded py-xsmall pl-xsmall pr-base transition-all focus-within:bg-grey-5 hover:bg-grey-5",
          {
            "opacity-50": isDragging,
          }
        )}
      >
        <div
          ref={ref}
          className="flex cursor-move items-center justify-center text-grey-40"
        >
          <GripIcon size={20} />
        </div>
        <div className="ml-base flex flex-col justify-center">
          <p className="inter-base-semibold">
            {source.general.title}
            {source.stock.sku && (
              <span className="inter-base-regular ml-2xsmall text-grey-50">
                ({source.stock.sku})
              </span>
            )}
          </p>
          {source.stock.ean && (
            <span className="inter-base-regular text-grey-50">
              {source.stock.ean}
            </span>
          )}
        </div>
        <div className="mr-xlarge flex items-center justify-end">
          <p>{source.stock.inventory_quantity || "-"}</p>
        </div>
        <div className="flex items-center justify-center">
          <VariantValidity
            source={source}
            productCustoms={productCustoms}
            productDimensions={productDimensions}
          />
        </div>
        <div className="ml-xlarge flex items-center justify-center pr-base">
          <Actionables
            forceDropdown
            actions={[
              {
                label: "Modifier",
                icon: <EditIcon size={20} />,
                onClick: toggle,
              },
              {
                label: "Supprimer",
                icon: <TrashIcon size={20} />,
                onClick: onDelete,
                variant: "danger",
              },
            ]}
            customTrigger={
              <Button
                variant="ghost"
                className="flex h-xlarge w-xlarge items-center justify-center p-0 text-grey-50"
              >
                <MoreHorizontalIcon size={20} />
              </Button>
            }
          />
        </div>
      </div>

      <Modal open={state} handleClose={closeAndReset}>
        <Modal.Body>
          <Modal.Header handleClose={closeAndReset}>
            <h1 className="inter-xlarge-semibold">
              Modifier la variante
              {source.general.title && (
                <span className="inter-xlarge-regular ml-xsmall text-grey-50">
                  ({source.general.title})
                </span>
              )}
            </h1>
          </Modal.Header>
          <Modal.Content>
            <CreateFlowVariantForm
              form={localForm}
              options={options}
              onCreateOption={onCreateOption}
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={closeAndReset}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="small"
                type="button"
                onClick={onUpdate}
              >
                Sauvegarder
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </Modal>
    </>
  )
}

const VariantValidity = ({
  source,
  productCustoms,
  productDimensions,
}: Pick<Props, "source" | "productCustoms" | "productDimensions">) => {
  const {
    prices,
    options,
    dimensions,
    customs,
    stock: { barcode, upc, ean, sku, inventory_quantity },
    general: { title },
  } = source

  if (!options || !options.length) {
    return (
      <IconTooltip
        type="error"
        content={
          <div className="flex flex-col gap-y-2xsmall text-rose-50">
            <p>Cette variante n'a pas d'options.</p>
          </div>
        }
      />
    )
  }

  const invalidOptions = options.filter((opt) => !opt.option?.value)

  if (invalidOptions?.length) {
    return (
      <IconTooltip
        type="error"
        content={
          <div className="flex flex-col gap-y-2xsmall text-rose-50">
            <p>Il manque des valeurs pour les options suivantes :</p>
            <ul className="list-inside list-disc">
              {invalidOptions.map((io, index) => {
                return <li key={index}>{io.title || `Option ${index + 1}`}</li>
              })}
            </ul>
          </div>
        }
      />
    )
  }

  const validPrices = prices?.prices.some((p) => p.amount !== null)

  const validDimensions =
    Object.values(productDimensions).every((value) => !!value) ||
    Object.values(dimensions).every((value) => !!value)
  const validCustoms =
    Object.values(productCustoms).every((value) => !!value) ||
    Object.values(customs).every((value) => !!value)

  const barcodeValidity = !!barcode || !!upc || !!ean

  if (
    !sku ||
    !validCustoms ||
    !validDimensions ||
    !barcodeValidity ||
    !validPrices
  ) {
    return (
      <IconTooltip
        type="warning"
        side="right"
        content={
          <div className="flex flex-col gap-y-2xsmall text-orange-50">
            <p>
              La variante peut être créée, mais il manque quelques champs
              importants :
            </p>
            <ul className="list-inside list-disc">
              {!validPrices && <li>Prix</li>}
              {!validDimensions && <li>Dimensions</li>}
              {!validCustoms && <li>Customs</li>}
              {!inventory_quantity && <li>Quantité en stock</li>}
              {!sku && <li>SKU</li>}
              {!barcodeValidity && <li>Code barre</li>}
            </ul>
          </div>
        }
      />
    )
  }

  return (
    <Tooltip
      content={title ? `${title} est valide` : "La variante est valide"}
      side="top"
    >
      <CheckCircleFillIcon size={20} className="text-emerald-40" />
    </Tooltip>
  )
}

export default NewVariant
