import { Table } from '@tanstack/react-table'
import { memo } from '@tanstack/table-core'

import { buildHeaderGroups } from './buildHeaderGroups'
import { getMemoOptions } from './getMemoOptions'

export const getHeaderGroups = <TData>(table: Table<TData>) =>
	memo(
		() => [
			table.getAllColumns(),
			table.getVisibleLeafColumns(),
			table._getOrderColumnsFn(),
		],
		(allColumns, leafColumns, orderColumnsFn) => {
			const sortedColumns = orderColumnsFn(leafColumns)

			return buildHeaderGroups(allColumns, sortedColumns, table)
		},
		getMemoOptions(table.options, 'debugHeaders', 'getHeaderGroups')
	)
