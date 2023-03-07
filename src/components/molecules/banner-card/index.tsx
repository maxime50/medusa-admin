import React from "react"
import Actionables, { ActionType } from "../../molecules/actionables"

type BannerCardProps = {
  actions?: ActionType[]
  title: string
  thumbnail: string | null
} & React.RefAttributes<HTMLDivElement>

type BannerCardDescriptionProps = {
  cta?: {
    label: string
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  }
}

const BannerCard: React.FC<BannerCardProps> & {
  Description: React.FC<BannerCardDescriptionProps>
  Footer: React.FC
} = ({ title, thumbnail, actions, children }) => {
  return (
    <div className="w-full rounded-rounded border border-grey-20 bg-grey-0 p-base medium:p-xlarge">
      <div className="flex items-start gap-large">
        {thumbnail && (
          <div className="h-[72px] min-h-[72px] w-[72px] min-w-[72px] overflow-hidden rounded-base">
            <img
              src={thumbnail}
              alt="Vignette"
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="w-full">
          <div className="flex items-center justify-between pb-2">
            <p className="inter-large-semibold">{title}</p>
            <Actionables actions={actions} />
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

const Description: React.FC<BannerCardDescriptionProps> = ({
  cta,
  children,
}) => {
  return (
    <div>
      <p className="inter-small-regular max-w-[460px] text-grey-50 line-clamp-2">
        {children}
      </p>
      {cta && (
        <button
          className="inter-small-semibold mt-base text-violet-60"
          onClick={cta.onClick}
        >
          {cta.label}
        </button>
      )}
    </div>
  )
}

const Footer: React.FC = ({ children }) => {
  return <div className="mt-base">{children}</div>
}

BannerCard.Description = Description
BannerCard.Footer = Footer

export default BannerCard
