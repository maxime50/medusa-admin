import { useAdminProductTags } from "medusa-react"
import React, { useContext, useState } from "react"
import Button from "../../../../../../../components/fundamentals/button"
import Modal from "../../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../../components/molecules/modal/layered-modal"
import { SelectableTable } from "../../../../../../../components/templates/selectable-table"
import useQueryFilters from "../../../../../../../hooks/use-query-filters"
import { defaultQueryProps } from "../../../../../new/discount-form/condition-tables/shared/common"
import {
  TagColumns,
  TagHeader,
  TagRow,
} from "../../../../../new/discount-form/condition-tables/shared/tags"
import { useEditConditionContext } from "../../edit-condition-provider"

const AddTagsConditionsScreen = () => {
  const params = useQueryFilters(defaultQueryProps)

  const { pop } = useContext(LayeredModalContext)

  const [selectedResources, setSelectedResources] = useState<string[]>([])

  const { isLoading, count, product_tags } = useAdminProductTags(
    params.queryObject,
    {
      keepPreviousData: true,
    }
  )

  const { saveAndClose, saveAndGoBack } = useEditConditionContext()

  return (
    <>
      <Modal.Content>
        <SelectableTable
          options={{
            enableSearch: true,
            immediateSearchFocus: true,
            searchPlaceholder: "Rechercher...",
          }}
          resourceName="Tags"
          totalCount={count ?? 0}
          selectedIds={selectedResources}
          data={product_tags || []}
          columns={TagColumns}
          isLoading={isLoading}
          onChange={(ids) => setSelectedResources(ids)}
          renderRow={TagRow}
          renderHeaderGroup={TagHeader}
          {...params}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full justify-end space-x-xsmall">
          <Button variant="secondary" size="small" onClick={pop}>
            Annuler
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndGoBack(selectedResources)}
          >
            Sauvegarder et retourner en arrière
          </Button>
          <Button
            variant="primary"
            size="small"
            onClick={() => saveAndClose(selectedResources)}
          >
            Sauvegarder et fermer
          </Button>
        </div>
      </Modal.Footer>
    </>
  )
}

export default AddTagsConditionsScreen
