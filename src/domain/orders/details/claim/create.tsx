import {
  Address,
  AdminPostOrdersOrderClaimsReq,
  Order,
  ProductVariant,
  ShippingOption,
} from "@medusajs/medusa"
import clsx from "clsx"
import {
  useAdminCreateClaim,
  useAdminOrder,
  useAdminShippingOptions,
} from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import Button from "../../../../components/fundamentals/button"
import CheckIcon from "../../../../components/fundamentals/icons/check-icon"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../components/molecules/modal/layered-modal"
import RMAShippingPrice from "../../../../components/molecules/rma-select-shipping"
import Select from "../../../../components/molecules/select"
import CurrencyInput from "../../../../components/organisms/currency-input"
import RMAReturnProductsTable from "../../../../components/organisms/rma-return-product-table"
import RMASelectProductTable from "../../../../components/organisms/rma-select-product-table"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"
import RMAEditAddressSubModal from "../rma-sub-modals/address"
import RMASelectProductSubModal from "../rma-sub-modals/products"
import { filterItems } from "../utils/create-filtering"

type ClaimMenuProps = {
  order: Omit<Order, "beforeInsert">
  onDismiss: () => void
}

type ReturnRecord = Record<
  string,
  {
    images: string[]
    note: string
    quantity: number
    reason: {
      label: string
      value?: "missing_item" | "wrong_item" | "production_failure" | "other"
    } | null
  }
>

type SelectProduct = Omit<ProductVariant & { quantity: number }, "beforeInsert">

type CustomPrice = {
  return?: number
  standard: number
}

export type AddressPayload =
  | {
      address_1: string
      address_2: string
      company: string
      city: string
      country_code: string
      first_name: string
      last_name: string
      phone: string
      postal_code: string
      province: string
    }
  | undefined

const reasonOptions = [
  {
    label: "Article manquant",
    value: "missing_item",
  },
  {
    label: "Mauvais article",
    value: "wrong_item",
  },
  {
    label: "Défaut de fabrication",
    value: "production_failure",
  },
  {
    label: "Autre",
    value: "other",
  },
]

