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
	const {
		getState,
		options: { renderDetailPanel },
	} = table
	const { hoveredRow } = getState()
	const rows = table.getPaginationRowModel().flatRows
	const rowIndex = rows.findIndex((r) => r.id === row.id)
	let count = 0
	let hasHoveredRow = false
	while (
		count < rows.length &&
		rows[count + rowIndex] &&
		isSameValue(rows[count + rowIndex], row, columnId)
	) {
		if (hoveredRow?.id === rows[count + rowIndex].id) {
			hasHoveredRow = true
		}
		count += 1
	}

	return count * (renderDetailPanel ? 2 : 1) + (hasHoveredRow ? 1 : 0)
}
