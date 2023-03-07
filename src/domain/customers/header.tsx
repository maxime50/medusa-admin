import React from "react"

import TableViewHeader from "../../components/organisms/custom-table-header"
import { useNavigate } from "react-router-dom"

type P = {
  activeView: "clients" | "groups"
}

/*
 * Shared header component for "customers" and "customer groups" page
 */
function CustomersPageTableHeader(props: P) {
  const navigate = useNavigate()
  return (
    <TableViewHeader
      setActiveView={(v) => {
        if (v === "clients") {
          navigate(`/a/customers`)
        } else {
          navigate(`/a/customers/groups`)
        }
      }}
      views={["clients", "groups"]}
      activeView={props.activeView}
    />
  )
}

export default CustomersPageTableHeader
