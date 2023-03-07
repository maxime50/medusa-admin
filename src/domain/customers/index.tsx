import BodyCard from "../../components/organisms/body-card"
import CustomerTable from "../../components/templates/customer-table"
import CustomerGroups from "./groups"
import Details from "./details"
import CustomersPageTableHeader from "./header"
import { Route, Routes } from "react-router-dom"

const CustomerIndex = () => {
  return (
    <div className="flex h-full grow flex-col">
      <div className="flex w-full grow flex-col">
        <BodyCard
          customHeader={<CustomersPageTableHeader activeView="clients" />}
          className="h-fit"
        >
          <CustomerTable />
        </BodyCard>
      </div>
    </div>
  )
}

const Customers = () => {
  return (
    <Routes>
      <Route index element={<CustomerIndex />} />
      <Route path="/groups/*" element={<CustomerGroups />} />
      <Route path="/:id" element={<Details />} />
    </Routes>
  )
}

export default Customers
