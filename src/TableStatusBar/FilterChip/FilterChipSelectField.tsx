import { useCallback, useMemo, useState } from 'react'

import {
	FilterOption,
	Table_Column,
	TableData,
	TableInstance,
} from '../../TableComponent'
import { getColumnFilterOptions } from '../../utils/getColumnFilterOptions'
import { splitFilterOptions } from '../../utils/splitFilterOptions'
import { DropdownContentHeader } from '../../components/DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../../components/DropdownContent/DropdownContentSearch'

import { FilterChipList } from './FilterChipList'

type Props<TData extends TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
}
export const FilterChipSelectField = <TData extends TableData>({
	column,
	table,
}: Props<TData>) => {
	const headerTitle = column.columnDef.header
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const filterValue = column.getFilterValue() as string[]
	const options = useMemo(
		() => getColumnFilterOptions(column, table),
		[column, table]
	)
	const { selectedOptions, notSelectedOptions } = useMemo(
		() => splitFilterOptions(options, filterValue),
		[options, filterValue]
	)

	const handleClearAll = () => {
		column.setFilterValue(undefined)
	}
	const handleAppend = useCallback(
		(option: FilterOption) => {
			setIsSearchActive(false)
			setSearchValue('')
			column.setFilterValue((oldValue) => [...oldValue, option.value])
		},
		[column]
	)

	const handleRemove = useCallback(
		(option: FilterOption) => {
			column.setFilterValue((oldValue) =>
				oldValue.filter((v) => v !== option.value)
			)
		},
		[column]
	)

	const filteredSearchOptions = useMemo(
		() =>
			notSelectedOptions.filter((el) =>
				el.label.toLowerCase().includes(searchValue.toLowerCase())
			),
		[notSelectedOptions, searchValue]
	)

	return (
		<>
			<DropdownContentHeader
				headerTitle={headerTitle}
				onClearAll={handleClearAll}
			/>

			<DropdownContentSearch
				value={searchValue}
				onChange={setSearchValue}
				isSearchActive={isSearchActive}
				setIsSearchActive={setIsSearchActive}
			/>

			<>
				{isSearchActive ? (
					<FilterChipList
						sx={{ maxHeight: 200, overflowY: 'auto' }}
						options={filteredSearchOptions}
						onOptionClick={handleAppend}
					/>
				) : (
					<FilterChipList
						options={selectedOptions}
						onOptionClick={handleRemove}
						isCheckedOptions
					/>
				)}
			</>
		</>
	)
}
