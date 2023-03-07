import React, { useContext, useEffect } from "react"
import { PollingContext } from "../../../context/polling"
import useOutsideClick from "../../../hooks/use-outside-click"
import Spinner from "../../atoms/spinner"
import SadFaceIcon from "../../fundamentals/icons/sad-face-icon"
import SidedMouthFaceIcon from "../../fundamentals/icons/sided-mouth-face"
import BatchJobActivityList from "../batch-jobs-activity-list"

const ActivityDrawer = ({ onDismiss }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const { batchJobs, hasPollingError, refetch } = useContext(PollingContext)
  useOutsideClick(onDismiss, ref)

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div
      ref={ref}
      className="fixed top-[64px] bottom-2 right-3 flex w-[400px] flex-col overflow-x-hidden rounded-rounded rounded bg-grey-0 shadow-dropdown"
    >
      <div className="inter-large-semibold pt-7 pl-8 pb-1">Activité</div>

      {!hasPollingError ? (
        batchJobs ? (
          <BatchJobActivityList batchJobs={batchJobs} />
        ) : (
          <EmptyActivityDrawer />
        )
      ) : (
        <ErrorActivityDrawer />
      )}
    </div>
  )
}

const EmptyActivityDrawer = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <SidedMouthFaceIcon size={36} />
      <span className={"inter-large-semibold mt-4 text-grey-90"}>
        C'est assez calme ici...
      </span>
      <span className={"inter-base-regular mt-4 text-center text-grey-60"}>
        Vous n'avez pas de notifications pour l'instant, mais dès que vous en
        aurez, elles s'afficheront ici.
      </span>
    </div>
  )
}

const ErrorActivityDrawer = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <SadFaceIcon size={36} />
      <span className={"inter-large-semibold mt-4 text-grey-90"}>Oups !</span>
      <span className={"inter-base-regular mt-2 text-center text-grey-60"}>
        Une erreur s'est produite lors de l'envoi de vos notifications :(
      </span>

      <div className="mt-4 flex items-center">
        <Spinner size={"small"} variant={"secondary"} />
        <span className="ml-2.5">Traitement...</span>
      </div>
    </div>
  )
}

export default ActivityDrawer
