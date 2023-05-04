import { Table_Row, TableInstance } from '../TableComponent'

export const getParentRow = ({
	row,
	table,
}: {
	row: Table_Row
	table: TableInstance
}) => {
	if (row.depth === 0) return undefined
	const rows = table.getPaginationRowModel().flatRows
	let rowIndex = rows.findIndex((r) => r.id === row.id)
	if (rowIndex === -1) return undefined
	if (rowIndex === 0) return undefined
	while (rows[rowIndex] && rows[rowIndex].depth >= row.depth) {
		rowIndex -= 1
	}

	return rows[rowIndex]
}
