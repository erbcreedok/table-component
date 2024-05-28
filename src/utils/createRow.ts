import { Row, RowData, Table } from '@tanstack/react-table'
import { createRow as _createRow } from '@tanstack/table-core'

import { Table_ColumnDef, Table_Row, TableInstance } from '../TableComponent'

import { getNestedProp } from './getNestedProp'

export const createRow = <TData extends RowData>(
	table: Table<TData>,
	id: string,
	original: TData,
	rowIndex: number,
	depth: number,
	subRows?: Row<TData>[]
): Row<TData> => {
	const row = _createRow(table, id, original, rowIndex, depth, subRows)

	row.getGroupingValue = <T = any>(columnId: string) => {
		const { groupingKey } = table.getColumn(columnId)
			.columnDef as Table_ColumnDef
		if (!groupingKey) {
			return row.getValue<T>(columnId)
		}

		return typeof groupingKey === 'function'
			? groupingKey<T>({
					row: row as Table_Row,
					table: table as TableInstance,
					columnId,
			  })
			: getNestedProp<T>(row.original, groupingKey)
	}

	return row
}
