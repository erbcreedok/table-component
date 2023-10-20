import React, { ComponentProps, FC, useCallback } from 'react'

import { Menu } from '../components/Menu'
import { QuickFilters } from '../components/QuickFilters'
import { Table_Column, TableInstance } from '../TableComponent'

type Props = ComponentProps<typeof Menu> & {
	table: TableInstance
	column: Table_Column
	toggleSubMenu: () => void
}
export const QuickFiltersMenu: FC<Props> = ({ table, column, ...rest }) => {
	const filterValue = column.getFilterValue()
	const { ColumnActionsFilterField } = column.columnDef

	const handleChange = useCallback(
		(value) => {
			column.setFilterValue(value)
		},
		[column]
	)

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
				value={filterValue as string[]}
				onChange={handleChange}
			/>
		</Menu>
	)
}
