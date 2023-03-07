import { useAdminResetPassword } from "medusa-react"
import qs from "qs"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { decodeToken } from "react-jwt"
import { useLocation, useNavigate } from "react-router-dom"
import Button from "../components/fundamentals/button"
import MedusaIcon from "../components/fundamentals/icons/medusa-icon"
import SigninInput from "../components/molecules/input-signin"
import SEO from "../components/seo"
import LoginLayout from "../components/templates/login-layout"
import { getErrorMessage } from "../utils/error-messages"

type formValues = {
  password: string
  repeat_password: string
}

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const parsed = qs.parse(location.search.substring(1))

  let token: { email: string } | null = null
  if (parsed?.token) {
    try {
      token = decodeToken(parsed.token as string)
    } catch (e) {
      token = null
    }
  }

  const [passwordMismatch, setPasswordMismatch] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const email = (token?.email || parsed?.email || "") as string

  const { register, handleSubmit, formState } = useForm<formValues>({
    defaultValues: {
      password: "",
      repeat_password: "",
    },
  })
  const reset = useAdminResetPassword()

  const handleAcceptInvite = (data: formValues) => {
    setPasswordMismatch(false)
    setError(null)

    if (data.password !== data.repeat_password) {
      setPasswordMismatch(true)
      return
    }

    reset.mutate(
      {
        token: parsed.token as string,
        password: data.password,
        email: email,
      },
      {
        onSuccess: () => {
          navigate("/login")
        },
        onError: (err) => {
          setError(getErrorMessage(err))
        },
      }
    )
  }

  useEffect(() => {
    if (
      formState.dirtyFields.password &&
      formState.dirtyFields.repeat_password
    ) {
      setReady(true)
    } else {
      setReady(false)
    }
  }, [formState])

  return (
    <LoginLayout>
      <SEO title="Reset Password" />
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex min-h-[540px] justify-center rounded-rounded bg-grey-0">
          <form
            className="flex w-full flex-col items-center py-12 px-[120px]"
            onSubmit={handleSubmit(handleAcceptInvite)}
          >
            <MedusaIcon />
            {!token ? (
              <div className="flex h-full flex-col items-center justify-center gap-y-2 text-center">
                <span className="inter-large-semibold text-grey-90">
                  Le lien de réinitialisation n'est pas valide
                </span>
                <span className="inter-base-regular mt-2 text-grey-50">
                  Essayez à nouveau de réinitialiser votre mot de passe
                </span>
              </div>
            ) : (
              <>
                <span className="inter-2xlarge-semibold mt-4 text-grey-90">
                  Réinitialiser votre mot de passe
                </span>
                <span className="inter-base-regular mt-2 mb-xlarge text-grey-50">
                  Choisissez un nouveau mot de passe 👇🏼
                </span>
                <SigninInput
                  placeholder="Courriel"
                  name="first_name"
                  value={email}
                  readOnly
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
                  className="mb-0"
                />
                {error && (
                  <span className="inter-small-regular mt-xsmall w-full text-rose-50">
                    Les deux mots de passes ne sont pas les mêmes
                  </span>
                )}
                {passwordMismatch && (
                  <span className="inter-small-regular mt-xsmall w-full text-rose-50">
                    Les deux mots de passes ne sont pas les mêmes
                  </span>
                )}
                <Button
                  variant="primary"
                  size="large"
                  type="submit"
                  className="mt-base w-full rounded-rounded"
                  loading={formState.isSubmitting}
                  disabled={!ready}
                >
                  Réinitialiser le mot de passe
                </Button>
              </>
            )}
          </form>
        </div>
      </div>
    </LoginLayout>
  )
}

export default ResetPasswordPage
