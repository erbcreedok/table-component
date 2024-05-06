import type { ColumnOrderState, Row } from '@tanstack/react-table'
import { alpha, lighten } from '@mui/material/styles'
import type { TableCellProps } from '@mui/material/TableCell'
import type { Theme } from '@mui/material/styles'

import { Table_AggregationFns } from './aggregationFns'
import { Table_FilterFns } from './filterFns'
import { Table_SortingFns } from './sortingFns'
import { utilColumns } from './utilColumns'
import { showRowActionsColumn } from './utils/showRowActionsColumn'
import { showUtilityColumn } from './utils/showUtilityColumn'

import {
	TableComponentProps,
	Table_Column,
	Table_ColumnDef,
	Table_DefinedColumnDef,
	Table_DisplayColumnIds,
	Table_FilterOption,
	Table_Header,
	TableInstance,
	TableData,
	Colors,
	GroupedCellBase,
	CellBase,
} from '.'

const getColumnIdHelper = <TData extends TableData = {}>(
	columnDef: Table_ColumnDef<TData> | Table_DefinedColumnDef<TData>
): string =>
	columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header

export const getColumnId = <TData extends TableData = {}>(
	column: Table_Column<TData> | Table_ColumnDef<TData>
) => getColumnIdHelper('columnDef' in column ? column.columnDef : column)

export const getAllLeafColumnDefs = <TData extends TableData = {}>(
	columns: Table_ColumnDef<TData>[]
): Table_ColumnDef<TData>[] => {
	const allLeafColumnDefs: Table_ColumnDef<TData>[] = []
	const getLeafColumns = (cols: Table_ColumnDef<TData>[]) => {
		cols.forEach((col) => {
			if (col.columns) {
				getLeafColumns(col.columns)
			} else {
				allLeafColumnDefs.push(col)
			}
		})
	}
	getLeafColumns(columns)

	return allLeafColumnDefs
}

export const prepareColumns = <TData extends TableData = {}>({
	aggregationFns,
	columnDefs,
	columnFilterFns,
	defaultDisplayColumn,
	filterFns,
	sortingFns,
}: {
	aggregationFns: typeof Table_AggregationFns &
		TableComponentProps<TData>['aggregationFns']
	columnDefs: Table_ColumnDef<TData>[]
	columnFilterFns: { [key: string]: Table_FilterOption }
	defaultDisplayColumn: Partial<Table_ColumnDef<TData>>
	filterFns: typeof Table_FilterFns & TableComponentProps<TData>['filterFns']
	sortingFns: typeof Table_SortingFns & TableComponentProps<TData>['sortingFns']
}): Table_DefinedColumnDef<TData>[] =>
	columnDefs.map((columnDef) => {
		// assign columnId
		if (!columnDef.id) columnDef.id = getColumnId(columnDef)
		if (process.env.NODE_ENV !== 'production' && !columnDef.id) {
			console.error(
				'Column definitions must have a valid `accessorKey` or `id` property'
			)
		}

		// assign columnDefType
		if (!columnDef.columnDefType) columnDef.columnDefType = 'data'
		if (columnDef.columns?.length) {
			columnDef.columnDefType = 'group'
			// recursively prepare columns if this is a group column
			columnDef.columns = prepareColumns({
				aggregationFns,
				columnDefs: columnDef.columns,
				columnFilterFns,
				defaultDisplayColumn,
				filterFns,
				sortingFns,
			}) as Table_ColumnDef<TData>[] // todo in EPMDCEMLST-4146
		} else if (columnDef.columnDefType === 'data') {
			// assign aggregationFns if multiple aggregationFns are provided
			if (Array.isArray(columnDef.aggregationFn)) {
				const aggFns = columnDef.aggregationFn as string[]
				columnDef.aggregationFn = (
					columnId: string,
					leafRows: Row<TData>[],
					childRows: Row<TData>[]
				) =>
					aggFns.map((fn) =>
						aggregationFns[fn]?.(columnId, leafRows, childRows)
					)
			}

			if (!columnDef.GroupedCell) {
				columnDef.GroupedCell = GroupedCellBase
			}

			if (!columnDef.Cell) {
				columnDef.Cell = CellBase
			}

			// assign filterFns
			if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
				columnDef.filterFn =
					filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy
				;(columnDef as unknown as Table_DefinedColumnDef)._filterFn =
					columnFilterFns[columnDef.id]
			}

			if (!columnDef.sortingFn && columnDef.dataType) {
				if (['numeric', 'date', 'formula'].includes(columnDef.dataType)) {
					columnDef.sortingFn = 'basic'
				}

				if (
					['textual', 'single-select', 'multi-select'].includes(
						columnDef.dataType
					)
				) {
					columnDef.sortingFn = 'text'
				}
			}

			// assign sortingFns
			if (
				typeof columnDef.sortingFn === 'string' &&
				Object.keys(sortingFns).includes(columnDef.sortingFn)
			) {
				columnDef.sortingFn =
					sortingFns[columnDef.sortingFn as keyof typeof sortingFns]
			}
		} else if (columnDef.columnDefType === 'display') {
			return {
				...(defaultDisplayColumn as Table_ColumnDef<TData>),
				...columnDef,
			}
		}

		// set sorting empty values to bottom
		if (typeof columnDef.sortUndefined === 'undefined') {
			columnDef.sortUndefined = 1
		}

		return columnDef
	}) as Table_DefinedColumnDef<TData>[]

