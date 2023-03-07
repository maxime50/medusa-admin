import { Order } from "@medusajs/medusa"
import moment from "moment"
import { useMemo, useRef } from "react"
import { Column } from "react-table"
import { useObserveWidth } from "../../../hooks/use-observe-width"
import { stringDisplayPrice } from "../../../utils/prices"
import Tooltip from "../../atoms/tooltip"
import ImagePlaceholder from "../../fundamentals/image-placeholder"
import StatusIndicator from "../../fundamentals/status-indicator"

const decidePaymentStatus = (status: string) => {
  switch (status) {
    case "captured":
      return <StatusIndicator variant="success" title={"Payée"} />
    case "awaiting":
      return <StatusIndicator variant="warning" title={"En attente"} />
    case "requires":
      return <StatusIndicator variant="danger" title={"Action requise"} />
    default:
      return <StatusIndicator variant="primary" title={"N/A"} />
  }
}

const decideFulfillmentStatus = (status: string) => {
  switch (status) {
    case "fulfilled":
      return <StatusIndicator variant="success" title={"traitée"} />
    case "shipped":
      return <StatusIndicator variant="success" title={"Expédiée"} />
    case "not_fulfilled":
      return <StatusIndicator variant="default" title={"Non traitée"} />
    case "partially_fulfilled":
      return <StatusIndicator variant="warning" title={"Partiellement traitée"} />
    case "partially_shipped":
      return <StatusIndicator variant="warning" title={"Partiellement expédiée"} />
    case "requires":
      return <StatusIndicator variant="danger" title={"Action requise"} />
    default:
      return <StatusIndicator variant="primary" title={"N/A"} />
  }
}

export const useCustomerOrdersColumns = (): Column<Order>[] => {
  const columns = useMemo(() => {
    return [
      {
        Header: "Commande",
        accessor: "display_id",
        Cell: ({ value }) => {
          return <span className="text-grey-90">#{value}</span>
        },
      },
      {
        accessor: "items",
        Cell: ({ value }) => {
          const containerRef = useRef<HTMLDivElement>(null)
          const width = useObserveWidth(containerRef)

          const { visibleItems, remainder } = useMemo(() => {
            if (!value || value.length === 0) {
              return { visibleItems: [], remainder: 0 }
            }

            const columns = Math.max(Math.floor(width / 20) - 1, 1)
            const visibleItems = value.slice(0, columns)
            const remainder = value.length - columns

            return { visibleItems, remainder }
          }, [value, width])

          if (!value) {
            return null
          }

          return (
            <div className="flex gap-x-2xsmall">
              <div ref={containerRef} className="flex gap-x-xsmall">
                {visibleItems.map((item) => {
                  return (
                    <Tooltip content={item.title} key={item.id}>
                      <div className="h-[35px] w-[25px] flex items-center justify-center rounded-rounded overflow-hidden">
                        {item.thumbnail ? (
                          <img
                            className="object-cover"
                            src={item.thumbnail}
                            alt={item.title}
                          />
                        ) : (
                          <ImagePlaceholder />
                        )}
                      </div>
                    </Tooltip>
                  )
                })}
              </div>
              {remainder > 0 && (
                <span className="text-grey-40 inter-small-regular">
                  + {remainder} plus
                </span>
              )}
            </div>
          )
        },
      },
      {
        Header: "Date",
        accessor: "created_at",
        Cell: ({ value }) => {
          return moment(value).format("DD MMM YYYY hh:mm")
        },
      },
      {
        Header: "Traitement",
        accessor: "fulfillment_status",
        Cell: ({ value }) => {
          return decideFulfillmentStatus(value)
        },
      },
      {
        Header: "Status",
        accessor: "payment_status",
        Cell: ({ value }) => {
          return decidePaymentStatus(value)
        },
      },
      {
        Header: () => <div className="text-right">Total</div>,
        accessor: "total",
        Cell: ({
          value,
          row: {
            original: { currency_code },
          },
        }) => {
          return (
            <div className="text-right">
              {stringDisplayPrice({
                amount: value,
                currencyCode: currency_code,
              })}
            </div>
          )
        },
      },
    ] as Column<Order>[]
  }, [])

  return columns
}
