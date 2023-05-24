import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useFilterControls } from '../../filter-bar-hooks/useFilterControls'
import { ListFilterItem } from '../FilterChipList/ListFilterItem'
import { NoOptions } from '../../NoOptions/NoOptions'

interface FiltersSearchResultProps {
	table: any
	searchValue: string
	filterId: string
	selectedSearchedItems: any
	setSelectedSearchedItems: any
	setSearchValue: Dispatch<SetStateAction<string>>
	setIsSearchActive: Dispatch<SetStateAction<boolean>>
}

export const FiltersSearchResult: FC<FiltersSearchResultProps> = (props) => {
	const {
		table,
		searchValue,
		filterId,
		selectedSearchedItems,
		setSelectedSearchedItems,
		setSearchValue,
		setIsSearchActive,
	} = props

	const { currentFilterColumn, currentFilterValues, filterOptions } =
		useFilterControls(table, filterId)

	const [searchedElements, setSearchedElements] = useState<any>([])

	const nonSelectedFilterOptions = filterOptions.filter(({ value }) => {
		return !currentFilterValues.includes(value)
	})

	useEffect(() => {}, [])

	useEffect(() => {
		if (searchValue) {
			const filteredList = nonSelectedFilterOptions.filter((item) => {
				return (
					item?.label?.toLowerCase().includes(searchValue.toLowerCase()) &&
					!currentFilterValues?.includes?.(item?.value)
				)
			})

			setSearchedElements(filteredList)

			return
		}

		setSearchedElements(
			nonSelectedFilterOptions.filter(
				(item) => !currentFilterValues?.includes?.(item?.value)
			)
		)
	}, [searchValue])

	const handleCheck = (value) => {
		setIsSearchActive(false)
		setSearchValue('')

		if (selectedSearchedItems?.includes?.(value)) {
			const filteredItems = selectedSearchedItems.filter(
				(item) => item !== value
			)
			setSelectedSearchedItems(filteredItems)
			currentFilterColumn.setFilterValue(filteredItems)

			return
		}

		const updatedItems = [...selectedSearchedItems, value]
		setSelectedSearchedItems(updatedItems)
		currentFilterColumn.setFilterValue([
			...currentFilterValues,
			...updatedItems,
		])
	}

	if (!searchedElements?.length) {
		return <NoOptions />
	}

	return (
		<div style={{ maxHeight: 200, overflowY: 'auto' }}>
			{searchedElements.map(({ value }) => {
				return (
					<ListFilterItem
						key={value}
						isChecked={selectedSearchedItems?.includes?.(value)}
						title={value}
						onCheck={() => handleCheck(value)}
					/>
				)
			})}
		</div>
	)
}
