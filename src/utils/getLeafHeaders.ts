import { memo } from '@tanstack/table-core'

import { Table_Header, TableData, TableInstance } from '../TableComponent'

export const getLeafHeaders = <TData extends TableData = TableData>(
	table: TableInstance<TData>
) =>
	memo(
		() => [table.getHeaderGroups()],
		(headerGroups) => {
			if (headerGroups.length === 0) return []

			return headerGroups[headerGroups.length - 1].headers
				.map((h) => h.getLeafHeaders() as Table_Header<TData>[])
				.flat()
		},
		{
			key: 'getLeafHeaders',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
