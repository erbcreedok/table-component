import { Box } from '@mui/material'
import React, { FC, useEffect, useMemo, useState } from 'react'

import { CommonChipWithPopoverAndContext } from '../CommonChipWithPopover/CommonChipWithPopover'
import { DropdownContentHeader } from '../../components/DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from '../../components/DropdownContent/DropdownContentSearch'
import { useGroupingControls } from '../filter-bar-hooks/useGroupingControls'
import { resetGroupingWithMultirow } from '../../utils/resetGroupingWithMultirow'

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
			localization,
		},
	} = table

	const { grouping } = getState()
	const isGroupingExists = Boolean(grouping?.length)

	const [isSearchActive, setIsSearchActive] = useState(false)

	const [searchValue, setSearchValue] = useState('')
	const [selectedSearchedItems, setSelectedSearchedItems] = useState<any>([])

	const { groupedList } = useGroupingControls(table)

	const onClearClick = () => {
		setSelectedSearchedItems([])
	}

	const resetGrouping = () => {
		resetGroupingWithMultirow(table)
	}

	const DropdownContent = (
		<Box sx={{ width: 300, padding: '6px 0' }}>
			<DropdownContentHeader
				headerTitle={localization.grouping}
				onClearAll={resetGrouping}
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
					<GroupSearchResult
						table={table}
						searchValue={searchValue}
						selectedSearchedItems={selectedSearchedItems}
						setSelectedSearchedItems={setSelectedSearchedItems}
						onSelect={() => setIsSearchActive(false)}
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
			return `${groupedList.length} Groups`
		}

		return ''
	}, [groupedList])

	if (!isGroupingExists) {
		return <></>
	}

	return (
		<CommonChipWithPopoverAndContext
			icon={<GroupingIcon />}
			text={groupingChipText}
			dropdownContent={DropdownContent}
		/>
	)
}
