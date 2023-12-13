import React, { useCallback, useState, ReactNode } from 'react'
import { Box } from '@mui/material'

import { DropdownContentHeader } from './DropdownContent/DropdownContentHeader'
import { DropdownContentSearch } from './DropdownContent/DropdownContentSearch'
import { EmbeddedSelectList } from './EmbeddedSelectList'

export type EmbeddedSelectOptionType = {
	text: string
} & Record<string, any>

type Props = {
	headerTitle: string
	searchValue: string
	onSearch: (value: string) => void
	onClearAll: () => void
	onClearSearch: () => void
	options: EmbeddedSelectOptionType[]
	searchOptions: EmbeddedSelectOptionType[]
	onOptionClick: (item: EmbeddedSelectOptionType) => void
	onSearchOptionClick: (item: EmbeddedSelectOptionType) => void
	renderItem?: (item: EmbeddedSelectOptionType) => ReactNode
	renderSearchItem?: (item: EmbeddedSelectOptionType) => ReactNode
}

export const EmbeddedSelect = ({
	headerTitle,
	searchValue,
	onSearch,
	onClearAll,
	onClearSearch,
	options = [],
	searchOptions = [],
	onOptionClick,
	onSearchOptionClick,
	renderItem,
	renderSearchItem,
}: Props) => {
	const [isSearchActive, setIsSearchActive] = useState(false)

	const handleSearchValue = useCallback(
		(value) => {
			onSearch(value)
		},
		[onSearch]
	)

	const handleSearchOptionClick = useCallback(
		(item) => {
			onSearchOptionClick(item)
			setIsSearchActive(false)
		},
		[onSearchOptionClick]
	)

	const handleOptionClick = useCallback(
		(item) => {
			onOptionClick(item)
			setIsSearchActive(false)
		},
		[onOptionClick]
	)

	return (
		<Box sx={{ width: 300, padding: '6px 0' }}>
			<DropdownContentHeader
				headerTitle={headerTitle}
				onClearAll={onClearAll}
			/>
			<DropdownContentSearch
				value={searchValue}
				onChange={handleSearchValue}
				isSearchActive={isSearchActive}
				setIsSearchActive={setIsSearchActive}
				onClearClick={onClearSearch}
			/>
			<>
				{isSearchActive && (
					<EmbeddedSelectList
						options={searchOptions}
						onOptionClick={handleSearchOptionClick}
						renderItem={renderSearchItem}
						isSearchList
					/>
				)}
				{!isSearchActive && (
					<EmbeddedSelectList
						options={options}
						onOptionClick={handleOptionClick}
						renderItem={renderItem}
					/>
				)}
			</>
		</Box>
	)
}
