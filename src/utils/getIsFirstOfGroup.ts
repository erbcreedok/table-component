import { MRT_Cell, MRT_TableInstance } from '../MaterialReactTable'

export const getIsFirstOfGroup = ({ table, cell, columnId }: { table: MRT_TableInstance, cell: MRT_Cell, columnId?: string }): boolean => {
	const { row, column } = cell

	if (!column.getIsGrouped()) return true

	const rowId = row.id
	const colId = columnId ?? column.id
	const rows = table.getPaginationRowModel().rows
	const index = rows.findIndex((r) => r.id === rowId)

	if (index === 0) return true
	const currentValue = rows[index].getValue(colId)
	const previousValue = rows[index - 1].getValue(colId)

	return (currentValue !== previousValue)
}
