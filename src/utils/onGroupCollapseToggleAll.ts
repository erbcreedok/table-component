import {
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { getColumnGroupIds } from './getColumnGroupIds'

export type OnGroupCollapsedToggleAllProps<TData extends TableData = {}> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	collapsed?: boolean
}

export const onGroupCollapsedToggleAllDefault = <TData extends TableData = {}>({
	column,
	table,
	collapsed = false,
}: OnGroupCollapsedToggleAllProps<TData>) => {
	const { setGroupCollapsed, getGroupedRowModel } = table
	const groupedRows = getGroupedRowModel().flatRows as Table_Row<TData>[]
	const columnId = column.id
	const columnGroupIds = getColumnGroupIds(groupedRows, columnId)
	const newGroupCollapsed: Record<string, boolean> = {}
	columnGroupIds.forEach((groupId) => {
		newGroupCollapsed[groupId] = collapsed
	})
	setGroupCollapsed((prev) => ({
		...prev,
		...newGroupCollapsed,
	}))
}
