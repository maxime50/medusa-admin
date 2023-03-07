import ConfettiGenerator from "confetti-js"
import { useAdminAcceptInvite } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Button from "../components/fundamentals/button"
import LongArrowRightIcon from "../components/fundamentals/icons/long-arrow-right-icon"
import MedusaIcon from "../components/fundamentals/icons/medusa-icon"
import MedusaVice from "../components/fundamentals/icons/medusa-vice"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"
import LoginLayout from "../components/templates/login-layout"
import useNotification from "../hooks/use-notification"
import { getErrorMessage } from "../utils/error-messages"

type formValues = {
  password: string
  repeat_password: string
  first_name: string
  last_name: string
}

const InvitePage = () => {
  const location = useLocation()
  const parsed = qs.parse(location.search.substring(1))
  const [signUp, setSignUp] = useState(false)

  let token: Object | null = null
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string)
    } catch (e) {
      token = null
    }
  }

  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const confettiSettings = {
      target: "confetti-canvas",
      start_from_edge: true,
      size: 3,
      clock: 25,
      colors: [
        [251, 146, 60],
        [167, 139, 250],
        [251, 146, 60],
        [96, 165, 250],
        [45, 212, 191],
        [250, 204, 21],
        [232, 121, 249],
      ],
      max: 26,
    }
    const confetti = new ConfettiGenerator(confettiSettings)
    confetti.render()

    return () => confetti.clear()
  }, [])

  const { register, handleSubmit, formState } = useForm<formValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      password: "",
      repeat_password: "",
    },
  })

  const accept = useAdminAcceptInvite()
  const navigate = useNavigate()
  const notification = useNotification()

  const handleAcceptInvite = (data: formValues) => {
    setPasswordMismatch(false)

    if (data.password !== data.repeat_password) {
      setPasswordMismatch(true)
      return
    }

    accept.mutate(
      {
        token: parsed.token as string,
        user: {
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          navigate("/login")
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      }
    )
  }

  useEffect(() => {
    if (
      formState.dirtyFields.password &&
      formState.dirtyFields.repeat_password &&
      formState.dirtyFields.first_name &&
      formState.dirtyFields.last_name
    ) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [formState])

  return (
    <>
      {signUp ? (
        <LoginLayout>
          <SEO title="Créer un compte" />
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex min-h-[600px] justify-center rounded-rounded bg-grey-0">
              <form
                className="flex w-full flex-col items-center py-12 px-[120px]"
                onSubmit={handleSubmit(handleAcceptInvite)}
              >
                <MedusaIcon />
                {!token ? (
                  <div className="flex h-full flex-col items-center justify-center gap-y-2 text-center">
                    <span className="inter-large-semibold text-grey-90">
                      Votre lien d'inscription n'est pas valide
                    </span>
                    <span className="inter-base-regular mt-2 text-grey-50">
                      Contactez l'administrateur pour obtenir un lien
                      d'inscription valide.
                    </span>
                  </div>
                ) : (
                  <>
                    <span className="inter-2xlarge-semibold mt-4 text-grey-90">
                      Bienvenue dans l'équipe !
                    </span>
                    <span className="inter-base-regular mt-2 mb-large text-grey-50">
                      Créer un compte 👇🏼
                    </span>
                    <SigninInput
                      placeholder="Prénom"
                      {...register("first_name", { required: true })}
                      autoComplete="given-name"
                    />
                    <SigninInput
                      placeholder="Nom"
                      {...register("last_name", { required: true })}
                      autoComplete="family-name"
                    />
                    <SigninInput
                      placeholder="Mot de passe"
                      type={"password"}
                      {...register("password", { required: true })}
                      autoComplete="new-password"
                    />
                    <SigninInput
                      placeholder="Confirmation"
                      type={"password"}
                      {...register("repeat_password", { required: true })}
                      autoComplete="new-password"
                    />
                    {passwordMismatch && (
                      <span className="inter-small-regular mt-2 w-full text-rose-50">
                        Les deux mots de passes ne sont pas les mêmes
                      </span>
                    )}
                    <Button
                      variant="primary"
                      size="large"
                      type="submit"
                      className="mt-base w-full"
                      loading={formState.isSubmitting}
                      disabled={!ready}
                    >
                      Créer un compte
                    </Button>
                    <Link
                      to="/login"
                      className="inter-small-regular mt-large text-grey-50"
                    >
                      Déjà inscrit ? Se connecter
                    </Link>
                  </>
                )}
              </form>
            </div>
          </div>
        </LoginLayout>
      ) : (
        <div className="h-screen w-full overflow-hidden bg-grey-90">
          <div className="absolute inset-0 z-10 mx-auto flex h-full max-w-[1080px] flex-grow flex-col items-center justify-center">
            <MedusaVice className="mb-3xlarge" />
            <div className="flex max-w-3xl flex-col items-center text-center">
              <h1 className="inter-3xlarge-semibold mb-base text-grey-0">
                Vous avez été invité à rejoindre l'équipe
              </h1>
              <p className="inter-xlarge-regular text-grey-50">
                Vous pouvez maintenant rejoindre l'équipe Bijoux Tendances.
                Inscrivez-vous ci-dessous.
              </p>
            </div>
            <div className="mt-4xlarge">
              <Button
                size="large"
                variant="primary"
                className="w-[280px]"
                onClick={() => setSignUp(true)}
              >
                S'inscrire
                <LongArrowRightIcon size={20} className="pt-1" />
              </Button>
            </div>
          </div>
          <canvas id="confetti-canvas" />
        </div>
      )}
    </>
  )
}

export default InvitePage