export const reorderColumn = <TData extends TableData = {}>(
	draggedColumn: Table_Column<TData>,
	targetColumn: Table_Column<TData>,
	columnOrder: ColumnOrderState
): ColumnOrderState => {
	const newColumnOrder = [...columnOrder]
	newColumnOrder.splice(
		newColumnOrder.indexOf(targetColumn.id),
		0,
		newColumnOrder.splice(newColumnOrder.indexOf(draggedColumn.id), 1)[0]
	)

	return newColumnOrder
}

export const reorderColumnSet = <TData extends TableData>(
	draggedColumns: Table_Column<TData>[],
	targetColumns: Table_Column<TData>[],
	columnOrder: ColumnOrderState
): ColumnOrderState => {
	const newColumnOrder = [...columnOrder]
	const draggedColumnIndex = columnOrder.indexOf(draggedColumns[0].id)
	const removedElements = newColumnOrder.splice(
		draggedColumnIndex,
		draggedColumns.length
	)
	const newTargetColumnIndex =
		newColumnOrder.indexOf(targetColumns[targetColumns.length - 1].id) + 1

	newColumnOrder.splice(newTargetColumnIndex, 0, ...removedElements)

	return newColumnOrder
}

export const showExpandColumn = <TData extends TableData = {}>(
	props: TableComponentProps<TData>
) => props.renderDetailPanel && !props.hideExpandColumn

export const getLeadingDisplayColumnIds = <TData extends TableData = {}>(
	props: TableComponentProps<TData>
) =>
	[
		showUtilityColumn(props) && utilColumns.column,
		props.positionActionsColumn === 'first' &&
			showRowActionsColumn(props) &&
			utilColumns.actions,
		props.positionExpandColumn === 'first' &&
			showExpandColumn(props) &&
			utilColumns.expand,
	].filter(Boolean) as Table_DisplayColumnIds[]

export const getTrailingDisplayColumnIds = <TData extends TableData = {}>(
	props: TableComponentProps<TData>
) => [
	props.positionActionsColumn === 'last' &&
		showRowActionsColumn(props) &&
		utilColumns.actions,
	showExpandColumn(props) && utilColumns.expand,
]

export const getDefaultColumnOrderIds = <TData extends TableData = {}>(
	props: TableComponentProps<TData>
) =>
	[
		...getLeadingDisplayColumnIds(props),
		...getAllLeafColumnDefs(props.columns).map((columnDef) =>
			getColumnId(columnDef)
		),
		...getTrailingDisplayColumnIds(props),
	].filter(Boolean) as string[]

