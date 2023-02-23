import { Table_Cell, TableInstance } from '../MaterialReactTable'

export const getIsFirstOfGroup = ({ table, cell, columnId }: { table: TableInstance, cell: Table_Cell, columnId?: string }): boolean => {
	const { row } = cell
	const colId = columnId ?? cell.column.id
	const column = table.getColumn(colId)

	if (!column.getIsGrouped()) return true

	const rowId = row.id
	const rows = table.getPaginationRowModel().rows
	const index = rows.findIndex((r) => r.id === rowId)

	if (index === 0) return true
	const currentValue = rows[index].getValue(colId)
	const previousValue = rows[index - 1].getValue(colId)

	return (currentValue !== previousValue)
}
