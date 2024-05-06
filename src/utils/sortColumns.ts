import { ColumnPinningState, GroupingState } from '@tanstack/react-table'

import { Table_Column, TableData } from '../TableComponent'

export const sortColumns = <TData extends TableData>(
	columns: Table_Column<TData>[],
	columnPinning: ColumnPinningState,
	grouping: GroupingState
) => {
	const pinningLeft = columnPinning.left ?? []
	const pinningRight = columnPinning.right ?? []
	const sorted = new Set<Table_Column<TData>>()
	grouping.forEach((columnId) => {
		const col = columns.find((column) => column.id === columnId)
		if (col) sorted.add(col)
	})
	pinningLeft.forEach((columnId) => {
		const col = columns.find((column) => column.id === columnId)
		if (col) sorted.add(col)
	})
	columns.forEach((column) => {
		sorted.add(column)
	})
	pinningRight.forEach((columnId) => {
		const col = columns.find((column) => column.id === columnId)
		if (col && grouping.indexOf(col.id) === -1) {
			sorted.delete(col)
			sorted.add(col)
		}
	})

	return new Array(...sorted)
}
