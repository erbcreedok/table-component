import React, {
	ComponentProps,
	FC,
	useCallback,
	useMemo,
	useState,
} from 'react'

import { Menu } from '../components/Menu'
import { Table_Column, TableInstance } from '../TableComponent'
import { getColumnFilterOptions } from '../utils/getColumnFilterOptions'

type Props = ComponentProps<typeof Menu> & {
	table: TableInstance
	column: Table_Column
	toggleSubMenu: () => void
}
export const QuickFiltersMenu: FC<Props> = ({
	table,
	column,
	toggleSubMenu,
	...rest
}) => {
	const {
		options: { ColumnActionsFiltersMenu },
	} = table

	const [selectedFilters, setSelectedFilters] = useState<string[]>(
		(column.getFilterValue() || []) as string[]
	)
	const filterOptions = useMemo(
		() => getColumnFilterOptions(column, table),
		[column, table]
	)
	// DEPRECATED: use filterOptions instead
	const filterValues = useMemo(
		() => filterOptions.map(({ value }) => value),
		[filterOptions]
	)

	const handleApplyFilters = useCallback(() => {
		column.setFilterValue([...selectedFilters])

		toggleSubMenu()
	}, [column, selectedFilters, toggleSubMenu])

	const handleCheckFilter = useCallback(
		(value: string) => {
			if (selectedFilters.includes(value)) {
				const updatedFilters = selectedFilters.filter(
					(filter) => filter !== value
				)

				setSelectedFilters(updatedFilters)

				return
			}

			setSelectedFilters([...selectedFilters, value])
		},
		[selectedFilters]
	)

	const handleCheckAllFilters = useCallback(() => {
		if (selectedFilters.length === filterOptions.length) {
			setSelectedFilters([])

			return
		}

		setSelectedFilters([...filterOptions.map(({ value }) => value)])
	}, [selectedFilters, filterOptions])

	if (!ColumnActionsFiltersMenu) {
		return null
	}

	return (
		<Menu {...rest}>
			<ColumnActionsFiltersMenu
				table={table}
				column={column}
				selectedFilters={selectedFilters}
				filterValues={filterValues}
				filterOptions={filterOptions}
				onCheckFilter={handleCheckFilter}
				onCheckAllFilters={handleCheckAllFilters}
				onApplyFilters={handleApplyFilters}
				toggleSubMenu={toggleSubMenu}
			/>
		</Menu>
	)
}
