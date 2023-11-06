import React, { useCallback, useMemo, useState } from 'react'

import { ListFilterLoadingItem } from '../../components/ListFilterItem'
import {
	SelectOption,
	Table_Column,
	TableData,
	TableInstance,
} from '../../TableComponent'
import { getColumnFilterOptions } from '../../utils/getColumnFilterOptions'
import { splitFilterOptions } from '../../utils/splitFilterOptions'
import { getPascalCase } from '../../utils/getPascalCase'
import { DropdownContentHeader } from '../../components/DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../../components/DropdownContent/DropdownContentSearch'

import { FilterChipList } from './FilterChipList'

export type FilterChipSelectFieldProps<TData extends TableData = TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	options?: SelectOption[]
	loading?: boolean
	loadingText?: string
}
export const FilterChipSelectField = <TData extends TableData = TableData>({
	column,
	table,
	options: _options,
	loading,
	loadingText,
}: FilterChipSelectFieldProps<TData>) => {
	const {
		options: { localization },
	} = table
	const headerTitle = column.columnDef.header
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const filterValue = column.getFilterValue() as string[]
	const options = useMemo(
		() => _options ?? getColumnFilterOptions(column, table),
		[_options, column, table]
	)
	const { selectedOptions, notSelectedOptions } = useMemo(
		() => splitFilterOptions(options, filterValue),
		[options, filterValue]
	)

	const handleClearAll = () => {
		column.setFilterValue(undefined)
	}
	const handleAppend = useCallback(
		(option: SelectOption) => {
			setIsSearchActive(false)
			setSearchValue('')
			column.setFilterValue((oldValue) => [...oldValue, option.value])
		},
		[column]
	)

	const handleRemove = useCallback(
		(option: SelectOption) => {
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
				analyticsElementName={`FilteringChip_${getPascalCase(
					headerTitle
				)}_ClearAll`}
				table={table}
			/>

			<DropdownContentSearch
				value={searchValue}
				onChange={setSearchValue}
				isSearchActive={isSearchActive}
				setIsSearchActive={setIsSearchActive}
			/>

			<>
				{loading ? (
					<ListFilterLoadingItem
						loadingText={loadingText ?? localization.loading}
					/>
				) : isSearchActive ? (
					<FilterChipList
						chipTitle={headerTitle}
						sx={{ maxHeight: 200, overflowY: 'auto' }}
						options={filteredSearchOptions}
						onOptionClick={handleAppend}
					/>
				) : (
					<FilterChipList
						chipTitle={headerTitle}
						options={selectedOptions}
						onOptionClick={handleRemove}
						isCheckedOptions
					/>
				)}
			</>
		</>
	)
}
