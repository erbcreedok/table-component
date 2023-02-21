import { MRT_Cell, MRT_TableInstance } from '../MaterialReactTable'

export const getIsFirstOfGroup = ({ table, cell }: { table: MRT_TableInstance, cell: MRT_Cell }): boolean => {
	const { row, column } = cell

	if (!column.getIsGrouped()) return true

	const rowId = row.id
	const columnId = column.id
	const rows = table.getPrePaginationRowModel().rows
	const { pageSize, pageIndex } = table.getState().pagination
	const firstElementIndex = pageIndex * pageSize
	const index = rows.findIndex((r) => r.id === rowId)

	if (index < firstElementIndex) return false
	if (index === firstElementIndex) return true
	const currentValue = rows[index].getValue(columnId)
	const previousValue = rows[index - 1].getValue(columnId)

	return (currentValue !== previousValue)
}
