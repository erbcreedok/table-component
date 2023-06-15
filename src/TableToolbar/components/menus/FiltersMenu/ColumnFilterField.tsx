import React from 'react'

import { FilterMultiselect } from '../../../../components/FilterMultiselect'
import type { Table_Column, TableInstance, TableData } from '../../../../index'

interface Props<TData extends TableData> {
	autoFocus?: boolean
	column: Table_Column<TData>
	changeFilter(column: Table_Column<TData>, value: string[] | number[]): void
	table: TableInstance<TData>
}

export const ColumnFilterField = <TData extends TableData>({
	autoFocus,
	changeFilter,
	column,
	table,
}: Props<TData>) => {
	const { FilterField } = column.columnDef
	const handleChangeFilter = (values) => {
		changeFilter(column, values)
	}

	if (FilterField) {
		return (
			<FilterField
				table={table}
				column={column}
				value={column.getFilterValue()}
				onChange={handleChangeFilter}
				autoFocus={autoFocus}
			/>
		)
	}

	return (
		<FilterMultiselect
			table={table}
			column={column}
			value={column.getFilterValue() as string[]}
			onChange={handleChangeFilter}
			autoFocus={autoFocus}
		/>
	)
}
