import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { NoOptions } from '../../NoOptions/NoOptions'

import { ListSearchSortingItem } from './ListSearchSortingItem'

interface SortingSearchResultProps {
	searchValue: string
	selectedSearchedItems: any
	nonSortedList: any
	table: any
	setSelectedSearchedItems: any
	setSearchValue: Dispatch<SetStateAction<string>>
}

export const SortingSearchResult: FC<SortingSearchResultProps> = (props) => {
	const {
		searchValue,
		nonSortedList,
		table,
		setSearchValue,
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
						setSearchValue={setSearchValue}
					/>
				)
			})}
		</>
	)
}
