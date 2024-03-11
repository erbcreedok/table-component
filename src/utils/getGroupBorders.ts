import { Table_Header, TableInstance } from '../TableComponent'

type CellProps = {
	table: TableInstance
	colIndex: number
	rowIndex: number
	isFirstOfGroup: boolean
	isGroupedColumn: boolean
}
type HeaderProps = {
	header: Table_Header
	table: TableInstance
}
export type GroupBorders = { [key: string]: string | undefined }

export const getCellGroupBorders = ({
	table,
	rowIndex,
	colIndex,
	isFirstOfGroup,
	isGroupedColumn,
}: CellProps) => {
	const groupBorder = table.options.groupBorder
	const grouping = table.getState().grouping
	const borderRight = groupBorder
		? typeof groupBorder === 'string'
			? groupBorder
			: groupBorder.left
		: undefined
	const borderTop = groupBorder
		? typeof groupBorder === 'string'
			? groupBorder
			: groupBorder.top
		: undefined
	const borders: GroupBorders = {}

	if (isGroupedColumn) {
		borders.borderBottom = 'none'
	}

	if (isGroupedColumn && colIndex < grouping.length - 1) {
		borders.borderRight = borderRight
	}
	if (isFirstOfGroup && rowIndex > 0) {
		borders.borderTop = borderTop
	}

	return borders
}

export const getHeaderGroupBorders = ({ header, table }: HeaderProps) => {
	const groupBorder = table.options.groupBorder
	const grouping = table.getState().grouping
	const borderRight = groupBorder
		? typeof groupBorder === 'string'
			? groupBorder
			: groupBorder.left
		: undefined
	const borders: GroupBorders = {}
	const { column } = header
	const allColumns = table.getVisibleLeafColumns()
	const colIndex = allColumns.findIndex((c) => c.id === column.id)

	if (colIndex < grouping.length - 1 && column.getIsGrouped()) {
		borders.borderRight = borderRight
	}

	return borders
}
