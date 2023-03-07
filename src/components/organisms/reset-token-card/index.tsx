import { useAdminSendResetPasswordToken } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import CheckCircleIcon from "../../fundamentals/icons/check-circle-icon"
import SigninInput from "../../molecules/input-signin"

type ResetTokenCardProps = {
  goBack: () => void
}

type FormValues = {
  email: string
}

const checkMail = /^\S+@\S+$/i

const ResetTokenCard: React.FC<ResetTokenCardProps> = ({ goBack }) => {
  const [unrecognizedEmail, setUnrecognizedEmail] = useState(false)
  const [invalidEmail, setInvalidEmail] = useState(false)
  const [mailSent, setSentMail] = useState(false)
  const { register, handleSubmit } = useForm<FormValues>()

  const sendEmail = useAdminSendResetPasswordToken()

  const onSubmit = (values: FormValues) => {
    if (!checkMail.test(values.email)) {
      setInvalidEmail(true)
      return
    }

    setInvalidEmail(false)
    setUnrecognizedEmail(false)

    sendEmail.mutate(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          setSentMail(true)
        },
        onError: () => {
          setUnrecognizedEmail(true)
        },
      }
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        <span className="inter-2xlarge-semibold mt-base text-grey-90">
          Réinitialiser mon mot de passe
        </span>
        <span className="inter-base-regular mt-xsmall text-center text-grey-50">
          Entrez votre courriel ci-dessous, et vous receverez
          <br />
          des instructions pour réinitialiser votre mot de passe.
        </span>
        {!mailSent ? (
          <>
            <SigninInput
              placeholder="exemple@hotmail.com..."
              {...register("email", { required: true })}
              className="mb-0 mt-xlarge"
            />
            {unrecognizedEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-left text-rose-50">
                  Il n'y a pas d'utilisateur avec ce courriel
                </span>
              </div>
            )}
            {invalidEmail && (
              <div className="mt-xsmall w-[318px]">
                <span className="inter-small-regular text-left text-rose-50">
                  Courriel invalide
                </span>
              </div>
            )}
            <button
              className="inter-base-regular mt-4 h-[48px] w-[320px] rounded-rounded border bg-violet-50 py-3 px-4 text-grey-0"
              type="submit"
            >
              Envoyer
            </button>
          </>
        ) : (
          <div className="mt-large flex gap-x-small rounded-rounded bg-violet-10 p-base text-violet-60">
            <div>
              <CheckCircleIcon size={20} />
            </div>
            <div className="flex flex-col gap-y-2xsmall">
              <span className="inter-small-semibold">Courriel envoyé</span>
              <span className="inter-small-regular">
                Nous vous avons envoyé courriel pour réinitialiser votre mot de
                passe. Vérifiez vos courriers indésirables si vous ne l'avez pas
                reçu après quelques minutes.
              </span>
            </div>
          </div>
        )}
        <span
          className="inter-small-regular mt-8 cursor-pointer text-grey-50"
          onClick={goBack}
        >
          Retour à la page de connexion
        </span>
      </div>
    </form>
  )
}

export default ResetTokenCard
