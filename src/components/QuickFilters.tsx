import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'

import {
	SelectOption,
	Table_Column,
	TableData,
	TableInstance,
} from '../TableComponent'

import { DropdownContentHeader } from './DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from './DropdownContent/DropdownContentSearch'
import { ListFilterItem } from './ListFilterItem'
import { NoOptions } from './NoOptions'

type Props<TData extends TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	selectedFilters: string[]
	filterOptions: SelectOption[]
	onCheckFilter: (value: string) => void
	onClearAll: () => void
}

export const QuickFilters = <TData extends TableData>({
	column,
	selectedFilters,
	filterOptions,
	onCheckFilter,
	onClearAll,
}: Props<TData>) => {
	const headerTitle = column.columnDef.header
	const [isSearchActive, setIsSearchActive] = useState(false)
	const [searchValue, setSearchValue] = useState('')

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
					{options.length ? options : <NoOptions />}
				</Box>
			</>
		</>
	)
}
