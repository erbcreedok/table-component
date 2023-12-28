import { RefObject } from 'react'

import { Table_Row, TableData, TableInstance } from '../TableComponent'

import { setHoveredRow } from './setHoveredRow'

export const handleTableHeadDragEnter = <TData extends TableData = TableData>(
	table: TableInstance<TData>,
	rowRef: RefObject<HTMLTableRowElement>,
	parentRow?: Table_Row<TData>,
	dropToParentRow?: boolean
) => {
	const {
		options: { enableRowDragging },
		getState,
	} = table
	const { draggingRows } = getState()
	if (enableRowDragging && draggingRows.length > 0) {
		let row: Table_Row<TData> | undefined
		if (!parentRow) {
			row = table.getPaginationRowModel().flatRows[0]
		} else if (dropToParentRow) {
			row = parentRow
		} else if (parentRow.subRows) {
			row = parentRow.subRows[0]
		}
		if (row) {
			setHoveredRow(table)({
				row,
				position: 'top',
				rowRef,
			})
		} else {
			setHoveredRow(table)(null)
		}
	}
}
