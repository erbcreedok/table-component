import { Row } from '@tanstack/react-table'

import { Table_Cell, TableInstance } from '../TableComponent'

export const getIsFirstOfGroup = ({
	table,
	cell,
	columnId,
}: {
	table: TableInstance
	cell: Table_Cell
	columnId?: string
}): boolean => {
	const { row } = cell
	const colId = columnId ?? cell.column.id
	const column = table.getColumn(colId)

	if (row.getIsGrouped() || !column.getIsGrouped()) return true

	const rowId = row.id
	const paginationRows = table.getPaginationRowModel().rows
	let index = paginationRows.findIndex((r) => r.id === rowId)

	if (index === 0) return true
	const groupedRows = table.getGroupedRowModel().rows
	const recursivelyFindIndexInGroupedRows = (
		rows: Row<any>[],
		rowId: string
	) => {
		const index = rows.findIndex((r) => r.id === rowId)
		if (index !== -1) return index
		for (const row of rows) {
			if (row.subRows) {
				const index = recursivelyFindIndexInGroupedRows(row.subRows, rowId)
				if (index !== -1) return index
			}
		}

		return -1
	}
	index = recursivelyFindIndexInGroupedRows(groupedRows, rowId)

	return index === 0
}
