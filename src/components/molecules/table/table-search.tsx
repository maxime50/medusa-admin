import clsx from "clsx"
import React from "react"
import SearchIcon from "../../fundamentals/icons/search-icon"

type TableSearchProps = {
  autoFocus?: boolean
  onSearch: (term: string) => void
  placeholder?: string
  searchValue?: string
} & React.HTMLAttributes<HTMLDivElement>

const TableSearch: React.FC<TableSearchProps> = ({
  autoFocus,
  onSearch,
  placeholder = "Rechercher",
  searchValue,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "inter-small-regular transition-color min-w-content mt-1 mb-1 flex w-60 items-center rounded-rounded border border-grey-20 bg-grey-5 py-1.5 pl-1 text-grey-50 focus-within:border-violet-60 focus-within:shadow-input",
        className
      )}
      {...props}
    >
      <span className="px-2.5 py-0.5">
        <SearchIcon size={16} />
      </span>
      <input
        autoFocus={autoFocus}
        type="text"
        value={searchValue}
        className={clsx(
          "inter-small-regular placeholder:inter-small-regular w-full bg-transparent placeholder-grey-40 caret-violet-60 focus:border-none focus:text-grey-90 focus:outline-none"
        )}
        placeholder={placeholder}
        onChange={(e) => {
          onSearch(e.target.value)
        }}
      />
    </div>
  )
}

export default TableSearch
