import { Box } from '@mui/material'
import React, { FC, useEffect, useState } from 'react'

import { GroupIcon } from '../../TableToolbar/components/icons/GroupIcon'
import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'
import { DropdownContentHeader } from '../DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../DropdownContent/DropdownContentSearch'
import { useGroupingControls } from '../filter-bar-hooks/useGroupingControls'

import { SelectedGroupsList } from './GroupingChipList/SelectedGroupsList'
import { GroupSearchResult } from './GroupingChipSearch/GroupSearchResult'

type GroupingChipProps = {
	table: any
	isMounted: boolean
	onMount: (value: boolean) => void
}

export const GroupingChip: FC<GroupingChipProps> = (props) => {
	const { table, isMounted, onMount } = props

	const { getState } = table

	const { grouping } = getState()
	const isGroupingExists = Boolean(grouping?.length)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])

	const { groupedList, allColumns, removeAllGroup } = useGroupingControls(table)

	const applySelectedItems = () => {
		selectedSearchedItems.forEach((id) => {
			const column = allColumns.find((col) => col.id === id)

			if (column) {
				column.toggleGrouping()
			}
		})

		setIsSearchActive(false)
		setSelectedSearchedItems([])
	}

	const handleClearAll = () => {
		removeAllGroup()
		onMount(false)
	}

	const DropdownContent = (
		<Box sx={{ width: 300, padding: '6px 0' }}>
			<DropdownContentHeader
				headerTile="Group by"
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
					<GroupSearchResult
						table={table}
						searchValue={searchValue}
						selectedSearchedItems={selectedSearchedItems}
						setSelectedSearchedItems={setSelectedSearchedItems}
					/>
				)}

				{!isSearchActive && <SelectedGroupsList table={table} />}
			</>
		</Box>
	)

	useEffect(() => {
		if (isGroupingExists) {
			onMount(true)
		}
	}, [isGroupingExists])

	if (!isGroupingExists && !isMounted) {
		return <></>
	}

	return (
		<CommonChipWithPopover
			Icon={<GroupIcon />}
			Text={groupedList.reduce(
				(acc, { columnDef: { header } }, index) =>
					index === 0 ? header : `${acc}, ${header}`,
				''
			)}
			DropdownContent={DropdownContent}
		/>
	)
}
