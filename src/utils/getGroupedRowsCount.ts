import { Table_Row, TableInstance } from '../TableComponent'

const isSameValue = (a: Table_Row, b: Table_Row, columnId: string) =>
	a.getValue(columnId) === b.getValue(columnId)
export function getGroupedRowsCount({
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
	let count = 0
	while (
		count < rows.length &&
		rows[count + rowIndex] &&
		isSameValue(rows[count + rowIndex], row, columnId)
	) {
		count += 1
	}

	return count
}
