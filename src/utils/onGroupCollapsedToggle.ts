import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

export type OnGroupCollapsedToggleProps<TData> = {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
	groupId: string
	collapsed?: boolean
}

export const onGroupCollapsedToggleDefault = <TData = TableData>({
	table,
	groupId,
	collapsed,
	row,
}: OnGroupCollapsedToggleProps<TData>) => {
	const { setGroupCollapsed } = table

	setGroupCollapsed((prev) => {
		const mainGroupedRowId = row.groupRows[groupId].original.id
		table.refs.returnToRow.current = mainGroupedRowId

		return { ...prev, [groupId]: collapsed ?? !prev[groupId] }
	})
}
