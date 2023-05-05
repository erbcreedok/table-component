import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'

import { TableInstance } from 'src'

import { SortIcon } from '../../TableToolbar/components/icons/SortIcon'
import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'
import { AscIcon } from '../../TableToolbar/components/icons/AscIcon'
import { DescIcon } from '../../TableToolbar/components/icons/DescIcon'
import { DropdownContentHeader } from '../DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../DropdownContent/DropdownContentSearch'
import { useSortingControls } from '../filter-bar-hooks/useSortingControls'

import { SelectedSortsList } from './SortingChipList/SelectedSortsList'
import { SortingSearchResult } from './SortingChipSearch/SortingSearchResult'

interface SortingChipProps<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
}

export const SortingChip = <TData extends Record<string, any> = {}>(
	props: SortingChipProps<TData>
) => {
	const { table } = props
	const { getAllColumns, getState, resetSorting } = table

	const { sorting } = getState()
	const isSortingExists = Boolean(sorting?.length)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])
	const [isOpen, setIsOpen] = useState(false)

	const sortedList = useMemo(
		() =>
			sorting?.map((item) =>
				getAllColumns().find((col) => col?.id === item.id)
			),
		[sorting]
	)

	const { allColumns } = useSortingControls(table)

	const nonSortedList = useMemo(
		() => allColumns.filter((col) => !col.getIsSorted()),
		[sorting]
	)

	const firstSorting = sorting?.find((item) => sortedList[0]?.id === item.id)

	const handleClearAll = () => {
		resetSorting()
	}

	const applySelectedItems = () => {
		setIsSearchActive(false)
		setSelectedSearchedItems([])
	}

	const DropdownContent = (
		<>
			<Box sx={{ width: 300, padding: '6px 0' }}>
				<DropdownContentHeader
					headerTile="Sort by"
					onClearAll={handleClearAll}
				/>

				<DropdownContentSearch
					searchValue={searchValue}
					onChange={setSearchValue}
					isSearchActive={isSearchActive}
					setIsSearchActive={setIsSearchActive}
					onApplySelectedItems={applySelectedItems}
				/>

				<>
					{isSearchActive && (
						<SortingSearchResult
							searchValue={searchValue}
							nonSortedList={nonSortedList}
							selectedSearchedItems={selectedSearchedItems}
							setSelectedSearchedItems={setSelectedSearchedItems}
							table={table}
							setSearchValue={setSearchValue}
						/>
					)}

					{!isSearchActive && (
						<SelectedSortsList
							resetSorting={resetSorting}
							sortedList={sortedList}
							allColumns={allColumns}
							sorting={sorting}
							table={table}
						/>
					)}
				</>
			</Box>
		</>
	)

	const getSortingChipText = () => {
		if (sortedList?.length === 1) {
			return sortedList[0]?.columnDef?.header ?? ''
		}

		if (sortedList?.length > 1) {
			return `${sortedList.length} sorts`
		}

		return ''
	}

	useEffect(() => {
		if (!isSortingExists) {
			setSearchValue('')
		}
	}, [isSortingExists])

	if (!isSortingExists) {
		return <></>
	}

	const iconColor = isOpen ? '#FAFAFC' : '#6C6F80'

	return (
		<CommonChipWithPopover
			setIsOpen={setIsOpen}
			text={getSortingChipText()}
			icon={
				<>
					{sortedList?.length > 1 ? (
						<SortIcon />
					) : firstSorting?.desc ? (
						<DescIcon fill={iconColor} />
					) : (
						<AscIcon fill={iconColor} />
					)}
				</>
			}
			dropdownContent={DropdownContent}
		/>
	)
}
