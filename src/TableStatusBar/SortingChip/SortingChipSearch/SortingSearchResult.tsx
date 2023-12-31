import { FC, useEffect, useState } from 'react'

import { NoOptions } from '../../../components/NoOptions'

import { ListSearchSortingItem } from './ListSearchSortingItem'

interface SortingSearchResultProps {
	searchValue: string
	selectedSearchedItems: any
	nonSortedList: any
	table: any
	setSelectedSearchedItems: any
	onSelect: () => void
}

export const SortingSearchResult: FC<SortingSearchResultProps> = (props) => {
	const {
		searchValue,
		nonSortedList,
		table,
		onSelect,
		selectedSearchedItems,
		setSelectedSearchedItems,
	} = props

	const [searchedElements, setSearchedElements] = useState<any>([])

	useEffect(() => {
		if (searchValue) {
			const filteredList = nonSortedList.filter((item) => {
				return item?.columnDef?.header
					?.toLowerCase()
					.includes(searchValue.toLowerCase())
			})

			setSearchedElements(filteredList)

			return
		}

		setSearchedElements(nonSortedList)
	}, [searchValue])

	if (!searchedElements?.length) {
		return <NoOptions />
	}

	return (
		<>
			{searchedElements.map((item) => {
				return (
					<ListSearchSortingItem
						key={item?.id}
						item={item}
						table={table}
						selectedSearchedItems={selectedSearchedItems}
						setSelectedSearchedItems={setSelectedSearchedItems}
						onSelect={onSelect}
					/>
				)
			})}
		</>
	)
}