const ClaimMenu: React.FC<ClaimMenuProps> = ({ order, onDismiss }) => {
  const { mutate, isLoading } = useAdminCreateClaim(order.id)
  const { refetch } = useAdminOrder(order.id)
  const [shippingAddress, setShippingAddress] =
    useState<AddressPayload>(undefined)

  const [isReplace, toggleReplace] = useState(false)
  const [noNotification, setNoNotification] = useState(order.no_notification)
  const [toReturn, setToReturn] = useState<ReturnRecord>({})

  const [itemsToAdd, setItemsToAdd] = useState<SelectProduct[]>([])
  const [returnShippingMethod, setReturnShippingMethod] =
    useState<ShippingOption | null>(null)
  const [returnShippingPrice, setReturnShippingPrice] = useState<
    number | undefined
  >(undefined)
  const [shippingMethod, setShippingMethod] = useState<ShippingOption | null>(
    null
  )
  const [showCustomPrice, setShowCustomPrice] = useState({
    standard: false,
    return: false,
  })
  const [customOptionPrice, setCustomOptionPrice] = useState<CustomPrice>({
    standard: 0,
    return: undefined,
  })
  const [ready, setReady] = useState(false)

  const notification = useNotification()

  const layeredModalContext = useContext(LayeredModalContext)

  // Includes both order items and swap items
  const [allItems, setAllItems] = useState<any[]>([])

  const formatAddress = (address) => {
    const addr = [address.address_1]
    if (address.address_2) {
      addr.push(address.address_2)
    }

    const city = `${address.postal_code} ${address.city}`

    return `${addr.join(", ")}, ${city}, ${address.country_code?.toUpperCase()}`
  }

  useEffect(() => {
    if (order) {
      setAllItems(filterItems(order, true))
    }
  }, [order])

  const { shipping_options: returnShippingOptions } = useAdminShippingOptions({
    is_return: true,
    region_id: order.region_id,
  })

  const { shipping_options: shippingOptions } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: false,
  })

  useEffect(() => {
    if (toReturn) {
      if (
        Object.keys(toReturn).length !== 0 &&
        isReplace &&
        itemsToAdd.length > 0 &&
        shippingMethod
      ) {
        setReady(true)
      } else if (!isReplace && Object.keys(toReturn).length !== 0) {
        setReady(true)
      } else {
        setReady(false)
      }
    } else {
      setReady(false)
    }
  }, [toReturn, isReplace, itemsToAdd, shippingMethod])

  useEffect(() => {
    if (!isReplace) {
      setShippingMethod(null)
      setShowCustomPrice({
        ...showCustomPrice,
        standard: false,
      })
    }
  }, [isReplace])

  useEffect(() => {
    setCustomOptionPrice({
      ...customOptionPrice,
      standard: 0,
    })
  }, [shippingMethod, showCustomPrice])

  const onSubmit = () => {
    const claim_items = Object.entries(toReturn).map(([key, value]) => {
      return {
        item_id: key,
        note: value.note ?? undefined,
        quantity: value.quantity,
        reason: value.reason?.value,
      }
    })

    const data: AdminPostOrdersOrderClaimsReq = {
      type: isReplace ? "replace" : "refund",
      claim_items,
      additional_items: itemsToAdd.map((i) => ({
        variant_id: i.id,
        quantity: i.quantity,
      })),
      no_notification:
        noNotification !== order.no_notification ? noNotification : undefined,
    }

    if (shippingAddress) {
      data.shipping_address = shippingAddress
    }

    if (returnShippingMethod) {
      data.return_shipping = {
        option_id: returnShippingMethod.id,
        price:
          showCustomPrice.return && customOptionPrice.return
            ? customOptionPrice.return * 100
            : Math.round(
                returnShippingPrice || 0 / (1 + (order.tax_rate || 0 / 100))
              ),
      }
    }

    if (shippingMethod) {
      data.shipping_methods = [
        {
          option_id: shippingMethod.id,
          price: customOptionPrice.standard * 100,
        },
      ]
    }

    mutate(data, {
      onSuccess: () => {
        refetch()
        notification("Succès", "Réclamation créée avec succès", "success")
        onDismiss()
      },
      onError: (error) => {
        notification("Erreur", getErrorMessage(error), "error")
      },
    })
  }

  const handleToAddQuantity = (value: number, index: number) => {
    const updated = [...itemsToAdd]
    updated[index] = {
      ...itemsToAdd[index],
      quantity: itemsToAdd[index].quantity + value,
    }

    setItemsToAdd(updated)
  }

  const handleRemoveItem = (index) => {
    const updated = [...itemsToAdd]
    updated.splice(index, 1)
    setItemsToAdd(updated)
  }

  const handleReturnShippingSelected = (so: Option) => {
    if (!so) {
      setReturnShippingMethod(null)
      return
    }

    const selectSo = returnShippingOptions?.find((s) => so.value === s.id)
    if (selectSo) {
      setReturnShippingMethod(selectSo)
      setReturnShippingPrice(
        selectSo.amount * (1 + (order.tax_rate || 0 / 100))
      )
    } else {
      setReturnShippingMethod(null)
      setReturnShippingPrice(0)
    }
  }

  const handleShippingSelected = (so: Option) => {
    const selectSo = shippingOptions?.find((s) => so.value === s.id)
    if (selectSo) {
      setShippingMethod(selectSo)
    } else {
      setShippingMethod(null)
    }
  }

  const handleProductSelect = (variants: SelectProduct[]) => {
    const existingIds = itemsToAdd.map((i) => i.id)

    setItemsToAdd((itemsToAdd) => [
      ...itemsToAdd,
      ...variants
        .filter((variant) => !existingIds.includes(variant.id))
        .map((variant) => ({ ...variant, quantity: 1 })),
    ])
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={onDismiss}>
      <Modal.Body>
        <Modal.Header handleClose={onDismiss}>
          <h2 className="inter-xlarge-semibold">Créer une réclamation</h2>
        </Modal.Header>
        <Modal.Content>
          <div>
            <h3 className="inter-base-semibold">Articles à réclamer</h3>
            <RMASelectProductTable
              order={order}
              allItems={allItems}
              imagesOnReturns={true}
              customReturnOptions={reasonOptions}
              toReturn={toReturn}
              setToReturn={(items) => setToReturn(items)}
            />
          </div>
          <div className="mt-4">
            <h3 className="inter-base-semibold">
              Retour
              {returnShippingMethod && (
                <span className="inter-base-regular text-grey-40">
                  ({returnShippingMethod.region.name})
                </span>
              )}
            </h3>
            <Select
              clearSelected
              label="Méthode de livraison"
              className="mt-2"
              placeholder="Ajouter une méthode de livraison"
              value={
                returnShippingMethod
                  ? {
                      label: returnShippingMethod.name,
                      value: returnShippingMethod.id,
                    }
                  : null
              }
              onChange={handleReturnShippingSelected}
              options={
                returnShippingOptions?.map((o) => ({
                  label: o.name,
                  value: o.id,
                })) || []
              }
            />
            {returnShippingMethod && (
              <RMAShippingPrice
                useCustomShippingPrice={showCustomPrice.return}
                shippingPrice={customOptionPrice.return || undefined}
                currencyCode={returnShippingMethod.region.currency_code}
                updateShippingPrice={(value) =>
                  setCustomOptionPrice({
                    ...customOptionPrice,
                    return: value,
                  })
                }
                setUseCustomShippingPrice={(value) => {
                  setCustomOptionPrice({
                    ...customOptionPrice,
                    return: returnShippingMethod.amount,
                  })

                  setShowCustomPrice({
                    ...showCustomPrice,
                    return: value,
                  })
                }}
              />
            )}
          </div>
          <div className="inter-base-regular mt-4 flex w-full items-center gap-x-xlarge">
            <div
              className="flex cursor-pointer items-center"
              onClick={() => {
                toggleReplace(true)
              }}
            >
              <div
                className={clsx(
                  "mr-3 flex h-5 w-5 items-center justify-center rounded-full",
                  {
                    "border-2 border-violet-60": isReplace,
                    "border border-grey-40": !isReplace,
                  }
                )}
              >
                {isReplace && (
                  <div className="h-3 w-3 rounded-full bg-violet-60"></div>
                )}
              </div>
              Remplacer
            </div>
            <div
              className="flex cursor-pointer items-center"
              onClick={() => {
                toggleReplace(false)
              }}
            >
              <div
                className={clsx(
                  "mr-3 flex h-5 w-5 items-center justify-center rounded-full",
                  {
                    "border-2 border-violet-60": !isReplace,
                    "border border-grey-40": isReplace,
                  }
                )}
              >
                {!isReplace && (
                  <div className="h-3 w-3 rounded-full bg-violet-60"></div>
                )}
              </div>
              Rembourser
            </div>
          </div>
          {isReplace && (
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <h3 className="inter-base-semibold ">Articles à envoyer</h3>
                {itemsToAdd.length === 0 ? (
                  <Button
                    variant="ghost"
                    className="border border-grey-20"
                    size="small"
                    onClick={() => {
                      layeredModalContext.push(
                        SelectProductsScreen(
                          layeredModalContext.pop,
                          itemsToAdd,
                          handleProductSelect
                        )
                      )
                    }}
                  >
                    Ajouter un produit
                  </Button>
                ) : (
                  <></>
                )}
              </div>
              {itemsToAdd.length > 0 && (
                <>
                  <RMAReturnProductsTable
                    order={order}
                    itemsToAdd={itemsToAdd}
                    handleRemoveItem={handleRemoveItem}
                    handleToAddQuantity={handleToAddQuantity}
                  />

                  <div className="flex w-full justify-end">
                    <Button
                      variant="ghost"
                      className="border border-grey-20"
                      size="small"
                      onClick={() => {
                        layeredModalContext.push(
                          SelectProductsScreen(
                            layeredModalContext.pop,
                            itemsToAdd,
                            handleProductSelect
                          )
                        )
                      }}
                    >
                      Ajouter un produit
                    </Button>
                  </div>
                </>
              )}
              <div className="mt-8">
                <span className="inter-base-semibold">
                  Adresse de livraison
                </span>
                {shippingAddress ? (
                  <>
                    <div className="inter-small-regular flex w-full text-grey-50">
                      {formatAddress(shippingAddress)}
                    </div>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={() => {
                          layeredModalContext.push(
                            showEditAddressScreen(
                              layeredModalContext.pop,
                              shippingAddress,
                              order,
                              setShippingAddress
                            )
                          )
                        }}
                        variant="ghost"
                        size="small"
                        className="border border-grey-20"
                      >
                        Modifier
                      </Button>
                    </div>
                  </>
                ) : (
                  <div>
                    <span className="inter-small-regular flex w-full text-grey-50">
                      {formatAddress(order.shipping_address)}
                    </span>
                    <div className="flex w-full justify-end">
                      <Button
                        onClick={() => {
                          layeredModalContext.push(
                            showEditAddressScreen(
                              layeredModalContext.pop,
                              mapAddress(order.shipping_address),
                              order,
                              setShippingAddress
                            )
                          )
                        }}
                        variant="ghost"
                        size="small"
                        className="border border-grey-20"
                      >
                        Livrer à une autre adresse
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <h3 className="inter-base-semibold mt-8">Livraison nouvelle</h3>
                <span className="inter-small-regular text-grey-50">
                  La livraison de nouveaux articles est gratuite par défaut.
                  Utilisez un prix personnalisé pour ajouter des frais.
                </span>
                <Select
                  label="Méthode de livraison"
                  className="mt-2"
                  placeholder="Ajouter une méthode de livraison"
                  value={
                    shippingMethod
                      ? {
                          label: shippingMethod?.name,
                          value: shippingMethod?.id,
                        }
                      : null
                  }
                  onChange={handleShippingSelected}
                  options={
                    shippingOptions?.map((o) => ({
                      label: o.name,
                      value: o.id,
                    })) || []
                  }
                />
                <div>
                  {shippingMethod ? (
                    <>
                      <div className="flex w-full justify-end">
                        {!showCustomPrice.standard && (
                          <Button
                            variant="ghost"
                            size="small"
                            className="mt-4 border border-grey-20 "
                            disabled={!shippingMethod}
                            onClick={() =>
                              setShowCustomPrice({
                                ...showCustomPrice,
                                standard: true,
                              })
                            }
                          >
                            {showCustomPrice.standard
                              ? "Soumettre"
                              : "Appliquer le prix personnalisé"}
                          </Button>
                        )}
                        {showCustomPrice.standard && (
                          <div className="flex w-full items-center">
                            <CurrencyInput.Root
                              readOnly
                              className="mt-4 w-full"
                              size="small"
                              currentCurrency={order.currency_code}
                            >
                              <CurrencyInput.Amount
                                label={"Montant"}
                                amount={customOptionPrice.standard}
                                onChange={(value) =>
                                  setCustomOptionPrice({
                                    ...customOptionPrice,
                                    standard: value || 0,
                                  })
                                }
                              />
                            </CurrencyInput.Root>
                            <Button
                              onClick={() =>
                                setShowCustomPrice({
                                  ...showCustomPrice,
                                  standard: false,
                                })
                              }
                              className="ml-8 h-8 w-8 text-grey-40"
                              variant="ghost"
                              size="small"
                            >
                              <TrashIcon size={20} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          )}
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-between">
            <div
              className="flex h-full cursor-pointer items-center"
              onClick={() => setNoNotification(!noNotification)}
            >
              <div
                className={`flex h-5 w-5 justify-center rounded-base border border-grey-30 text-grey-0 ${
                  !noNotification && "bg-violet-60"
                }`}
              >
                <span className="self-center">
                  {!noNotification && <CheckIcon size={16} />}
                </span>
              </div>
              <input
                id="noNotification"
                className="hidden"
                name="noNotification"
                checked={!noNotification}
                onChange={() => setNoNotification(!noNotification)}
                type="checkbox"
              />
              <span className="ml-3 flex items-center gap-x-xsmall text-grey-90">
                Envoyer une notification
                <IconTooltip content="Notify customer of created return" />
              </span>
            </div>
            <div className="flex gap-x-xsmall">
              <Button
                onClick={() => onDismiss()}
                className="w-[112px]"
                type="submit"
                size="small"
                variant="ghost"
              >
                Annuler
              </Button>
              <Button
                onClick={onSubmit}
                disabled={!ready || isLoading}
                loading={isLoading}
                className="w-[112px]"
                size="small"
                variant="primary"
              >
                Compléter
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const SelectProductsScreen = (pop, itemsToAdd, setSelectedItems) => {
  return {
    title: "Ajouter des produits",
    onBack: () => pop(),
    view: (
      <RMASelectProductSubModal
        selectedItems={itemsToAdd || []}
        onSubmit={setSelectedItems}
      />
    ),
  }
}

const showEditAddressScreen = (
  pop: () => void,
  address: AddressPayload,
  order: Omit<Order, "beforeInsert">,
  setShippingAddress: (address: AddressPayload) => void
) => {
  return {
    title: "Modifier l'adresse",
    onBack: () => pop(),
    view: (
      <RMAEditAddressSubModal
        onSubmit={setShippingAddress}
        address={address}
        order={order}
      />
    ),
  }
}

const mapAddress = (address: Address): AddressPayload => {
  return {
    first_name: address.first_name || "",
    last_name: address.last_name || "",
    company: address.company || "",
    address_1: address.address_1 || "",
    address_2: address.address_2 || "",
    city: address.city || "",
    province: address.province || "",
    postal_code: address.postal_code || "",
    country_code: address.country_code || "",
    phone: address.phone || "",
  }
}

export default ClaimMenu
