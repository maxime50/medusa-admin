import React, { ReactNode } from "react"
import type { Toast } from "react-hot-toast"
import { toast as globalToast } from "react-hot-toast"
import RefreshIcon from "../../fundamentals/icons/refresh-icon"
import ToasterContainer from "../toaster-container"
import ErrorState from "./error-state"
import SavingState from "./saving-state"
import SuccessState from "./success-state"

type SaveNotificationProps = {
  toast: Toast
  icon?: ReactNode
  title?: string
  message?: string
  onSave: () => Promise<void>
  reset: () => void
}

const SaveNotification: React.FC<SaveNotificationProps> = ({
  toast,
  icon,
  title = "Modifications non sauvegardées",
  message = "Vous avez des modifications en cours. Voulez-vous les sauvegarder ou les annuler ?",
  onSave,
  reset,
}) => {
  const onDismiss = () => {
    reset()
    globalToast.dismiss(toast.id)
  }

  const handleSave = () => {
    globalToast.custom((t) => <SavingState toast={t} />, {
      id: toast.id,
    })

    onSave()
      .then(() => {
        globalToast.custom(
          (t) => <SuccessState toast={t} onDismiss={onDismiss} />,
          {
            id: toast.id,
          }
        )
      })
      .catch((_err) => {
        globalToast.custom(
          (t) => <ErrorState toast={t} onDismiss={onDismiss} />,
          {
            id: toast.id,
          }
        )
      })
  }

  return (
    <ToasterContainer visible={toast.visible} className="w-[448px] p-0 pl-base">
      <div className="py-base">{getIcon(icon)}</div>
      <div className="ml-small mr-base flex flex-grow flex-col gap-y-2xsmall py-base">
        <span className="inter-small-semibold">{title}</span>
        <span className="inter-small-regular text-grey-50">{message}</span>
      </div>
      <div className="inter-small-semibold flex h-full flex-col border-l border-grey-20">
        <button
          onClick={handleSave}
          className="inter-small-semibold flex h-1/2 items-center justify-center border-b border-grey-20 px-base text-violet-60"
        >
          Publier
        </button>
        <button
          className="inter-small-semibold flex h-1/2 items-center justify-center px-base"
          onClick={onDismiss}
        >
          Annuler
        </button>
      </div>
    </ToasterContainer>
  )
}

const ICON_SIZE = 20

function getIcon(icon?: any) {
  if (icon) {
    return React.cloneElement(icon, {
      size: ICON_SIZE,
      className: "text-grey-90",
    })
  } else {
    return <RefreshIcon size={20} className="text-grey-90" />
  }
}

export default SaveNotification
