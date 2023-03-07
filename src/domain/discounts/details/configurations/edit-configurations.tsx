import { Discount } from "@medusajs/medusa"
import { useAdminUpdateDiscount } from "medusa-react"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Button from "../../../../components/fundamentals/button"
import AvailabilityDuration from "../../../../components/molecules/availability-duration"
import InputField from "../../../../components/molecules/input"
import Modal from "../../../../components/molecules/modal"
import SwitchableItem from "../../../../components/molecules/switchable-item"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"

type EditConfigurationsProps = {
  discount: Discount
  onClose: () => void
}

type ConfigurationsForm = {
  starts_at: Date | null
  ends_at: Date | null
  usage_limit: number | null
  valid_duration: string | null
}

const EditConfigurations: React.FC<EditConfigurationsProps> = ({
  discount,
  onClose,
}) => {
  const { mutate, isLoading } = useAdminUpdateDiscount(discount.id)
  const notification = useNotification()

  const { control, handleSubmit, reset } = useForm<ConfigurationsForm>({
    defaultValues: mapConfigurations(discount),
  })

  const onSubmit = (data: ConfigurationsForm) => {
    mutate(
      {
        starts_at: data.starts_at ?? new Date(),
        ends_at: data.ends_at,
        usage_limit:
          data.usage_limit && data.usage_limit > 0 ? data.usage_limit : null,
        valid_duration: data.valid_duration,
      },
      {
        onSuccess: ({ discount }) => {
          notification("Succès", "Rabais mis à jour avec succès", "success")
          reset(mapConfigurations(discount))
          onClose()
        },
        onError: (error) => {
          notification("Erreur", getErrorMessage(error), "error")
        },
      }
    )
  }

  useEffect(() => {
    reset(mapConfigurations(discount))
  }, [discount])

  return (
    <Modal handleClose={onClose} isLargeModal>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Modifier les configurations</h1>
        </Modal.Header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content>
            <div className="flex flex-col gap-y-xlarge">
              <Controller
                name="starts_at"
                defaultValue={discount.starts_at}
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <SwitchableItem
                      open={!!value}
                      onSwitch={() => {
                        if (value) {
                          onChange(null)
                        } else {
                          onChange(new Date(discount.starts_at))
                        }
                      }}
                      title="Le rabais a une date de début ?"
                      description="Programmer la date d'activation pour ce rabais."
                    >
                      <div className="flex items-center gap-x-xsmall">
                        <DatePicker
                          date={value!}
                          label="Date de début"
                          onSubmitDate={onChange}
                        />
                        <TimePicker
                          label="Heure de départ"
                          date={value!}
                          onSubmitDate={onChange}
                        />
                      </div>
                    </SwitchableItem>
                  )
                }}
              />
              <Controller
                name="ends_at"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <SwitchableItem
                      open={!!value}
                      onSwitch={() => {
                        if (value) {
                          onChange(null)
                        } else {
                          onChange(
                            new Date(
                              new Date().getTime() + 7 * 24 * 60 * 60 * 1000
                            )
                          )
                        }
                      }}
                      title="Le rabais a une date d'expiration ?"
                      description="Programmer la date d'expiration pour ce rabais."
                    >
                      <div className="flex items-center gap-x-xsmall">
                        <DatePicker
                          date={value!}
                          label="Date d'expiration"
                          onSubmitDate={onChange}
                        />
                        <TimePicker
                          label="Heure d'expiration"
                          date={value!}
                          onSubmitDate={onChange}
                        />
                      </div>
                    </SwitchableItem>
                  )
                }}
              />
              <Controller
                name="usage_limit"
                control={control}
                render={({ field: { value, onChange } }) => {
                  return (
                    <SwitchableItem
                      open={!!value}
                      onSwitch={() => {
                        if (value) {
                          onChange(null)
                        } else {
                          onChange(10)
                        }
                      }}
                      title="Limiter le nombre d'utilisation ?"
                      description="La limite s'applique à tous les clients."
                    >
                      <InputField
                        label="Nombre d'utilisation maximal"
                        type="number"
                        placeholder="5"
                        min={1}
                        defaultValue={value ?? undefined}
                        onChange={(value) =>
                          onChange(value.target.valueAsNumber)
                        }
                      />
                    </SwitchableItem>
                  )
                }}
              />
              {discount.is_dynamic && (
                <Controller
                  name="valid_duration"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return (
                      <SwitchableItem
                        open={!!value}
                        onSwitch={() => {
                          if (value) {
                            onChange(null)
                          } else {
                            onChange("P0Y0M0DT00H00M")
                          }
                        }}
                        title="Durée de disponibilité ?"
                        description="Définir la durée du rabais"
                      >
                        <AvailabilityDuration
                          value={value ?? undefined}
                          onChange={onChange}
                        />
                      </SwitchableItem>
                    )
                  }}
                />
              )}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button
                variant="ghost"
                size="small"
                className="min-w-[128px]"
                type="button"
                onClick={onClose}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                size="small"
                className="min-w-[128px]"
                type="submit"
                loading={isLoading}
                disabled={isLoading}
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

const mapConfigurations = (discount: Discount): ConfigurationsForm => {
  return {
    starts_at: new Date(discount.starts_at),
    ends_at: discount.ends_at ? new Date(discount.ends_at) : null,
    usage_limit: discount.usage_limit,
    valid_duration: discount.valid_duration,
  }
}

export default EditConfigurations
