import { Row, Table } from '@tanstack/react-table'
import { createRow as _createRow } from '@tanstack/table-core'

import { Table_Row, TableInstance } from '../TableComponent'

import { getNestedProp } from './getNestedProp'
import { getVisibleCells } from './getVisibleCells'
import { showRowInTable } from './showRowInTable'

export const createTableRow = <TData>(
	table: TableInstance<TData>,
	id: string,
	original: TData,
	rowIndex: number,
	depth: number,
	subRows?: Table_Row<TData>[]
) => {
	const row = _createRow(
		table as unknown as Table<TData>,
		id,
		original as TData,
		rowIndex,
		depth,
		subRows as Row<TData>[]
	) as Table_Row<TData>

	row.getGroupingValue = <T = any>(columnId: string) => {
		const { groupingKey } = table.getColumn(columnId).columnDef
		if (!groupingKey) {
			return row.getValue<T>(columnId)
		}

		return typeof groupingKey === 'function'
			? groupingKey<T>({
					row,
					table,
					columnId,
			  })
			: getNestedProp<T>(row.original, groupingKey)
	}
	row.getVisibleCells = getVisibleCells(row)
	row.showInTable = showRowInTable(row, table)

	return row as Table_Row<TData>
}
