import { HeaderGroup } from '@tanstack/react-table'
import { memo, Table } from '@tanstack/table-core'

import { getNonCollapsedColumnItems } from '../../utils/getNonCollapsedColumnItems'

export const getHeaderGroupsWithCollapseMultirow = <TData>(
	table: Table<TData>,
	getHeaderGroups: () => HeaderGroup<TData>[]
) =>
	memo(
		() => [getHeaderGroups()],
		(headerGroups) =>
			headerGroups.map((headerGroup) => {
				headerGroup.getNonCollapsedHeaders = getNonCollapsedHeaders(
					headerGroup,
					table
				) as any

				return headerGroup
			}),
		{
			key: 'getHeaderGroupsWithCollapseMultirow',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)

const getNonCollapsedHeaders = <TData>(
	headerGroup: HeaderGroup<TData>,
	table: Table<TData>
) =>
	memo(
		() => [headerGroup, table.getState().collapsedMultirow],
		(headerGroup, collapsedMultirow) =>
			getNonCollapsedColumnItems(headerGroup.headers, collapsedMultirow),
		{
			key: 'getNonCollapsedHeaders',
			debug: () => table.options.debugAll ?? table.options.debugTable,
		}
	)
