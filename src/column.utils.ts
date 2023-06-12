import type { ColumnOrderState, Row } from '@tanstack/react-table'
import { alpha, lighten } from '@mui/material/styles'
import type { TableCellProps } from '@mui/material/TableCell'
import type { Theme } from '@mui/material/styles'

import { Table_AggregationFns } from './aggregationFns'
import { Table_FilterFns } from './filterFns'
import { Table_SortingFns } from './sortingFns'

import type {
	TableComponentProps,
	Table_Column,
	Table_ColumnDef,
	Table_DefinedColumnDef,
	Table_DisplayColumnIds,
	Table_FilterOption,
	Table_Header,
	TableInstance,
} from '.'

export const getColumnId = <TData extends Record<string, any> = {}>(
	columnDef: Table_ColumnDef<TData>
): string =>
	columnDef.id ?? columnDef.accessorKey?.toString?.() ?? columnDef.header

export const getAllLeafColumnDefs = <TData extends Record<string, any> = {}>(
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

export const prepareColumns = <TData extends Record<string, any> = {}>({
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
			})
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

			// assign filterFns
			if (Object.keys(filterFns).includes(columnFilterFns[columnDef.id])) {
				columnDef.filterFn =
					filterFns[columnFilterFns[columnDef.id]] ?? filterFns.fuzzy
				;(columnDef as unknown as Table_DefinedColumnDef)._filterFn =
					columnFilterFns[columnDef.id]
			}

			// assign sortingFns
			if (Object.keys(sortingFns).includes(columnDef.sortingFn as string)) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				columnDef.sortingFn = sortingFns[columnDef.sortingFn]
			} else if (!columnDef.sortingFn) {
				if (
					columnDef.dataType &&
					['numeric', 'date', 'formula'].includes(columnDef.dataType)
				) {
					columnDef.sortingFn = 'basic'
				}

				if (
					columnDef.dataType &&
					['textual', 'single-select', 'multi-select'].includes(
						columnDef?.dataType
					)
				) {
					columnDef.sortingFn = 'text'
				}
			}
		} else if (columnDef.columnDefType === 'display') {
			return {
				...(defaultDisplayColumn as Table_ColumnDef<TData>),
				...columnDef,
			}
		}

		return columnDef
	}) as Table_DefinedColumnDef<TData>[]

export const reorderColumn = <TData extends Record<string, any> = {}>(
	draggedColumn: Table_Column<TData>,
	targetColumn: Table_Column<TData>,
	columnOrder: ColumnOrderState
): ColumnOrderState => {
	if (draggedColumn?.getCanPin?.()) {
		draggedColumn.pin(targetColumn.getIsPinned())
	}
	columnOrder.splice(
		columnOrder.indexOf(targetColumn.id),
		0,
		columnOrder.splice(columnOrder.indexOf(draggedColumn.id), 1)[0]
	)

	return [...columnOrder]
}

export const showExpandColumn = <TData extends Record<string, any> = {}>(
	props: TableComponentProps<TData>
) =>
	!!(
		(props.enableExpanding || props.renderDetailPanel) &&
		!props.hideDefaultExpandIcon
	)

export const getLeadingDisplayColumnIds = <
	TData extends Record<string, any> = {}
>(
	props: TableComponentProps<TData>
) =>
	[
		(props.enableRowDragging || props.enableRowOrdering) && 'mrt-row-drag',
		props.positionActionsColumn === 'first' &&
			(props.enableRowActions ||
				(props.enableEditing &&
					['row', 'modal'].includes(props.editingMode ?? ''))) &&
			'mrt-row-actions',
		props.positionExpandColumn === 'first' &&
			showExpandColumn(props) &&
			'mrt-row-expand',
		props.enableRowSelection && 'mrt-row-select',
		props.enableRowNumbers && 'mrt-row-numbers',
	].filter(Boolean) as Table_DisplayColumnIds[]

export const getTrailingDisplayColumnIds = <
	TData extends Record<string, any> = {}
>(
	props: TableComponentProps<TData>
) => [
	props.positionActionsColumn === 'last' &&
		(props.enableRowActions ||
			(props.enableEditing &&
				['row', 'modal'].includes(props.editingMode ?? ''))) &&
		'mrt-row-actions',
	props.positionExpandColumn === 'last' &&
		showExpandColumn(props) &&
		'mrt-row-expand',
]

export const getDefaultColumnOrderIds = <
	TData extends Record<string, any> = {}
>(
	props: TableComponentProps<TData>
) =>
	[
		...getLeadingDisplayColumnIds(props),
		...getAllLeafColumnDefs(props.columns).map((columnDef) =>
			getColumnId(columnDef)
		),
		...getTrailingDisplayColumnIds(props),
	].filter(Boolean) as string[]

export const getDefaultColumnFilterFn = <
	TData extends Record<string, any> = {}
>(
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
		table.getLeftLeafHeaders().length - 1 === column.getPinnedIndex()
	)
}

export const getIsFirstRightPinnedColumn = (column: Table_Column) => {
	return column.getIsPinned() === 'right' && column.getPinnedIndex() === 0
}

export const getTotalRight = (table: TableInstance, column: Table_Column) => {
	return (
		(table.getRightLeafHeaders().length - 1 - column.getPinnedIndex()) * 200
	)
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
		? `-4px 0 8px -6px ${alpha(theme.palette.common.black, 0.2)} inset`
		: getIsFirstRightPinnedColumn(column)
		? `4px 0 8px -6px ${alpha(theme.palette.common.black, 0.2)} inset`
		: undefined,
	display: table.options.layoutMode === 'grid' ? 'flex' : 'table-cell',
	left:
		column.getIsPinned() === 'left'
			? `${column.getStart('left')}px`
			: undefined,
	ml:
		table.options.enableColumnVirtualization &&
		column.getIsPinned() === 'left' &&
		column.getPinnedIndex() === 0
			? `-${
					column.getSize() * (table.getState().columnPinning.left?.length ?? 1)
			  }px`
			: undefined,
	mr:
		table.options.enableColumnVirtualization &&
		column.getIsPinned() === 'right' &&
		column.getPinnedIndex() === table.getVisibleLeafColumns().length - 1
			? `-${
					column.getSize() *
					(table.getState().columnPinning.right?.length ?? 1) *
					1.2
			  }px`
			: undefined,
	opacity:
		table.getState().draggingColumn?.id === column.id ||
		table.getState().hoveredColumn?.id === column.id
			? 0.5
			: 1,
	position:
		column.getIsPinned() && column.columnDef.columnDefType !== 'group'
			? 'sticky'
			: 'relative',
	right:
		column.getIsPinned() === 'right'
			? `${getTotalRight(table, column)}px`
			: undefined,
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
})

export const Table_DisplayColumnIdsArray = [
	'mrt-row-actions',
	'mrt-row-drag',
	'mrt-row-expand',
	'mrt-row-numbers',
	'mrt-row-select',
]

export const Table_DefaultColumn = {
	minSize: 28,
	maxSize: 1000,
	size: 180,
}

export const Table_DefaultDisplayColumn: Partial<Table_ColumnDef> = {
	columnDefType: 'display',
	enableClickToCopy: false,
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
