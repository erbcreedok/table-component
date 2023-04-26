import { FC, useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'

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

	onMount: (value: boolean) => void
}

export const FilterChip: FC<FilterChipProps> = ({
	table,
	filterId,
	onMount,
	headerTile,
}) => {
	const { resetColumnFilters } = table

	const { currentFilterValues, currentFilterHeader, currentFilterColumn } =
		useFilterControls(table, filterId)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])

	const handleClearAll = () => {
		resetColumnFilters()
	}
	const applySelectedFilters = () => {
		const updatedFilters = [...currentFilterValues, ...selectedSearchedItems]
		currentFilterColumn.setFilterValue(updatedFilters)
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
			/>

			<>
				{isSearchActive && (
					<FiltersSearchResult
						table={table}
						searchValue={searchValue}
						filterId={filterId}
						selectedSearchedItems={selectedSearchedItems}
						setSelectedSearchedItems={setSelectedSearchedItems}
					/>
				)}

				{!isSearchActive && (
					<FilterChipList table={table} filterId={filterId} />
				)}
			</>
		</Box>
	)

	useEffect(() => {
		onMount(true)

		return () => {
			onMount(false)
		}
	}, [])

	return (
		<div>
			<CommonChipWithPopover
				textAlignSelf="end"
				text={
					currentFilterValues?.reduce?.(
						(acc, label, index) => (index === 0 ? label : `${acc}, ${label}`),
						''
					) || ''
				}
				title={
					<Typography
						variant="body1"
						style={{ fontWeight: 600, fontSize: 12, color: '#6C6F80' }}
					>
						{currentFilterHeader}:&nbsp;
					</Typography>
				}
				dropdownContent={DropdownContent}
			/>
		</div>
	)
}
