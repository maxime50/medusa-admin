import { useAdminCreateBatchJob } from "medusa-react"
import React, { useContext, useMemo, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"

import Button from "../../components/fundamentals/button"
import ExportIcon from "../../components/fundamentals/icons/export-icon"
import BodyCard from "../../components/organisms/body-card"
import TableViewHeader from "../../components/organisms/custom-table-header"
import ExportModal from "../../components/organisms/export-modal"
import OrderTable from "../../components/templates/order-table"
import useNotification from "../../hooks/use-notification"
import useToggleState from "../../hooks/use-toggle-state"
import { getErrorMessage } from "../../utils/error-messages"
import { PollingContext } from "../../context/polling"
import Details from "./details"
import { transformFiltersAsExportContext } from "./utils"

const VIEWS = ["Commandes", "Brouillons"]

const OrderIndex = () => {
  const view = "Commandes"

  const { resetInterval } = useContext(PollingContext)
  const navigate = useNavigate()
  const createBatchJob = useAdminCreateBatchJob()
  const notification = useNotification()

  const [contextFilters, setContextFilters] =
    useState<Record<string, { filter: string[] }>>()

  const {
    open: openExportModal,
    close: closeExportModal,
    state: exportModalOpen,
  } = useToggleState(false)

  const actions = useMemo(() => {
    return [
      <Button
        variant="secondary"
        size="small"
        onClick={() => openExportModal()}
      >
        <ExportIcon size={20} />
        Exporter
      </Button>,
    ]
  }, [view])

  const handleCreateExport = () => {
    const reqObj = {
      dry_run: false,
      type: "order-export",
      context: contextFilters
        ? transformFiltersAsExportContext(contextFilters)
        : {},
    }

    createBatchJob.mutate(reqObj, {
      onSuccess: () => {
        resetInterval()
        notification("Succès", "Exportation établie avec succès", "success")
      },
      onError: (err) => {
        notification("Erreur", getErrorMessage(err), "error")
      },
    })

    closeExportModal()
  }

  return (
    <>
      <div className="flex h-full grow flex-col">
        <div className="flex w-full grow flex-col">
          <BodyCard
            customHeader={
              <TableViewHeader
                views={VIEWS}
                setActiveView={(v) => {
                  if (v === "Brouillons") {
                    navigate(`/a/draft-orders`)
                  }
                }}
                activeView={view}
              />
            }
            className="h-fit"
            customActionable={actions}
          >
            <OrderTable setContextFilters={setContextFilters} />
          </BodyCard>
        </div>
      </div>
      {exportModalOpen && (
        <ExportModal
          title="Exporter les commandes"
          handleClose={() => closeExportModal()}
          onSubmit={handleCreateExport}
          loading={createBatchJob.isLoading}
        />
      )}
    </>
  )
}

const Orders = () => {
  return (
    <Routes>
      <Route index element={<OrderIndex />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default Orders
