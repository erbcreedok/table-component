import {
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

import { getColumnGroupIds } from './getColumnGroupIds'

export type OnGroupCollapsedToggleAllProps<TData = TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	collapsed?: boolean
}

export const onGroupCollapsedToggleAllDefault = ({
	column,
	table,
	collapsed = false,
}: OnGroupCollapsedToggleAllProps) => {
	const { setGroupCollapsed, getGroupedRowModel } = table
	const groupedRows = getGroupedRowModel().flatRows as Table_Row[]
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
