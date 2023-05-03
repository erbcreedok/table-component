import React, { FC, useEffect, useState } from 'react'

import { useFilterControls } from '../../filter-bar-hooks/useFilterControls'
import { ListFilterItem } from '../FilterChipList/ListFilterItem'
import { NoOptions } from '../../NoOptions/NoOptions'

interface FiltersSearchResultProps {
	table: any
	searchValue: string
	filterId: string
	selectedSearchedItems: any
	setSelectedSearchedItems: any
}

export const FiltersSearchResult: FC<FiltersSearchResultProps> = (props) => {
	const {
		table,
		searchValue,
		filterId,
		selectedSearchedItems,
		setSelectedSearchedItems,
	} = props

	const { currentFilterColumn, filtedList, filterOptions } = useFilterControls(
		table,
		filterId
	)

	const [searchedElements, setSearchedElements] = useState<any>([])

	const nonSelectedFilterOptions = filterOptions.filter((item) => {
		return !filtedList.includes(item)
	})

	useEffect(() => {}, [])

	useEffect(() => {
		if (searchValue) {
			const filteredList = nonSelectedFilterOptions.filter((item) => {
				return item?.label?.toLowerCase().includes(searchValue.toLowerCase())
			})

			setSearchedElements(filteredList)

			return
		}

		setSearchedElements(nonSelectedFilterOptions)
	}, [searchValue])

	const handleCheck = (value) => {
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
		currentFilterColumn.setFilterValue(updatedItems)
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
