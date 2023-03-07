import { Currency } from "@medusajs/medusa"
import { useAdminCurrencies, useAdminUpdateStore } from "medusa-react"
import React, { useContext, useEffect, useState } from "react"
import { usePagination, useRowSelect, useSortBy, useTable } from "react-table"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import useNotification from "../../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../../utils/error-messages"
import { useEditCurrenciesModal } from "./edit-currencies-modal"
import CurrenciesTable from "./table"
import { useCurrencyColumns } from "./use-currency-table-columns"

const LIMIT = 15

const AddCurrenciesScreen = () => {
  const [offset, setOffset] = useState(0)
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([])

  const { onClose, store } = useEditCurrenciesModal()
  const { reset, pop } = useContext(LayeredModalContext)

  const { currencies, count, isLoading } = useAdminCurrencies(
    {
      limit: LIMIT,
      offset,
    },
    {
      keepPreviousData: true,
    }
  )

  const { mutate, isLoading: isMutating } = useAdminUpdateStore()
  const notification = useNotification()

  const onSubmit = (next: () => void) => {
    mutate(
      {
        currencies: [
          ...store.currencies.map((curr) => curr.code),
          ...selectedRowIds,
        ],
      },
      {
        onSuccess: () => {
          notification("Succès", "Devises mises à jour avec succès", "success")
          next()
        },
        onError: (err) => {
          notification("Erreur", getErrorMessage(err), "error")
        },
      }
    )
  }

  const data = React.useMemo(() => {
    return currencies || []
  }, [currencies])

  const columns = useCurrencyColumns()

  const tableState = useTable<Currency>(
    {
      data: data,
      columns,
      manualPagination: true,
      initialState: {
        pageIndex: Math.floor(offset / LIMIT),
        pageSize: LIMIT,
      },
      autoResetPage: false,
      autoResetSelectedRows: false,
      getRowId: (row) => row.code,
      pageCount: Math.ceil((count || 0) / LIMIT),
      defaultColumn: {
        width: "auto",
      },
    },
    useSortBy,
    usePagination,
    useRowSelect
  )

  return (
    <>
      <Modal.Content>
        <CurrenciesTable
          isLoading={isLoading}
          setQuery={() => {}}
          setSelectedRowIds={setSelectedRowIds}
          count={count || 0}
          tableState={tableState}
          setOffset={setOffset}
          offset={offset}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full items-center justify-end gap-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            Annuler
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() =>
              onSubmit(() => {
                pop()
              })
            }
          >
            Sauvegarder
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export const useAddCurrenciesModalScreen = () => {
  const { pop, push } = useContext(LayeredModalContext)

  return {
    screen: {
      title: "Ajouter les devises de la boutique",
      onBack: pop,
      view: <AddCurrenciesScreen />,
    },
    push,
  }
}

export default AddCurrenciesScreen
