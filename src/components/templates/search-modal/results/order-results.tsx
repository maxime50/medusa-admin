import clsx from "clsx"
import React from "react"
import SectionCollapsible from "../section-collapsible"
import { useAdminOrders } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import { Link } from "react-router-dom"

type OrderResultsProps = {
  orders: ReturnType<typeof useAdminOrders>["orders"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const OrderResults = ({
  orders = [],
  getLIProps,
  offset,
  selected,
}: OrderResultsProps) => {
  return orders.length > 0 ? (
    <SectionCollapsible title={"Commandes"} length={orders?.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {orders?.map((order, index) => (
            <li
              {...getLIProps({ index: offset + index })}
              className={clsx("group rounded-rounded py-1.5 focus:bg-grey-5", {
                "bg-grey-5": selected === offset + index,
              })}
            >
              <Link
                to={`/a/orders/${order.id}`}
                className="flex items-center justify-between rounded-rounded px-base py-1.5"
              >
                <div className="flex items-center gap-x-3">
                  <span className="inter-small-semibold">
                    #{order.display_id}
                  </span>
                  <p className="inter-small-regular text-grey-90">
                    {order.email}
                  </p>
                </div>
                <span
                  className={clsx(
                    "inter-small-regular text-grey-40 group-focus:visible",
                    {
                      invisible: selected !== offset + index,
                    }
                  )}
                >
                  Aller à...
                </span>
              </Link>
            </li>
          ))}
        </div>
      </div>
    </SectionCollapsible>
  ) : null
}

export default OrderResults
