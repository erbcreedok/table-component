import { Box } from '@mui/material'
import React, { FC, useState } from 'react'

import { GroupIcon } from '../../TableToolbar/components/icons/GroupIcon'
import { CommonChipWithPopover } from '../CommonChipWithPopover/CommonChipWithPopover'
import { DropdownContentHeader } from '../DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../DropdownContent/DropdownContentSearch'
import { useGroupingControls } from '../filter-bar-hooks/useGroupingControls'

import { SelectedGroupsList } from './GroupingChipList/SelectedGroupsList'
import { GroupSearchResult } from './GroupingChipSearch/GroupSearchResult'

type GroupingChipProps = {
	table: any
}

export const GroupingChip: FC<GroupingChipProps> = (props) => {
	const { table } = props

	const { getState } = table

	const { grouping } = getState()
	const isGroupingExists = Boolean(grouping?.length)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])

	const { groupedList, removeAllGroup } = useGroupingControls(table)

	const applySelectedItems = () => {
		setIsSearchActive(false)
		setSelectedSearchedItems([])
	}

	const handleClearAll = () => {
		removeAllGroup()
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

	if (!isGroupingExists) {
		return <></>
	}

	return (
		<CommonChipWithPopover
			icon={<GroupIcon />}
			text={groupedList.reduce(
				(acc, { columnDef: { header } }, index) =>
					index === 0 ? header : `${acc}, ${header}`,
				''
			)}
			dropdownContent={DropdownContent}
		/>
	)
}
