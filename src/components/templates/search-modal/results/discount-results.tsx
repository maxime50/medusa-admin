import clsx from "clsx"
import React from "react"
import SectionCollapsible from "../section-collapsible"
import { useAdminDiscounts } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import { Link } from "react-router-dom"

type DiscountResultsProps = {
  discounts: ReturnType<typeof useAdminDiscounts>["discounts"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const DiscountResults = ({
  discounts = [],
  getLIProps,
  offset,
  selected,
}: DiscountResultsProps) => {
  return discounts.length > 0 ? (
    <SectionCollapsible title={"Rabais"} length={discounts?.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {discounts?.map((discount, index) => (
            <li
              {...getLIProps({ index: offset + index })}
              className={clsx(
                "group rounded-rounded px-base py-1.5 focus:bg-grey-5",
                { "bg-grey-5": selected === offset + index }
              )}
            >
              <Link
                to={`/a/discounts/${discount.id}`}
                className="flex items-center justify-between rounded-rounded py-1.5"
              >
                <div className="flex items-center gap-x-3">
                  <div className="rounded-rounded bg-grey-10 py-0.5 px-2">
                    <span className="inter-small-regular">{discount.code}</span>
                  </div>
                  <p className="inter-small-regular text-grey-90">
                    {discount.rule.description}
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

export default DiscountResults
