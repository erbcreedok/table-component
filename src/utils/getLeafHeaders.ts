import { memo, Table } from '@tanstack/table-core'

import { Table_Header } from '../TableComponent'

import { getMemoOptions } from './getMemoOptions'

export const getLeafHeaders = <TData>(table: Table<TData>) =>
	memo(
		() => [table.getHeaderGroups()],
		(headerGroups) => {
			if (headerGroups.length === 0) return []

			return headerGroups[headerGroups.length - 1].headers
				.map((h) => h.getLeafHeaders() as Table_Header<TData>[])
				.flat()
		},
		getMemoOptions(table.options, 'debugHeaders', 'getLeafHeaders')
	)
