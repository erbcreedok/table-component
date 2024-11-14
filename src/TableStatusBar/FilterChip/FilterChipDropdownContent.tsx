import Box from '@mui/material/Box'
import React, { useCallback } from 'react'

import { Table_Column, TableData, TableInstance } from '../../TableComponent'

import { FilterChipSelectField } from './FilterChipSelectField'

type Props<TData = TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
}
export const FilterChipDropdownContent = ({ column, table }: Props) => {
	const { FilterChipField, FilterField } = column.columnDef
	const value = column.getFilterValue()
	const onChange = useCallback(
		(value) => {
			column.setFilterValue(value)
		},
		[column]
	)
	const getContent = () => {
		if (FilterChipField) {
			return (
				<FilterChipField
					column={column}
					table={table}
					value={value}
					onChange={onChange}
				/>
			)
		}
		if (FilterField) {
			return (
				<FilterField
					column={column}
					table={table}
					value={value}
					onChange={onChange}
				/>
			)
		}
		if (column.columnDef.filterVariant === 'multi-select') {
			return <FilterChipSelectField column={column} table={table} />
		}

		return null
	}

	return <Box sx={{ width: 300, padding: '6px 0' }}>{getContent()}</Box>
}
