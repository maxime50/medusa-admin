import { useAdminReturnReasons } from "medusa-react"
import { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import { ReturnReasonDetails } from ".."
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { useLayeredModal } from "../../../../../components/molecules/modal/layered-modal"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import TextArea from "../../../../../components/molecules/textarea"

type Props = {
  reasonDetails: ReturnReasonDetails
  addReasonDetails: (index: number, details: ReturnReasonDetails) => void
  index: number
  isClaim?: boolean
}

const claimReturnReasons = [
  {
    label: "Article manquant",
    value: "missing_item",
  },
  {
    label: "Mauvais article",
    value: "wrong_item",
  },
  {
    label: "Défaut de fabrication",
    value: "production_failure",
  },
  {
    label: "Autre",
    value: "other",
  },
]

const AddReasonScreen = ({
  reasonDetails,
  index,
  isClaim = false,
  addReasonDetails,
}: Props) => {
  const { return_reasons } = useAdminReturnReasons()
  const returnReasonOptions = useMemo(() => {
    if (isClaim) {
      return claimReturnReasons
    }

    return (
      return_reasons?.map((reason) => ({
        label: reason.label,
        value: reason.id,
      })) || []
    )
  }, [return_reasons, isClaim])

  const {
    control,
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ReturnReasonDetails>({
    defaultValues: reasonDetails,
  })

  const { pop } = useLayeredModal()

  const onSubmit = handleSubmit((data) => {
    addReasonDetails(index, data)
    pop()
  })

  return (
    <>
      <Modal.Content>
        <div className="flex flex-col gap-y-base">
          <h2 className="inter-base-semibold">Raison du retour</h2>
          <Controller
            control={control}
            name="reason"
            render={({ field }) => {
              return (
                <NextSelect
                  label="Raison"
                  placeholder="Choisir un motif de retour"
                  {...field}
                  options={returnReasonOptions}
                  isClearable
                />
              )
            }}
          />
          <TextArea
            label="Note"
            placeholder="Le produit a été endommagé pendant l'expédition"
            {...register("note")}
          />
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end gap-x-xsmall">
          <Button size="small" variant="secondary" onClick={pop} type="button">
            Cancel
          </Button>
          <Button
            size="small"
            variant="primary"
            onClick={onSubmit}
            disabled={!isDirty}
            type="button"
          >
            Sauvegarder
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddReasonScreen = () => {
  const { pop, push } = useLayeredModal()

  const pushScreen = (props: Props) => {
    push({
      title: "Sélectionner le motif",
      onBack: () => pop(),
      view: <AddReasonScreen {...props} />,
    })
  }

  return { pushScreen }
}
