import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'

import { TableInstance } from 'src'

import { SortIcon } from '../../TableToolbar/components/icons/SortIcon'
import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'
import { AscIcon } from '../../TableToolbar/components/icons/AscIcon'
import { DescIcon } from '../../TableToolbar/components/icons/DescIcon'
import { DropdownContentHeader } from '../DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../DropdownContent/DropdownContentSearch'

import { SelectedSortsList } from './SortingChipList/SelectedSortsList'
import { SortingSearchResult } from './SortingChipSearch/SortingSearchResult'

interface SortingChipProps<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
	isMounted: boolean
	onMount: (value: boolean) => void
}

export const SortingChip = <TData extends Record<string, any> = {}>(
	props: SortingChipProps<TData>
) => {
	const { table, isMounted, onMount } = props
	const { getAllColumns, getState, resetSorting } = table

	const { columnPinning, columnOrder, columnVisibility, grouping, sorting } =
		getState()
	const isSortingExists = Boolean(sorting?.length)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])

	const sortedList = useMemo(
		() =>
			sorting?.map((item) =>
				getAllColumns().find((col) => col?.id === item.id)
			),
		[sorting]
	)

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		return columns.filter((col) => col.getIsVisible() && col.getCanSort())
	}, [
		columnOrder,
		columnPinning,
		columnVisibility,
		grouping,
		sorting,
		getAllColumns,
	])

	const nonSortedList = useMemo(
		() => allColumns.filter((col) => !col.getIsSorted()),
		[sorting]
	)

	const firstSorting = sorting?.find((item) => sortedList[0]?.id === item.id)

	const handleClearAll = () => {
		resetSorting()
	}

	const applySelectedItems = () => {
		selectedSearchedItems.forEach((id) => {
			const column = allColumns.find((col) => col.id === id)

			if (column) {
				column.toggleSorting(false, true)
			}
		})

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
		if (isSortingExists) {
			onMount(true)
		}
	}, [isSortingExists])

	if (!isSortingExists && !isMounted) {
		return <></>
	}

	return (
		<CommonChipWithPopover
			text={getSortingChipText()}
			icon={
				<>
					{sortedList?.length > 1 ? (
						<SortIcon />
					) : firstSorting?.desc ? (
						<DescIcon />
					) : (
						<AscIcon />
					)}
				</>
			}
			dropdownContent={DropdownContent}
		/>
	)
}
