import { ColumnOrderState } from '@tanstack/react-table'

import { getDefaultColumnOrderIds } from '../column.utils'
import { TableData, TableInstance } from '../TableComponent'

export const getValidColumnOrder = <TData extends TableData = TableData>(
	tableOptions: TableInstance<TData>['options'],
	_columnOrder?: ColumnOrderState
) => {
	let columnOrder = _columnOrder
	if (!columnOrder || columnOrder.length === 0) {
		columnOrder = getDefaultColumnOrderIds(tableOptions)
	}

	return columnOrder
}
