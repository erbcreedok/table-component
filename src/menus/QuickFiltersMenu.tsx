import React, {
	ComponentProps,
	FC,
	useCallback,
	useMemo,
	useState,
	useEffect,
} from 'react'

import { Menu } from '../components/Menu'
import { QuickFilters } from '../components/QuickFilters'
import { Table_Column, TableInstance } from '../TableComponent'
import { getColumnFilterOptions } from '../utils/getColumnFilterOptions'

type Props = ComponentProps<typeof Menu> & {
	table: TableInstance
	column: Table_Column
	toggleSubMenu: () => void
}
export const QuickFiltersMenu: FC<Props> = ({ table, column, ...rest }) => {
	const [selectedFilters, setSelectedFilters] = useState<string[]>(
		(column.getFilterValue() || []) as string[]
	)
	const filterOptions = useMemo(
		() => getColumnFilterOptions(column, table),
		[column, table]
	)
	const filterValue = column.getFilterValue()
	const { ColumnActionsFilterField } = column.columnDef

	useEffect(() => {
		if (Array.isArray(selectedFilters)) {
			column.setFilterValue([...selectedFilters])
		}
	}, [column, selectedFilters])

	const handleChange = useCallback(
		(value) => {
			column.setFilterValue(value)
		},
		[column]
	)

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

	const handleClearAll = useCallback(() => {
		setSelectedFilters([])
	}, [column])

	if (ColumnActionsFilterField) {
		return (
			<Menu {...rest} PaperProps={{ style: { width: 300 } }}>
				<ColumnActionsFilterField
					table={table}
					column={column}
					value={filterValue}
					onChange={handleChange}
				/>
			</Menu>
		)
	}

	return (
		<Menu {...rest} PaperProps={{ style: { width: 300 } }}>
			<QuickFilters
				table={table}
				column={column}
				filterOptions={filterOptions}
				selectedFilters={selectedFilters}
				onCheckFilter={handleCheckFilter}
				onClearAll={handleClearAll}
			/>
		</Menu>
	)
}