export const getDefaultColumnFilterFn = <TData extends TableData = {}>(
	columnDef: Table_ColumnDef<TData>
): Table_FilterOption => {
	if (columnDef.filterVariant === 'multi-select') return 'arrIncludesSome'
	if (columnDef.filterVariant === 'range') return 'betweenInclusive'
	if (
		columnDef.filterVariant === 'select' ||
		columnDef.filterVariant === 'checkbox'
	)
		return 'equals'

	return 'fuzzy'
}

export const getIsLastLeftPinnedColumn = (
	table: TableInstance,
	column: Table_Column
) => {
	return (
		column.getIsPinned() === 'left' &&
		table.getLeftVisibleLeafColumns().at(-1)?.getPinnedIndex() ===
			column.getPinnedIndex()
	)
}

export const getIsFirstRightPinnedColumn = (column: Table_Column) => {
	return column.getIsPinned() === 'right' && column.getPinnedIndex() === 0
}

export const getTotalRight = <TData extends TableData = {}>(
	table: TableInstance,
	column: Table_Column<TData>
) => {
	return table.getRightTotalSize() - column.getSize() - column.getStart('right')
}

export const getColumnWidth = ({
	column,
	header,
}: {
	header?: Table_Header
	column: Table_Column
}) => {
	const minSize = column.columnDef.minSize ?? 28
	const size = header?.getSize() ?? column.getSize()
	if (column.getIsGrouped()) {
		return {
			minWidth: `max(${column.getSize()}px, ${Math.max(minSize, 48)}px)`,
			width: Math.max(size, 48),
		}
	}

	return {
		minWidth: `max(${column.getSize()}px, ${minSize}px)`,
		width: header?.getSize() ?? column.getSize(),
	}
}

export const getCommonCellStyles = ({
	column,
	header,
	table,
	tableCellProps,
	theme,
}: {
	column: Table_Column
	header?: Table_Header
	table: TableInstance
	tableCellProps: TableCellProps
	theme: Theme
}) => ({
	backgroundColor:
		column.getIsPinned() && column.columnDef.columnDefType !== 'group'
			? alpha(lighten(theme.palette.background.default, 0.04), 0.97)
			: 'inherit',
	backgroundImage: 'inherit',
	boxShadow: getIsLastLeftPinnedColumn(table, column)
		? `-2px 0 0 0 ${Colors.Gray} inset`
		: getIsFirstRightPinnedColumn(column)
		? `2px 0 0 0 ${Colors.Gray} inset`
		: undefined,
	display: table.options.layoutMode === 'grid' ? 'flex' : 'table-cell',
	...(table.getState().draggingColumn?.id === column.id ||
	table.getState().hoveredColumn?.id === column.id
		? {
				opacity: 0.5,
		  }
		: {}),
	position:
		column.getIsPinned() && column.columnDef.columnDefType !== 'group'
			? 'sticky'
			: 'relative',
	transition:
		table.options.enableColumnVirtualization || column.getIsResizing()
			? 'none'
			: `all 150ms ease-in-out`,
	...(tableCellProps?.sx instanceof Function
		? tableCellProps.sx(theme)
		: (tableCellProps?.sx as any)),
	flex:
		table.options.layoutMode === 'grid'
			? `${column.getSize()} 0 auto`
			: undefined,
	...getColumnWidth({ column, header }),
	...table.options.getPinnedColumnPosition?.(column, table),
})

export const Table_DisplayColumnIdsArray: string[] = [
	utilColumns.column,
	utilColumns.actions,
	utilColumns.expand,
]

export const Table_DefaultColumn = {
	minSize: 28,
	maxSize: 1000,
	size: 180,
}

export const Table_DefaultDisplayColumn: Partial<Table_ColumnDef> = {
	columnDefType: 'display',
	enableColumnActions: false,
	enableColumnDragging: false,
	enableColumnFilter: false,
	enableColumnOrdering: false,
	enableEditing: false,
	enableGlobalFilter: false,
	enableGrouping: false,
	enableHiding: false,
	enableResizing: false,
	enableSorting: false,
}
