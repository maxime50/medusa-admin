import { Product, ProductVariant } from "@medusajs/medusa"
import React from "react"
import { ActionType } from "../../molecules/actionables"
import { CollapsibleTree } from "../../molecules/collapsible-tree"

type LeafProps = {
  id: string
  title: string
  sku?: string
  prices: {
    id: string
    currency_code: string
    amount: number
    price_list_id: string | null
  }[]
}

type ProductVariantTreeProps = {
  product: Pick<Product, "title" | "id" | "thumbnail"> & {
    variants: LeafProps[]
  }
  getProductActions?: (product: Product) => ActionType[] | undefined
  getVariantActions?: (variant: ProductVariant) => ActionType[] | undefined
}

const ProductVariantTree: React.FC<ProductVariantTreeProps> = ({
  product,
  getProductActions,
  getVariantActions,
}) => {
  return (
    <CollapsibleTree>
      <CollapsibleTree.Parent
        actions={getProductActions && getProductActions(product as Product)}
      >
        <div>
          <img
            src={product.thumbnail || undefined}
            className="h-5 w-4 rounded-base"
          />
        </div>
        <span className="inter-small-semibold">{product.title}</span>
      </CollapsibleTree.Parent>
      <CollapsibleTree.Content>
        {product.variants.map((variant) => (
          <CollapsibleTree.Leaf
            key={variant.id}
            actions={
              getVariantActions && getVariantActions(variant as ProductVariant)
            }
          >
            <ProductVariantLeaf {...variant} />
          </CollapsibleTree.Leaf>
        ))}
      </CollapsibleTree.Content>
    </CollapsibleTree>
  )
}

const ProductVariantLeaf = ({ sku, title, prices = [] }: LeafProps) => {
  const filteredPrices = prices.filter((pr) => pr.price_list_id)
  return (
    <div className="flex flex-1">
      <div className="truncate">
        <span>{title}</span>
        {sku && <span className="ml-xsmall text-grey-50">(SKU: {sku})</span>}
      </div>
      <div className="flex flex-1 items-center justify-end text-grey-50">
        <div className="mr-xsmall text-grey-50">
          {filteredPrices.length ? (
            <span>{`${filteredPrices.length} prix`}</span>
          ) : (
            <span className="inter-small-semibold text-orange-40">
              Ajouter des prix
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductVariantTree
