import Box from '@mui/material/Box'
import { useCallback } from 'react'

import { Table_Column, TableData, TableInstance } from '../../TableComponent'

import { FilterChipSelectField } from './FilterChipSelectField'

type Props<TData extends TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
}
export const FilterChipDropdownContent = <TData extends TableData>({
	column,
	table,
}: Props<TData>) => {
	const value = column.getFilterValue()
	const onChange = useCallback(
		(value) => {
			column.setFilterValue(value)
		},
		[column]
	)
	const getContent = () => {
		if (column.columnDef.FilterChipField) {
			return column.columnDef.FilterChipField({
				column,
				table,
				value,
				onChange,
			})
		}
		if (column.columnDef.FilterField) {
			return column.columnDef.FilterField({ column, table, value, onChange })
		}
		if (column.columnDef.filterVariant === 'multi-select') {
			return <FilterChipSelectField column={column} table={table} />
		}

		return null
	}

	return <Box sx={{ width: 300, padding: '6px 0' }}>{getContent()}</Box>
}
