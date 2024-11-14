import { ColumnOrderState } from '@tanstack/react-table'

import { getDefaultColumnOrderIds } from '../column.utils'
import { TableInstance } from '../TableComponent'

export const getValidColumnOrder = (
	tableOptions: TableInstance['options'],
	_columnOrder?: ColumnOrderState
) => {
	let columnOrder = _columnOrder
	if (!columnOrder || columnOrder.length === 0) {
		columnOrder = getDefaultColumnOrderIds(tableOptions)
	}

	return columnOrder
}
