import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'

export type GetIsGroupCollapsedProps<TData extends TableData = {}> = {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
	groupId: string
}
export const getIsGroupCollapsedDefault = <TData extends TableData = {}>({
	table,
	groupId,
}: GetIsGroupCollapsedProps<TData>) => {
	const { groupCollapsed } = table.getState()

	return !groupCollapsed[groupId]
}
