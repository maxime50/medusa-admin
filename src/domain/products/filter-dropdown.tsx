import clsx from "clsx"
import React, { useMemo, useEffect, useState } from "react"
import { useAdminProductTags, useAdminCollections } from "medusa-react"
import CheckIcon from "../../components/fundamentals/icons/check-icon"
import PlusIcon from "../../components/fundamentals/icons/plus-icon"
import FilterDropdownContainer from "../../components/molecules/filter-dropdown/container"
import FilterDropdownItem from "../../components/molecules/filter-dropdown/item"
import SaveFilterItem from "../../components/molecules/filter-dropdown/save-field"
import TagInput from "../../components/molecules/tag-input"
import TabFilter from "../../components/molecules/filter-tab"

const statusFilters = ["proposed", "draft", "published", "rejected"]

const COLLECTION_PAGE_SIZE = 10

const ProductsFilter = ({
  filters,
  submitFilters,
  clearFilters,
  tabs,
  onTabClick,
  activeTab,
  onRemoveTab,
  onSaveTab,
}) => {
  const [tempState, setTempState] = useState(filters)
  const [name, setName] = useState("")

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val)
    }
  }

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState)
    }
  }

  const handleTabClick = (tabName: string) => {
    if (onTabClick) {
      onTabClick(tabName)
    }
  }

  useEffect(() => {
    setTempState(filters)
  }, [filters])

  const onSubmit = () => {
    submitFilters(tempState)
  }

  const onClear = () => {
    clearFilters()
  }

  const numberOfFilters = useMemo(
    () =>
      Object.entries(filters || {}).reduce((acc, [, value]) => {
        if (value?.open) {
          acc = acc + 1
        }
        return acc
      }, 0),
    [filters]
  )

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }))
  }

  const [collectionsPagination, setCollectionsPagination] = useState({
    offset: 0,
    limit: COLLECTION_PAGE_SIZE,
  })

  const {
    collections,
    count,
    isLoading: isLoadingCollections,
  } = useAdminCollections(collectionsPagination)

  const { product_tags } = useAdminProductTags()

  const handlePaginateCollections = (direction) => {
    if (direction > 0) {
      setCollectionsPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }))
    } else if (direction < 0) {
      setCollectionsPagination((prev) => ({
        ...prev,
        offset: Math.max(prev.offset - prev.limit, 0),
      }))
    }
  }

  return (
    <div className="flex space-x-1">
      <FilterDropdownContainer
        submitFilters={onSubmit}
        clearFilters={onClear}
        triggerElement={
          <button
            className={clsx(
              "flex items-center space-x-1 rounded-rounded focus-visible:border-violet-60 focus-visible:shadow-input focus-visible:outline-none"
            )}
          >
            <div className="inter-small-semibold flex h-6 items-center rounded-rounded border border-grey-20 bg-grey-5 px-2">
              Filtres
              <div className="ml-1 flex items-center rounded text-grey-40">
                <span className="inter-small-semibold text-violet-60">
                  {numberOfFilters ? numberOfFilters : "0"}
                </span>
              </div>
            </div>
            <div className="inter-small-semibold flex items-center rounded-rounded border border-grey-20 bg-grey-5 p-1">
              <PlusIcon size={14} />
            </div>
          </button>
        }
      >
        <FilterDropdownItem
          filterTitle="Status"
          options={statusFilters}
          filters={tempState.status.filter}
          open={tempState.status.open}
          setFilter={(v) => setSingleFilter("status", v)}
        />
        <FilterDropdownItem
          filterTitle="Collection"
          options={
            collections?.map((c) => ({ value: c.id, label: c.title })) || []
          }
          isLoading={isLoadingCollections}
          hasPrev={collectionsPagination.offset > 0}
          hasMore={
            collectionsPagination.offset + collectionsPagination.limit <
            (count ?? 0)
          }
          onShowPrev={() => handlePaginateCollections(-1)}
          onShowNext={() => handlePaginateCollections(1)}
          filters={tempState.collection.filter}
          open={tempState.collection.open}
          setFilter={(v) => setSingleFilter("collection", v)}
        />
        <div className="flex w-full flex-col pb-2">
          <div
            className="mb-1 flex w-full cursor-pointer items-center rounded px-3 py-1.5 hover:bg-grey-5"
            onClick={() => {
              setSingleFilter("tags", {
                open: !tempState.tags.open,
                filter: tempState.tags.filter,
              })
            }}
          >
            <div
              className={`flex h-5 w-5 justify-center rounded-base border border-grey-30 text-grey-0 ${
                tempState.tags.open && "bg-violet-60"
              }`}
            >
              <span className="self-center">
                {tempState.tags.open && <CheckIcon size={16} />}
              </span>
              <input
                type="checkbox"
                className="hidden"
                id="Tags"
                name="Tags"
                value="Tags"
                checked={tempState.tags.open}
              />
            </div>
            <span
              className={clsx("ml-2 text-grey-90", {
                "inter-small-semibold": tempState.tags.open,
                "inter-small-regular": !tempState.tags.open,
              })}
            >
              Tags
            </span>
          </div>

          {tempState.tags.open && (
            <div
              data-tip={tempState.tags.invalidTagsMessage || ""}
              className="pl-6"
            >
              <TagInput
                className="pt-0 pb-1"
                showLabel={false}
                placeholder="Printemps, été..."
                values={(tempState.tags.filter || [])
                  .map((t) => {
                    const found = (product_tags || []).find((pt) => pt.id === t)
                    return found && found.value
                  })
                  .filter(Boolean)}
                onValidate={(newVal) => {
                  const found = (product_tags || []).find(
                    (pt) => pt.value.toLowerCase() === newVal.toLowerCase()
                  )
                  return found && found.id
                }}
                onChange={(values) => {
                  setSingleFilter("tags", {
                    open: tempState.tags.open,
                    filter: values,
                  })
                }}
              />
            </div>
          )}
        </div>
        <SaveFilterItem
          saveFilter={handleSaveTab}
          name={name}
          setName={setName}
        />
      </FilterDropdownContainer>
      {tabs &&
        tabs.map((t) => (
          <TabFilter
            key={t.value}
            onClick={() => handleTabClick(t.value)}
            label={t.label}
            isActive={activeTab === t.value}
            removable={!!t.removable}
            onRemove={() => handleRemoveTab(t.value)}
          />
        ))}
    </div>
  )
}

export default ProductsFilter
