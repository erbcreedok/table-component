import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

export type OnGroupCollapsedToggleProps<TData extends TableData = {}> = {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
	groupId: string
	collapsed?: boolean
}

export const onGroupCollapsedToggleDefault = <TData extends TableData = {}>({
	table,
	groupId,
	collapsed,
}: OnGroupCollapsedToggleProps<TData>) => {
	const { setGroupCollapsed } = table
	setGroupCollapsed((prev) => {
		return {
			...prev,
			[groupId]: collapsed ?? !prev[groupId],
		}
	})
}
