import { Table_Cell, TableInstance } from '../MaterialReactTable'
import { getIsFirstOfGroup } from './getIsFirstOfGroup'

export const getGroupRowSpan = ({ table, cell }: { table: TableInstance; cell: Table_Cell }) => {
	const { row, column } = cell
	if (!column.getIsGrouped() || !getIsFirstOfGroup({ table, cell })) return 1
	const rowId = row.id
	const columnId = column.id
	const pageRows = table.getPaginationRowModel().rows
	const index = pageRows.findIndex((r) => r.id === rowId)
	let span = 1

	const currentValue = pageRows[index].getValue(columnId)
	while (span < pageRows.length - index) {
		const nextValue = pageRows[index + span].getValue(columnId)
		if (currentValue !== nextValue) return span
		span += 1
	}

	return span
}
