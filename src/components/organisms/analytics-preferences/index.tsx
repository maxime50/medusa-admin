import clsx from "clsx"
import React from "react"
import { useForm, useWatch } from "react-hook-form"
import { useAnalytics } from "../../../context/analytics"
import useNotification from "../../../hooks/use-notification"
import {
  analytics,
  useAdminCreateAnalyticsConfig,
} from "../../../services/analytics"
import { getErrorMessage } from "../../../utils/error-messages"
import { nestedForm } from "../../../utils/nested-form"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import FocusModal from "../../molecules/modal/focus-modal"
import AnalyticsConfigForm, {
  AnalyticsConfigFormType,
} from "../analytics-config-form"

type AnalyticsPreferenceFormType = {
  email?: string
  config: AnalyticsConfigFormType
}

const AnalyticsPreferencesModal = () => {
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateAnalyticsConfig()

  const form = useForm<AnalyticsPreferenceFormType>({
    defaultValues: {
      config: {
        anonymize: false,
        opt_out: false,
      },
    },
  })
  const {
    register,
    formState: { errors },
    control,
  } = form

  const { setSubmittingConfig } = useAnalytics()

  const watchOptOut = useWatch({
    control: control,
    name: "config.opt_out",
  })

  const watchAnonymize = useWatch({
    control: control,
    name: "config.anonymize",
  })

  const onSubmit = form.handleSubmit((data) => {
    setSubmittingConfig(true)
    const { email, config } = data

    const shouldTrackEmail = !config.anonymize && !config.opt_out

    mutate(config, {
      onSuccess: () => {
        notification(
          "Succès",
          "Vos préférences ont été mises à jour avec succès",
          "success"
        )

        if (shouldTrackEmail) {
          analytics.track("userEmail", { email })
        }

        setSubmittingConfig(false)
      },
      onError: (err) => {
        notification("Erreur", getErrorMessage(err), "error")
        setSubmittingConfig(false)
      },
    })
  })

  return (
    <FocusModal>
      <FocusModal.Main>
        <div className="flex flex-col items-center">
          <div className="mt-5xlarge flex w-full max-w-[664px] flex-col">
            <h1 className="inter-xlarge-semibold mb-large">
              Aidez-nous à nous améliorer
            </h1>
            <p className="text-grey-50">
              Pour créer l'expérience de commerce électronique la plus
              convaincante, nous aimerions savoir comment vous utilisez Bijoux
              Tendances. Les informations sur les utilisateurs nous permettent
              de de construire des produits meilleurs, plus engageants et plus
              utilisables. Nous ne collectons des données que pour améliorer nos
              produits. Lisez les données que nous recueillons dans notre{" "}
              <a
                href="#"
                rel="noreferrer noopener"
                target="_blank"
                className="text-violet-60"
              >
                documentation
              </a>
              .
            </p>
            <div className="mt-xlarge flex flex-col gap-y-xlarge">
              <InputField
                label="Email"
                placeholder="exemple@hotmail.com"
                disabled={watchOptOut || watchAnonymize}
                className={clsx("transition-opacity", {
                  "opacity-50": watchOptOut || watchAnonymize,
                })}
                {...register("email", {
                  pattern: {
                    message: "Veuillez entrer un courriel valide",
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  },
                })}
                errors={errors}
              />
              <AnalyticsConfigForm form={nestedForm(form, "config")} />
            </div>
            <div className="mt-5xlarge flex items-center justify-end">
              <Button
                variant="primary"
                size="small"
                loading={isLoading}
                onClick={onSubmit}
              >
                Continuer
              </Button>
            </div>
          </div>
        </div>
      </FocusModal.Main>
    </FocusModal>
  )
}

export default AnalyticsPreferencesModal
