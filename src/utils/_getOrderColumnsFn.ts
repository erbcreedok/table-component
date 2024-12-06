import { Table } from '@tanstack/react-table'
import { memo } from '@tanstack/table-core'

import { Table_Column } from '../TableComponent'

import { getMemoOptions } from './getMemoOptions'
import { sortColumns } from './sortColumns'

export const _getOrderColumnsFn = <TData>(table: Table<TData>) =>
	memo(
		() => [
			table.getState().columnOrder,
			table.getState().columnPinning,
			table.getState().grouping,
			table.getState().columnPinning.left,
			table.getState().columnPinning.right,
		],
		(columnOrder, columnPinning, grouping) => (columns) => {
			// Sort grouped columns to the start of the column list
			// before the headers are built
			let orderedColumns: Table_Column<TData>[] = []

			// If there is no order, return the normal columns
			if (!columnOrder?.length) {
				orderedColumns = columns
			} else {
				const columnOrderCopy = [...columnOrder]

				// If there is an order, make a copy of the columns
				const columnsCopy = [...columns]

				// And make a new ordered array of the columns

				// Loop over the columns and place them in order into the new array
				while (columnsCopy.length && columnOrderCopy.length) {
					const targetColumnId = columnOrderCopy.shift()
					const foundIndex = columnsCopy.findIndex(
						(d) => d.id === targetColumnId
					)
					if (foundIndex > -1) {
						orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0])
					}
				}

				// If there are any columns left, add them to the end
				orderedColumns = [...orderedColumns, ...columnsCopy]
			}

			return sortColumns(orderedColumns, columnPinning, grouping)
		},
		getMemoOptions(table.options, 'debugColumns', 'getOrderColumnsFn')
	)
