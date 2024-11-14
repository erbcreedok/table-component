import { Table } from '@tanstack/react-table'
import { memo } from '@tanstack/table-core'

import { getNonCollapsedColumnItems } from '../../utils/getNonCollapsedColumnItems'

export const getNonCollapsedColumns = <TData>(table: Table<TData>) =>
	memo(
		() => [table.getVisibleLeafColumns(), table.getState().collapsedMultirow],
		(columns, collapsedMultirow) =>
			getNonCollapsedColumnItems(columns, collapsedMultirow),
		{
			key: 'getNonCollapsedColumns',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
