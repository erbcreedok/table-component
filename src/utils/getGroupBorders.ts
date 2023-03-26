import { Table_Cell, Table_Header, TableInstance } from '../TableComponent'

import { getIsFirstOfGroup } from './getIsFirstOfGroup'

type CellProps = {
	cell: Table_Cell
	table: TableInstance
}
type HeaderProps = {
	header: Table_Header
	table: TableInstance
}

const getCellBorders = ({ cell, table }: CellProps) => {
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
	const borders: { [key: string]: string | undefined } = {}
	const rows = table.getPaginationRowModel().rows
	const { row, column } = cell
	const index = rows.findIndex((r) => r.id === row.id)
	const colIndex = table
		.getVisibleLeafColumns()
		.findIndex((c) => c.id === column.id)
	const grouping = table.getState().grouping

	if (column.getIsGrouped()) {
		borders.borderBottom = 'none'
	}

	if (colIndex > 0 && column.getIsGrouped()) {
		borders.borderLeft = borderLeft
	}
	if (
		index > 0 &&
		grouping.some((columnId) => getIsFirstOfGroup({ table, cell, columnId }))
	) {
		borders.borderTop = borderTop
	}

	return borders
}

const getHeaderBorders = ({ header, table }: HeaderProps) => {
	const groupBorder = table.options.groupBorder
	const borderLeft = groupBorder
		? typeof groupBorder === 'string'
			? groupBorder
			: groupBorder.left
		: undefined
	const borders: { [key: string]: string | undefined } = {}
	const { column } = header
	const colIndex = table
		.getVisibleLeafColumns()
		.findIndex((c) => c.id === column.id)

	if (colIndex > 0 && column.getIsGrouped()) {
		borders.borderLeft = borderLeft
	}

	return borders
}
export const getGroupBorders = (props: CellProps | HeaderProps) => {
	if (props.table.options.enableAggregationRow) return {}

	if ('cell' in props) {
		return getCellBorders(props)
	}

	return getHeaderBorders(props)
}
