import { useAdminLogin } from "medusa-react"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import Button from "../../fundamentals/button"
import SigninInput from "../../molecules/input-signin"

type FormValues = {
  email: string
  password: string
}

type LoginCardProps = {
  toResetPassword: () => void
}

const LoginCard: React.FC<LoginCardProps> = ({ toResetPassword }) => {
  const [isInvalidLogin, setIsInvalidLogin] = useState(false)
  const { register, handleSubmit, reset } = useForm<FormValues>()
  const navigate = useNavigate()
  const login = useAdminLogin()

  const onSubmit = (values: FormValues) => {
    login.mutate(values, {
      onSuccess: () => {
        navigate("/a/orders")
      },
      onError: () => {
        setIsInvalidLogin(true)
        reset()
      },
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center">
        {/* <span className="inter-2xlarge-semibold mt-4 text-grey-90"> */}
        {/*   Welcome back! */}
        {/* </span> */}
        {/* <span className="inter-base-regular mt-2 text-grey-50"> */}
        {/*   It's great to see you 👋🏼 */}
        {/* </span> */}
        <h1 className="inter-2xlarge-semibold mb-xlarge text-grey-90">
          Connexion
        </h1>
        {/* <span className="inter-base-regular mt-1 mb-xlarge text-grey-50"> */}
        {/*   Gestion Client & Inventaire pour ID Tendances */}
        {/* </span> */}
        <SigninInput
          placeholder="Courriel..."
          {...register("email", { required: true })}
          autoComplete="email"
        />
        <SigninInput
          placeholder="Mot de passe..."
          type={"password"}
          {...register("password", { required: true })}
          autoComplete="current-password"
        />
        {isInvalidLogin && (
          <span className="inter-small-regular mt-2 w-full text-rose-50">
            Identifiants incorrects
          </span>
        )}
        <Button
          className="inter-base-regular mt-4 w-[320px] rounded-rounded"
          variant="primary"
          size="large"
          type="submit"
          loading={login.isLoading}
        >
          Continuer
        </Button>
        <span
          className="inter-small-regular mt-8 cursor-pointer text-grey-50"
          onClick={toResetPassword}
        >
          Réinitialiser mon mot de passe
        </span>
      </div>
    </form>
  )
}

export default LoginCard
