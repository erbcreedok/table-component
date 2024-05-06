import { Table_Column, TableData, TableInstance } from '../TableComponent'
import { utilColumnsList } from '../utilColumns'

export const defaultGetExpandableColumn = <TData extends TableData = TableData>(
	columns: Table_Column<TData>[]
) =>
	columns.find(
		(col) => !col.getIsGrouped() && !utilColumnsList.includes(col.id)
	) ?? null

export const getExpandableColumn = <TData extends TableData = TableData>(
	columns: Table_Column<TData>[],
	table: TableInstance<TData>
) => {
	if (!table.options.enableExpanding) return null
	const _getExpandableColumn = table.options.getExpandableColumn
	if (_getExpandableColumn) {
		if (typeof _getExpandableColumn === 'string') {
			const expandableColumnId = _getExpandableColumn
			const expandableColumn =
				columns.find((col) => col.id === expandableColumnId) ?? null
			if (expandableColumn && !expandableColumn.getIsGrouped()) {
				return expandableColumn
			}
		} else {
			return _getExpandableColumn(columns, table)
		}
	}

	return defaultGetExpandableColumn(columns)
}
