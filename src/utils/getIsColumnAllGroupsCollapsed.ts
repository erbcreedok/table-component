import {
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { getColumnGroupIds } from './getColumnGroupIds'

export type GetIsColumnAllGroupsCollapsedProps<TData = TableData> = {
	table: TableInstance<TData>
	column: Table_Column<TData>
}
export const getIsColumnAllGroupsCollapsedDefault = (
	props: GetIsColumnAllGroupsCollapsedProps
) => {
	const { table, column } = props
	const { groupCollapsed } = table.getState()
	const flatRows = table.getGroupedRowModel().flatRows as Table_Row[]
	const columnGroupIds = getColumnGroupIds(flatRows, column.id)

	return columnGroupIds.every((groupId) => groupCollapsed[groupId])
}
