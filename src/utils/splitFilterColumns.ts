import { ColumnFiltersState } from '@tanstack/react-table'

import { getColumnId } from '../column.utils'
import { Table_Column, TableData } from '../TableComponent'

import { sortByStringArray } from './sortByStringArray'

export const splitFilterColumns = <TData extends TableData>(
	columns: Table_Column<TData>[],
	columnFilters: ColumnFiltersState,
	newColumnFilter: Table_Column<TData> | null
) => {
	const filterAppliedColumns: Table_Column<TData>[] = []
	const filterNonAppliedColumns: Table_Column<TData>[] = []
	const columnFilterIds = columnFilters.map((col) => col.id)
	if (newColumnFilter) {
		columnFilterIds.push(getColumnId(newColumnFilter.columnDef))
	}

	columns.forEach((col) => {
		if (columnFilterIds.includes(getColumnId(col.columnDef))) {
			filterAppliedColumns.push(col)
		} else {
			filterNonAppliedColumns.push(col)
		}
	})

	return {
		filterAppliedColumns: sortByStringArray(
			filterAppliedColumns,
			columnFilterIds,
			(a) => getColumnId(a.columnDef)
		),
		filterNonAppliedColumns,
	}
}
