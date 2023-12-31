import { FC, useEffect, useState } from 'react'

import { useGroupingControls } from '../../filter-bar-hooks/useGroupingControls'
import { NoOptions } from '../../../components/NoOptions'

import { ListSearchedGroupItem } from './ListSearchedGroupItem'

interface GroupSearchResultProps {
	table: any
	searchValue: string
	selectedSearchedItems: any
	setSelectedSearchedItems: any
	onSelect: () => void
}

export const GroupSearchResult: FC<GroupSearchResultProps> = (props) => {
	const {
		table,
		searchValue,
		onSelect,
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
						onSelect={onSelect}
					/>
				)
			})}
		</>
	)
}
