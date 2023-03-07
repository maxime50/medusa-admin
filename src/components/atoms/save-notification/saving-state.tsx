import React from "react"
import type { Toast } from "react-hot-toast"
import Spinner from "../spinner"
import ToasterContainer from "../toaster-container"

type SavingStateProps = {
  toast: Toast
  title?: string
  message?: string
}

const SavingState: React.FC<SavingStateProps> = ({
  toast,
  title = "Enregistrement des modifications",
  message = "Attendez un peu, ça peut prendre un petit moment.",
}) => {
  return (
    <ToasterContainer visible={toast.visible} className="w-[448px]">
      <div>
        <Spinner variant="secondary" size="large" />
      </div>
      <div className="ml-small mr-base flex flex-grow flex-col gap-y-2xsmall">
        <span className="inter-small-semibold">{title}</span>
        <span className="inter-small-regular text-grey-50">{message}</span>
      </div>
    </ToasterContainer>
  )
}

export default SavingState
