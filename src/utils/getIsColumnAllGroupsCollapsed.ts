import {
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { getColumnGroupIds } from './getColumnGroupIds'

export type GetIsColumnAllGroupsCollapsedProps<TData extends TableData = {}> = {
	table: TableInstance<TData>
	column: Table_Column<TData>
}
export const getIsColumnAllGroupsCollapsedDefault = <
	TData extends TableData = {}
>(
	props: GetIsColumnAllGroupsCollapsedProps<TData>
) => {
	const { table, column } = props
	const { groupCollapsed } = table.getState()
	const flatRows = table.getGroupedRowModel().flatRows as Table_Row<TData>[]
	const columnGroupIds = getColumnGroupIds(flatRows, column.id)

	return columnGroupIds.every((groupId) => groupCollapsed[groupId])
}
