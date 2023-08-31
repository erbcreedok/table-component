import React, { useEffect, useMemo, useState } from 'react'
import { Box } from '@mui/material'

import { TableInstance } from 'src'

import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'
import { DropdownContentHeader } from '../../components/DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../../components/DropdownContent/DropdownContentSearch'
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
	const {
		getAllColumns,
		getState,
		resetSorting,
		options: {
			icons: { AscIcon, DescIcon, ArrowsIcon },
			localization,
		},
	} = table

	const { sorting } = getState()
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

	const { allColumns } = useSortingControls(table)

	const nonSortedList = useMemo(
		() => allColumns.filter((col) => !col.getIsSorted()),
		[sorting]
	)

	const firstSorting = sorting?.find((item) => sortedList[0]?.id === item.id)

	const handleClearAll = () => {
		resetSorting()
	}

	const onClearClick = () => {
		setSelectedSearchedItems([])
	}

	const dropdownContent = (
		<>
			<Box sx={{ width: 300, padding: '6px 0' }}>
				<DropdownContentHeader
					headerTitle={localization.sorting}
					onClearAll={handleClearAll}
				/>

				<DropdownContentSearch
					value={searchValue}
					onChange={setSearchValue}
					isSearchActive={isSearchActive}
					setIsSearchActive={setIsSearchActive}
					onClearClick={onClearClick}
				/>

				<>
					{isSearchActive && (
						<SortingSearchResult
							searchValue={searchValue}
							nonSortedList={nonSortedList}
							selectedSearchedItems={selectedSearchedItems}
							setSelectedSearchedItems={setSelectedSearchedItems}
							table={table}
							onSelect={() => setIsSearchActive(false)}
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
			return `${sortedList.length} Sorts`
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

	return (
		<CommonChipWithPopover
			table={table}
			text={getSortingChipText()}
			icon={
				sortedList?.length > 1 ? (
					<ArrowsIcon />
				) : firstSorting?.desc ? (
					<DescIcon />
				) : (
					<AscIcon />
				)
			}
			dropdownContent={dropdownContent}
		/>
	)
}
