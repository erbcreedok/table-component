import { Box } from '@mui/material'
import React, { FC, useEffect, useMemo, useState } from 'react'

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

	const {
		getState,
		options: {
			icons: { GroupingIcon },
		},
	} = table

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
						setSearchValue={setSearchValue}
					/>
				)}

				{!isSearchActive && <SelectedGroupsList table={table} />}
			</>
		</Box>
	)

	useEffect(() => {
		if (!isGroupingExists) {
			setSearchValue('')
		}
	}, [isGroupingExists])

	const groupingChipText = useMemo(() => {
		if (groupedList?.length === 1) {
			return groupedList[0]?.columnDef?.header ?? ''
		}

		if (groupedList?.length > 1) {
			return `${groupedList.length} groups`
		}

		return ''
	}, [groupedList])

	if (!isGroupingExists) {
		return <></>
	}

	return (
		<CommonChipWithPopover
			table={table}
			icon={<GroupingIcon />}
			text={groupingChipText}
			dropdownContent={DropdownContent}
		/>
	)
}