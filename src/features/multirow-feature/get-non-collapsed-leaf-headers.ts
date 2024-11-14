import { memo, Table } from '@tanstack/table-core'

import { getNonCollapsedColumnItems } from '../../utils/getNonCollapsedColumnItems'

export const getNonCollapsedLeafHeaders = <TData>(table: Table<TData>) =>
	memo(
		() => [table.getLeafHeaders(), table.getState().collapsedMultirow],
		(headerGroups, collapsedMultirow) =>
			getNonCollapsedColumnItems(
				headerGroups,
				collapsedMultirow,
				(header) => header.column
			),
		{
			key: 'getNonCollapsedLeafHeaders',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
