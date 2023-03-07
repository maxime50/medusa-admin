import clsx from "clsx"
import React from "react"
import { formatAmountWithSymbol } from "../../../utils/prices"
import Button from "../../fundamentals/button"
import MinusIcon from "../../fundamentals/icons/minus-icon"
import PlusIcon from "../../fundamentals/icons/plus-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import Table from "../../molecules/table"

type RMAReturnProductsTableProps = {
  isAdditionalItems?: boolean
  order: any
  itemsToAdd: any[]
  handleToAddQuantity: (value, index) => void
  handleRemoveItem: (index) => void
}

const extractPrice = (prices, order) => {
  let price = prices.find((ma) => ma.region_id === order.region_id)

  if (!price) {
    price = prices.find((ma) => ma.currency_code === order.currency_code)
  }

  if (price) {
    return formatAmountWithSymbol({
      currency: order.currency_code,
      amount: price.amount * (1 + order.tax_rate / 100),
    })
  }

  return 0
}

const RMAReturnProductsTable: React.FC<RMAReturnProductsTableProps> = ({
  isAdditionalItems,
  order,
  itemsToAdd,
  handleRemoveItem,
  handleToAddQuantity,
}) => {
  return (
    <Table>
      <Table.HeadRow className="inter-small-semibold text-grey-50">
        <Table.HeadCell>Détails du produit</Table.HeadCell>
        <Table.HeadCell className="pr-8 text-right">Quantité</Table.HeadCell>
        <Table.HeadCell className="text-right">
          {isAdditionalItems ? "Prix unitaire" : "Remboursable"}
        </Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
        <Table.HeadCell></Table.HeadCell>
      </Table.HeadRow>
      <Table.Body>
        {itemsToAdd.map((item, index) => (
          <Table.Row className={clsx("border-b-grey-0 hover:bg-grey-0")}>
            <Table.Cell>
              <div className="flex min-w-[240px] py-2">
                <div className="h-[40px] w-[30px] ">
                  <img
                    className="h-full w-full rounded object-cover"
                    src={item.product.thumbnail}
                  />
                </div>
                <div className="inter-small-regular ml-4 flex flex-col text-grey-50">
                  <span>
                    <span className="text-grey-90">{item.product.title}</span>{" "}
                  </span>
                  <span>{item.title}</span>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell className="w-32 pr-8 text-right">
              <div className="flex w-full justify-end text-right text-grey-50 ">
                <span
                  onClick={() => handleToAddQuantity(-1, index)}
                  className="mr-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-grey-20"
                >
                  <MinusIcon size={16} />
                </span>
                <span>{item.quantity || ""}</span>
                <span
                  onClick={() => handleToAddQuantity(1, index)}
                  className={clsx(
                    "ml-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded hover:bg-grey-20"
                  )}
                >
                  <PlusIcon size={16} />
                </span>
              </div>
            </Table.Cell>
            <Table.Cell className="text-right">
              {extractPrice(item.prices, order)}
            </Table.Cell>
            <Table.Cell className="pr-1 text-right text-grey-40">
              {order.currency_code.toUpperCase()}
            </Table.Cell>
            <Table.Cell>
              <Button
                onClick={() => handleRemoveItem(index)}
                variant="ghost"
                size="small"
                className="h-8 w-8 text-grey-40"
              >
                <TrashIcon size={20} />
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}

export default RMAReturnProductsTable
