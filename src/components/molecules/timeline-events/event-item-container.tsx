import React from "react"

type EventItemContainerProps = {
  item: {
    thumbnail?: string
    title: string
    quantity: number
    variant: {
      title: string
    }
  }
}

const EventItemContainer: React.FC<EventItemContainerProps> = ({ item }) => {
  if (!item) {
    return null
  }
  return (
    <div className="mb-base flex items-center gap-x-small last:mb-0">
      {item.thumbnail && (
        <div className="h-10 w-[30px] overflow-hidden rounded-base">
          <img
            src={item.thumbnail}
            alt={`Vignette pour ${item.title}`}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="inter-small-regular flex w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <p>{item.title}</p>
          <span className="inter-small-semibold text-violet-60">{`x${item.quantity}`}</span>
        </div>
        <p className="text-grey-50">{item.variant.title}</p>
      </div>
    </div>
  )
}

export default EventItemContainer
