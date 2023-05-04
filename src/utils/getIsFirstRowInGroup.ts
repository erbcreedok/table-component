import { Table_Row, TableInstance } from '../TableComponent'

export function getIsFirstRowInGroup({
	row,
	table,
	columnId,
}: {
	row: Table_Row
	table: TableInstance
	columnId: string
}) {
	const rows = table.getPaginationRowModel().flatRows
	const rowIndex = rows.findIndex((r) => r.id === row.id)
	if (rowIndex === -1) return false
	if (rowIndex === 0) return true
	const previousRow = rows[rowIndex - 1]

	return previousRow.getValue(columnId) !== row.getValue(columnId)
}
