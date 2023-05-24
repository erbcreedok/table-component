import { FC, useState } from 'react'
import { Box } from '@mui/material'

import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'
import { useFilterControls } from '../filter-bar-hooks/useFilterControls'
import { DropdownContentHeader } from '../DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../DropdownContent/DropdownContentSearch'

import { FiltersSearchResult } from './FilterChipSearch/FiltersSearchResult'
import { FilterChipList } from './FilterChipList/FilterChipList'

type FilterChipProps = {
	headerTile: string
	table: any
	filterId: string
}

export const FilterChip: FC<FilterChipProps> = ({
	table,
	filterId,
	headerTile,
}) => {
	const { currentFilterColumn, currentFilterValues, currentFilterHeader } =
		useFilterControls(table, filterId)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])

	const handleClearAll = () => {
		currentFilterColumn.setFilterValue([])
	}
	const applySelectedFilters = () => {
		setSearchValue('')
		setSelectedSearchedItems([])
	}

	const DropdownContent = (
		<Box sx={{ width: 300, padding: '6px 0' }}>
			<DropdownContentHeader
				headerTile={headerTile}
				onClearAll={handleClearAll}
			/>

			<DropdownContentSearch
				searchValue={searchValue}
				onChange={setSearchValue}
				isSearchActive={isSearchActive}
				setIsSearchActive={setIsSearchActive}
				onApplySelectedItems={applySelectedFilters}
				onClick={() => setIsSearchActive(true)}
			/>

			<>
				{isSearchActive && (
					<FiltersSearchResult
						table={table}
						searchValue={searchValue}
						filterId={filterId}
						selectedSearchedItems={selectedSearchedItems}
						setSelectedSearchedItems={setSelectedSearchedItems}
						setSearchValue={setSearchValue}
						setIsSearchActive={setIsSearchActive}
					/>
				)}

				{!isSearchActive && (
					<FilterChipList table={table} filterId={filterId} />
				)}
			</>
		</Box>
	)

	return (
		<div>
			<CommonChipWithPopover
				text={
					currentFilterValues?.reduce?.(
						(acc, label, index) => (index === 0 ? label : `${acc}, ${label}`),
						''
					) || ''
				}
				title={`${currentFilterHeader}: `}
				dropdownContent={DropdownContent}
				table={table}
			/>
		</div>
	)
}
