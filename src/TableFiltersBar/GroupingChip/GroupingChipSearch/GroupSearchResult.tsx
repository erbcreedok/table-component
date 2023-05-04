import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'

import { useGroupingControls } from '../../filter-bar-hooks/useGroupingControls'
import { NoOptions } from '../..//NoOptions/NoOptions'

import { ListSearchedGroupItem } from './ListSearchedGroupItem'

interface GroupSearchResultProps {
	table: any
	searchValue: string
	selectedSearchedItems: any
	setSelectedSearchedItems: any
	setSearchValue: Dispatch<SetStateAction<string>>
}

export const GroupSearchResult: FC<GroupSearchResultProps> = (props) => {
	const {
		table,
		searchValue,
		setSearchValue,
		selectedSearchedItems,
		setSelectedSearchedItems,
	} = props

	const { nonGroupedList } = useGroupingControls(table)

	const [searchedElements, setSearchedElements] = useState<any>([])

	useEffect(() => {
		if (searchValue) {
			const filteredList = nonGroupedList.filter((item) => {
				return item?.columnDef?.header
					?.toLowerCase()
					.includes(searchValue.toLowerCase())
			})

			setSearchedElements(filteredList)

			return
		}

		setSearchedElements(nonGroupedList)
	}, [searchValue])

	if (!searchedElements?.length) {
		return <NoOptions />
	}

	return (
		<>
			{searchedElements.map((item) => {
				return (
					<ListSearchedGroupItem
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
