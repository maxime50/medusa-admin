import React, { useContext, useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import ChevronRightIcon from "../../../../components/fundamentals/icons/chevron-right-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import { AddConditionSelectorProps, ConditionMap } from "../../types"
import useConditionModalItems, {
  ConditionItem,
} from "./use-condition-modal-items"

type AddConditionsModalProps = AddConditionSelectorProps & {
  isDetails?: boolean
  conditions: ConditionMap
  save?: () => void
}

const AddConditionsModal = ({
  onClose,
  conditions,
  save,
  isDetails = false,
}: AddConditionsModalProps) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const [items, setItems] = useState<ConditionItem[]>(
    useConditionModalItems({ onClose, isDetails })
  )

  useEffect(() => {
    const setConditions: string[] = []

    for (const [key, value] of Object.entries(conditions)) {
      // If we are in the details view we only want to view the conditions that haven't already been added,
      // meaning !id. We don't support updating existing conditions through the admin atm.
      const filter = isDetails ? value.id : value.items.length

      if (filter) {
        setConditions.push(key)
      }
    }

    setItems(items.filter((i) => !setConditions.includes(i.value)))
  }, [conditions])

  return (
    <LayeredModal context={layeredModalContext} handleClose={onClose}>
      <Modal.Body className="flex h-[calc(100vh-134px)] flex-col">
        <Modal.Header handleClose={onClose}>
          <span className="inter-xlarge-semibold">Ajouter des conditions</span>
          <span className="mt-6 flex items-center gap-1 font-semibold text-grey-90">
            Choisir un type de conditions{" "}
            <IconTooltip content="Vous ne pouvez ajouter qu'une seule condition de chaque type" />
          </span>
        </Modal.Header>

        <Modal.Content className="flex-1">
          {items.length ? (
            items.map((t) => <ConditionTypeItem key={t.value} {...t} />)
          ) : (
            <div className="flex h-full flex-1 flex-col items-center justify-center">
              <span className="inter-base-regular text-grey-40">
                Impossible d'ajouter d'autres conditions
              </span>
            </div>
          )}
        </Modal.Content>

        <Modal.Footer>
          <div className="flex h-8 w-full justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 justify-center text-small"
              size="small"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button
              onClick={() => {
                if (save) {
                  save()
                }
                onClose()
              }}
              size="small"
              className="w-32 justify-center text-small"
              variant="primary"
            >
              Sauvegarder
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const ConditionTypeItem: React.FC<ConditionItem> = (props) => {
  const { label, description, onClick } = props

  return (
    <button
      onClick={onClick}
      className="border-1 mb-2 flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:bg-grey-5"
    >
      <div className="flex flex-col items-start">
        <div className="font-semibold ">{label}</div>
        <div className="text-grey-50">{description}</div>
      </div>
      <ChevronRightIcon width={16} height={32} className="text-grey-50" />
    </button>
  )
}

export default AddConditionsModal
