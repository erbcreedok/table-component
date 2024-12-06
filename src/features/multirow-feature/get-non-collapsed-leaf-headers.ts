import { memo, Table } from '@tanstack/table-core'

import { getMemoOptions } from '../../utils/getMemoOptions'
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
		getMemoOptions(table.options, 'debugHeaders', 'getNonCollapsedHeaders')
	)
