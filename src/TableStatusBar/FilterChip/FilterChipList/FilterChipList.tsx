import { FC } from 'react'

import { useFilterControls } from '../../filter-bar-hooks/useFilterControls'
import { NoOptions } from '../../NoOptions/NoOptions'

import { ListFilterItem } from './ListFilterItem'

interface FilterChipListProps {
	table: any
	filterId: string
}

export const FilterChipList: FC<FilterChipListProps> = (props) => {
	const { table, filterId } = props

	const { filteredList, currentFilterValues, currentFilterColumn } =
		useFilterControls(table, filterId)

	if (!filteredList?.length) {
		return <div>No options</div>
	}

	const handleCheck = (value: string) => {
		if (currentFilterValues.includes(value)) {
			const newFilterValues = currentFilterValues.filter(
				(item) => item !== value
			)

			currentFilterColumn.setFilterValue(newFilterValues)

			return
		}

		currentFilterColumn.setFilterValue([...currentFilterValues, value])
	}

	if (!currentFilterValues?.length) {
		return <NoOptions />
	}

	return (
		<div>
			{(Array.from(new Set(currentFilterValues)) as string[]).map((value) => {
				return (
					<ListFilterItem
						key={value}
						isChecked={currentFilterValues.includes(value)}
						title={value}
						onCheck={() => handleCheck(value)}
					/>
				)
			})}
		</div>
	)
}
