import { Row, Table } from '@tanstack/react-table'
import { memo } from '@tanstack/table-core'

import { getNonCollapsedColumnItems } from '../../utils/getNonCollapsedColumnItems'

export const getNonCollapsedCells = <TData>(
	row: Row<TData>,
	table: Table<TData>
) =>
	memo(
		() => [row.getVisibleCells(), table.getState().collapsedMultirow],
		(visibleCells, collapsedMultirow) => {
			return getNonCollapsedColumnItems(
				visibleCells,
				collapsedMultirow,
				(cell) => cell.column
			)
		},
		{
			key: 'getNonCollapsedCells',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
