import { useCallback, useMemo, useState } from 'react'
import Box from '@mui/material/Box'

import {
	SelectOption,
	Table_Column,
	TableData,
	TableInstance,
} from '../TableComponent'
import { getColumnFilterOptions } from '../utils/getColumnFilterOptions'

import { DropdownContentHeader } from './DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from './DropdownContent/DropdownContentSearch'
import { ListFilterItem, ListFilterLoadingItem } from './ListFilterItem'
import { NoOptions } from './NoOptions'

export type QuickFiltersProps<Value, TData extends TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	value: Value[]
	onChange(value: Value[]): void
	options?: SelectOption[]
	loading?: boolean
	loadingText?: string
}

export const QuickFilters = <Value, TData extends TableData>({
	column,
	table,
	value: selectedFilters = [],
	onChange,
	options: _options,
	loading,
	loadingText,
}: QuickFiltersProps<Value, TData>) => {
	const {
		options: { localization },
	} = table
	const headerTitle = column.columnDef.header
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [searchValue, setSearchValue] = useState('')
	const filterOptions = useMemo(
		() => _options ?? getColumnFilterOptions(column, table),
		[_options, column, table]
	)

	const onCheckFilter = useCallback(
		(value: Value) => {
			if (selectedFilters.includes(value)) {
				const updatedFilters = selectedFilters.filter(
					(filter) => filter !== value
				)

				onChange(updatedFilters)

				return
			}

			onChange([...selectedFilters, value])
		},
		[onChange, selectedFilters]
	)

	const onClearAll = useCallback(() => {
		onChange([])
	}, [onChange])

	const options = useMemo(() => {
		return filterOptions
			.filter((filter) =>
				filter.label.toLowerCase().includes(searchValue.toLowerCase())
			)
			.map(({ value, label }) => {
				return (
					<ListFilterItem
						key={value?.toString()}
						isChecked={selectedFilters.includes(value)}
						title={label?.toString()}
						onClick={() => onCheckFilter(value)}
					/>
				)
			})
	}, [filterOptions, onCheckFilter, searchValue, selectedFilters])

	return (
		<>
			<DropdownContentHeader
				headerTitle={headerTitle}
				onClearAll={onClearAll}
			/>

			<DropdownContentSearch
				value={searchValue}
				onChange={setSearchValue}
				isSearchActive={isSearchActive}
				setIsSearchActive={setIsSearchActive}
			/>

			<>
				<Box sx={{ maxHeight: 220, overflowY: 'auto' }}>
					{loading ? (
						<ListFilterLoadingItem
							loadingText={loadingText ?? localization.loading}
						/>
					) : options.length ? (
						options
					) : (
						<NoOptions />
					)}
				</Box>
			</>
		</>
	)
}
