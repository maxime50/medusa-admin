import clsx from "clsx"
import React from "react"
import SectionCollapsible from "../section-collapsible"
import { useAdminProducts } from "medusa-react"
import useKeyboardNavigationList from "../use-keyboard-navigation-list"
import { Link } from "react-router-dom"

type ProductResultsProps = {
  products: ReturnType<typeof useAdminProducts>["products"]
  getLIProps: ReturnType<typeof useKeyboardNavigationList>["getLIProps"]
  offset: number
  selected: number
}

const ProductResults = ({
  products = [],
  getLIProps,
  offset,
  selected,
}: ProductResultsProps) => {
  return products.length > 0 ? (
    <SectionCollapsible title={"Produits"} length={products.length || 0}>
      <div className="mt-large">
        <div className="flex flex-col">
          {products?.slice(0, 5).map((product, index) => (
            <li
              {...getLIProps({
                index: offset + index,
              })}
              className={clsx(
                "group rounded-rounded px-base py-1.5 focus:bg-grey-5",
                {
                  "bg-grey-5": selected === offset + index,
                }
              )}
            >
              <Link
                to={`/a/products/${product.id}`}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-x-3">
                  <img
                    src={product.thumbnail}
                    className="h-[32px] w-[24px] rounded object-cover"
                  />
                  <p className="inter-small-regular text-grey-90">
                    {product.title}
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

export default ProductResults
