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
	const borderLeft = groupBorder
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

	if (isGroupedColumn && colIndex > 0) {
		borders.borderLeft = borderLeft
	}
	if (isFirstOfGroup && rowIndex > 0) {
		borders.borderTop = borderTop
	}

	return borders
}

export const getHeaderGroupBorders = ({ header, table }: HeaderProps) => {
	const groupBorder = table.options.groupBorder
	const borderLeft = groupBorder
		? typeof groupBorder === 'string'
			? groupBorder
			: groupBorder.left
		: undefined
	const borders: GroupBorders = {}
	const { column } = header
	const allColumns = table.getVisibleLeafColumns()
	const colIndex = allColumns.findIndex((c) => c.id === column.id)

	if (colIndex > 0 && column.getIsGrouped()) {
		borders.borderLeft = borderLeft
	}

	return borders
}
