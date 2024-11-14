import { memo } from '@tanstack/table-core'

import { TableInstance } from '../TableComponent'

import { buildTableHeaderGroups } from './buildTableHeaderGroups'

export const getHeaderGroups = <TData>(table: TableInstance<TData>) =>
	memo(
		() => [table.getAllColumns(), table.getVisibleLeafColumns()],
		(allColumns, visibleLeafColumns) =>
			buildTableHeaderGroups(allColumns, visibleLeafColumns, table),
		{
			key: 'getHeaderGroups',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
