/* eslint-disable no-param-reassign */
import React, {
	Dispatch,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	useMemo,
} from 'react'
import type { AlertProps } from '@mui/material/Alert'
import type { ButtonProps } from '@mui/material/Button'
import type { CheckboxProps } from '@mui/material/Checkbox'
import type { ChipProps } from '@mui/material/Chip'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { LinearProgressProps } from '@mui/material/LinearProgress'
import type { PaperProps } from '@mui/material/Paper'
import type { RadioProps } from '@mui/material/Radio'
import type { SkeletonProps } from '@mui/material/Skeleton'
import type { TableProps } from '@mui/material/Table'
import type { TableBodyProps } from '@mui/material/TableBody'
import type { TableCellProps } from '@mui/material/TableCell'
import type { TableContainerProps } from '@mui/material/TableContainer'
import type { TableFooterProps } from '@mui/material/TableFooter'
import type { TableHeadProps } from '@mui/material/TableHead'
import type { TablePaginationProps } from '@mui/material/TablePagination'
import type { TableRowProps } from '@mui/material/TableRow'
import type { TextFieldProps } from '@mui/material/TextField'
import type { ToolbarProps } from '@mui/material/Toolbar'
import type {
	AggregationFn,
	Cell,
	Column,
	ColumnDef,
	DeepKeys,
	FilterFn,
	Header,
	HeaderGroup,
	OnChangeFn,
	Row,
	SortingFn,
	Table,
	TableOptions,
	TableState,
} from '@tanstack/react-table'
import type { VirtualizerOptions, Virtualizer } from '@tanstack/react-virtual'

import { Table_AggregationFns } from './aggregationFns'
import { Table_DefaultColumn, Table_DefaultDisplayColumn } from './column.utils'
import { Table_FilterFns } from './filterFns'
import { Default_Icons, Table_Icons } from './icons'
import { Table_SortingFns } from './sortingFns'
import { TableRoot } from './table/TableRoot'
import { Table_Localization_EN } from './_locales/en'

/**
 * Most of this file is just TypeScript types
 */

type LiteralUnion<T extends U, U = string> = T | (U & Record<never, never>)

export interface Table_Localization {
	actions: string
	and: string
	cancel: string
	changeFilterMode: string
	changeSearchMode: string
	clearFilter: string
	clearSearch: string
	clearSort: string
	clickToCopy: string
	collapse: string
	collapseAll: string
	columnActions: string
	copiedToClipboard: string
	dropToGroupBy: string
	edit: string
	expand: string
	expandAll: string
	filterArrIncludes: string
	filterArrIncludesAll: string
	filterArrIncludesSome: string
	filterBetween: string
	filterBetweenInclusive: string
	filterByColumn: string
	filterContains: string
	filterEmpty: string
	filterEndsWith: string
	filterEquals: string
	filterEqualsString: string
	filterFuzzy: string
	filterGreaterThan: string
	filterGreaterThanOrEqualTo: string
	filterInNumberRange: string
	filterIncludesString: string
	filterIncludesStringSensitive: string
	filterLessThan: string
	filterLessThanOrEqualTo: string
	filterMode: string
	filterNotEmpty: string
	filterNotEquals: string
	filterStartsWith: string
	filterWeakEquals: string
	filteringByColumn: string
	goToFirstPage: string
	goToLastPage: string
	goToNextPage: string
	goToPreviousPage: string
	grab: string
	groupByColumn: string
	groupedBy: string
	hideAll: string
	hideColumn: string
	max: string
	min: string
	move: string
	noRecordsToDisplay: string
	noResultsFound: string
	of: string
	or: string
	pinToLeft: string
	pinToRight: string
	resetColumnSize: string
	resetOrder: string
	rowActions: string
	rowNumber: string
	rowNumbers: string
	rowsPerPage: string
	save: string
	search: string
	select: string
	selectedCountOfRowCountRowsSelected: string
	showAll: string
	showAllColumns: string
	showHideColumns: string
	showHideFilters: string
	showGrouping: string
	showSorting: string
	showFiltering: string
	showHideSearch: string
	showSettings: string
	showPreset: string
	sortByColumnAsc: string
	sortByColumnDesc: string
	sortedByColumnAsc: string
	sortedByColumnDesc: string
	thenBy: string
	toggleDensity: string
	toggleFullScreen: string
	toggleSelectAll: string
	toggleSelectRow: string
	toggleVisibility: string
	ungroupByColumn: string
	unpin: string
	unpinAll: string
	unsorted: string
}

export interface Table_RowModel<TData extends Record<string, any> = {}> {
	flatRows: Table_Row<TData>[]
	rows: Table_Row<TData>[]
	rowsById: { [key: string]: Table_Row<TData> }
}

export type TableInstance<TData extends Record<string, any> = {}> = Omit<
	Table<TData>,
	| 'getAllColumns'
	| 'getAllFlatColumns'
	| 'getAllLeafColumns'
	| 'getCenterLeafColumns'
	| 'getColumn'
	| 'getExpandedRowModel'
	| 'getFlatHeaders'
	| 'getLeftLeafColumns'
	| 'getPaginationRowModel'
	| 'getPreFilteredRowModel'
	| 'getPrePaginationRowModel'
	| 'getRightLeafColumns'
	| 'getRowModel'
	| 'getSelectedRowModel'
	| 'getState'
	| 'options'
> & {
	getAllColumns: () => Table_Column<TData>[]
	getAllFlatColumns: () => Table_Column<TData>[]
	getAllLeafColumns: () => Table_Column<TData>[]
	getCenterLeafColumns: () => Table_Column<TData>[]
	getColumn: (columnId: string) => Table_Column<TData>
	getExpandedRowModel: () => Table_RowModel<TData>
	getFlatHeaders: () => Table_Header<TData>[]
	getLeftLeafColumns: () => Table_Column<TData>[]
	getPaginationRowModel: () => Table_RowModel<TData>
	getPreFilteredRowModel: () => Table_RowModel<TData>
	getPrePaginationRowModel: () => Table_RowModel<TData>
	getRightLeafColumns: () => Table_Column<TData>[]
	getRowModel: () => Table_RowModel<TData>
	getSelectedRowModel: () => Table_RowModel<TData>
	getState: () => Table_TableState<TData>
	options: TableComponentProps<TData> & {
		icons: Table_Icons
		localization: Table_Localization
		enableAggregationRow?: boolean
		enableMergedGrouping?: boolean
	}
	refs: {
		bottomToolbarRef: MutableRefObject<HTMLDivElement>
		editInputRefs: MutableRefObject<Record<string, HTMLInputElement>>
		filterInputRefs: MutableRefObject<Record<string, HTMLInputElement>>
		searchInputRef: MutableRefObject<HTMLInputElement>
		tableContainerRef: MutableRefObject<HTMLDivElement>
		tableHeadCellRefs: MutableRefObject<Record<string, HTMLTableCellElement>>
		tablePaperRef: MutableRefObject<HTMLDivElement>
		topToolbarRef: MutableRefObject<HTMLDivElement>
		tableToolbarRef: MutableRefObject<HTMLDivElement>
	}
	setColumnFilterFns: Dispatch<
		SetStateAction<{ [key: string]: Table_FilterOption }>
	>
	setDraggingColumn: Dispatch<SetStateAction<Table_Column<TData> | null>>
	setDraggingRow: Dispatch<SetStateAction<Table_Row<TData> | null>>
	setEditingCell: Dispatch<SetStateAction<Table_Cell<TData> | null>>
	setEditingRow: Dispatch<SetStateAction<Table_Row<TData> | null>>
	setGlobalFilterFn: Dispatch<SetStateAction<Table_FilterOption>>
	setHoveredColumn: Dispatch<
		SetStateAction<Table_Column<TData> | { id: string } | null>
	>
	setHoveredRow: Dispatch<
		SetStateAction<Table_Row<TData> | { id: string } | null>
	>
	setIsFullScreen: Dispatch<SetStateAction<boolean>>
	setShowAlertBanner: Dispatch<SetStateAction<boolean>>
	setShowFilters: Dispatch<SetStateAction<boolean>>
	setShowGlobalFilter: Dispatch<SetStateAction<boolean>>
	setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>
}

export type Table_TableState<TData extends Record<string, any> = {}> =
	TableState & {
		columnFilterFns: Record<string, Table_FilterOption>
		draggingColumn: Table_Column<TData> | null
		draggingRow: Table_Row<TData> | null
		editingCell: Table_Cell<TData> | null
		editingRow: Table_Row<TData> | null
		globalFilterFn: Table_FilterOption
		hoveredColumn: Table_Column<TData> | { id: string } | null
		hoveredRow: Table_Row<TData> | { id: string } | null
		isFullScreen: boolean
		isLoading: boolean
		showAlertBanner: boolean
		showColumnFilters: boolean
		showGlobalFilter: boolean
		showProgressBars: boolean
		showSkeletons: boolean
		showToolbarDropZone: boolean
	}

export type Table_ColumnDef<TData extends Record<string, any> = {}> = Omit<
	ColumnDef<TData, unknown>,
	| 'accessorKey'
	| 'aggregatedCell'
	| 'aggregationFn'
	| 'cell'
	| 'columns'
	| 'filterFn'
	| 'footer'
	| 'header'
	| 'id'
	| 'sortingFn'
> & {
	AggregatedCell?: ({
		cell,
		column,
		row,
		table,
	}: {
		cell: Table_Cell<TData>
		column: Table_Column<TData>
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode
	Cell?: ({
		cell,
		column,
		row,
		table,
	}: {
		cell: Table_Cell<TData>
		column: Table_Column<TData>
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode
	Edit?: ({
		cell,
		column,
		row,
		table,
	}: {
		cell: Table_Cell<TData>
		column: Table_Column<TData>
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode
	Filter?: ({
		column,
		header,
		rangeFilterIndex,
		table,
	}: {
		column: Table_Column<TData>
		header: Table_Header<TData>
		rangeFilterIndex?: number
		table: TableInstance<TData>
	}) => ReactNode
	Footer?:
		| ReactNode
		| (({
				column,
				footer,
				table,
		  }: {
				column: Table_Column<TData>
				footer: Table_Header<TData>
				table: TableInstance<TData>
		  }) => ReactNode)
	GroupedCell?: ({
		cell,
		column,
		row,
		table,
	}: {
		cell: Table_Cell<TData>
		column: Table_Column<TData>
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode
	Header?:
		| ReactNode
		| (({
				column,
				header,
				table,
		  }: {
				column: Table_Column<TData>
				header: Table_Header<TData>
				table: TableInstance<TData>
		  }) => ReactNode)
	/**
	 * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
	 * Specify a function here to point to the correct property in the data object.
	 *
	 * @example accessorFn: (row) => row.username
	 */
	accessorFn?: (originalRow: TData) => any
	/**
	 * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
	 * Specify which key in the row this column should use to access the correct data.
	 * Also supports Deep Key Dot Notation.
	 *
	 * @example accessorKey: 'username' //simple
	 * @example accessorKey: 'name.firstName' //deep key dot notation
	 */
	accessorKey?: DeepKeys<TData>
	aggregationFn?: Table_AggregationFn<TData> | Array<Table_AggregationFn<TData>>
	/**
	 * Specify what type of column this is. Either `data`, `display`, or `group`. Defaults to `data`.
	 * Leave this blank if you are just creating a normal data column.
	 *
	 * @default 'data'
	 *
	 * @example columnDefType: 'display'
	 */
	columnDefType?: 'data' | 'display' | 'group'
	columnFilterModeOptions?: Array<
		LiteralUnion<string & Table_FilterOption>
	> | null
	columns?: Table_ColumnDef<TData>[]
	enableClickToCopy?: boolean
	enableColumnActions?: boolean
	enableColumnDragging?: boolean
	enableColumnFilterModes?: boolean
	enableColumnOrdering?: boolean
	enableEditing?: boolean
	filterFn?: Table_FilterFn<TData>
	filterSelectOptions?: (string | { text: string; value: any })[]
	filterVariant?: 'text' | 'select' | 'multi-select' | 'range' | 'checkbox'
	/**
	 * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
	 */
	footer?: string
	/**
	 * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
	 */
	header: string
	/**
	 * Either an `accessorKey` or a combination of an `accessorFn` and `id` are required for a data column definition.
	 *
	 * If you have also specified an `accessorFn`, Table still needs to have a valid `id` to be able to identify the column uniquely.
	 *
	 * `id` defaults to the `accessorKey` or `header` if not specified.
	 *
	 * @default gets set to the same value as `accessorKey` by default
	 */
	id?: LiteralUnion<string & keyof TData>
	muiTableBodyCellCopyButtonProps?:
		| ButtonProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => ButtonProps)
	muiTableBodyCellEditTextFieldProps?:
		| TextFieldProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => TextFieldProps)
	muiTableBodyCellProps?:
		| TableCellProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => TableCellProps)
	muiTableFooterCellProps?:
		| TableCellProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => TableCellProps)
	muiTableHeadCellColumnActionsButtonProps?:
		| IconButtonProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => IconButtonProps)
	muiTableHeadCellDragHandleProps?:
		| IconButtonProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => IconButtonProps)
	muiTableHeadCellFilterCheckboxProps?:
		| CheckboxProps
		| (({
				column,
				table,
		  }: {
				column: Table_Column<TData>
				table: TableInstance<TData>
		  }) => CheckboxProps)
	muiTableHeadCellFilterTextFieldProps?:
		| TextFieldProps
		| (({
				table,
				column,
				rangeFilterIndex,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
				rangeFilterIndex?: number
		  }) => TextFieldProps)
	muiTableHeadCellProps?:
		| TableCellProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => TableCellProps)
	renderColumnActionsMenuItems?: ({
		closeMenu,
		column,
		table,
	}: {
		closeMenu: () => void
		column: Table_Column<TData>
		table: TableInstance<TData>
	}) => ReactNode[]
	renderColumnFilterModeMenuItems?: ({
		column,
		internalFilterOptions,
		onSelectFilterMode,
		table,
	}: {
		column: Table_Column<TData>
		internalFilterOptions: Table_InternalFilterOption[]
		onSelectFilterMode: (filterMode: Table_FilterOption) => void
		table: TableInstance<TData>
	}) => ReactNode[]
	sortingFn?: Table_SortingFn<TData>
}

export type Table_DefinedColumnDef<TData extends Record<string, any> = {}> =
	Omit<Table_ColumnDef<TData>, 'id' | 'defaultDisplayColumn'> & {
		defaultDisplayColumn: Partial<Table_ColumnDef<TData>>
		id: string
		_filterFn: Table_FilterOption
	}

export type Table_Column<TData extends Record<string, any> = {}> = Omit<
	Column<TData, unknown>,
	'header' | 'footer' | 'columns' | 'columnDef' | 'filterFn'
> & {
	columnDef: Table_DefinedColumnDef<TData>
	columns?: Table_Column<TData>[]
	filterFn?: Table_FilterFn<TData>
	footer: string
	header: string
}

export type Table_Header<TData extends Record<string, any> = {}> = Omit<
	Header<TData, unknown>,
	'column'
> & {
	column: Table_Column<TData>
}

export type Table_HeaderGroup<TData extends Record<string, any> = {}> = Omit<
	HeaderGroup<TData>,
	'headers'
> & {
	headers: Table_Header<TData>[]
}

export type Table_Row<TData extends Record<string, any> = {}> = Omit<
	Row<TData>,
	'getVisibleCells' | 'getAllCells' | 'subRows' | '_valuesCache'
> & {
	getAllCells: () => Table_Cell<TData>[]
	getVisibleCells: () => Table_Cell<TData>[]
	subRows?: Table_Row<TData>[]
	_valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>
}

export type Table_Cell<TData extends Record<string, any> = {}> = Omit<
	Cell<TData, unknown>,
	'column' | 'row'
> & {
	column: Table_Column<TData>
	row: Table_Row<TData>
}

export type Table_AggregationOption = string & keyof typeof Table_AggregationFns

export type Table_AggregationFn<TData extends Record<string, any> = {}> =
	| AggregationFn<TData>
	| Table_AggregationOption

export type Table_SortingOption = LiteralUnion<
	string & keyof typeof Table_SortingFns
>

export type Table_SortingFn<TData extends Record<string, any> = {}> =
	| SortingFn<TData>
	| Table_SortingOption

export type Table_FilterOption = LiteralUnion<
	string & keyof typeof Table_FilterFns
>

export type Table_FilterFn<TData extends Record<string, any> = {}> =
	| FilterFn<TData>
	| Table_FilterOption

export type Table_InternalFilterOption = {
	option: string
	symbol: string
	label: string
	divider: boolean
}

export type Table_DisplayColumnIds =
	| 'mrt-row-actions'
	| 'mrt-row-drag'
	| 'mrt-row-expand'
	| 'mrt-row-numbers'
	| 'mrt-row-select'

/**
 * `columns` and `data` props are the only required props, but there are over 150 other optional props.
 *
 * See more info on creating columns and data on the official docs site:
 * @link https://www.material-react-table.com/docs/getting-started/usage
 *
 * See the full props list on the official docs site:
 * @link https://www.material-react-table.com/docs/api/props
 */
export type TableComponentProps<TData extends Record<string, any> = {}> = Omit<
	Partial<TableOptions<TData>>,
	| 'columns'
	| 'data'
	| 'defaultColumn'
	| 'enableRowSelection'
	| 'expandRowsFn'
	| 'getRowId'
	| 'globalFilterFn'
	| 'initialState'
	| 'onStateChange'
	| 'state'
> & {
	columnFilterModeOptions?: Array<
		LiteralUnion<string & Table_FilterOption>
	> | null
	/**
	 * The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in the `data` prop.
	 *
	 * See more info on creating columns on the official docs site:
	 * @link https://www.material-react-table.com/docs/guides/data-columns
	 * @link https://www.material-react-table.com/docs/guides/display-columns
	 *
	 * See all Columns Options on the official docs site:
	 * @link https://www.material-react-table.com/docs/api/column-options
	 */
	columns: Table_ColumnDef<TData>[]
	/**
	 * Pass your data as an array of objects. Objects can theoretically be any shape, but it's best to keep them consistent.
	 *
	 * See the usage guide for more info on creating columns and data:
	 * @link https://www.material-react-table.com/docs/getting-started/usage
	 */
	data: TData[]
	/**
	 * Instead of specifying a bunch of the same options for each column, you can just change an option in the `defaultColumn` prop to change a default option for all columns.
	 */
	defaultColumn?: Partial<Table_ColumnDef<TData>>
	/**
	 * Change the default options for display columns.
	 */
	defaultDisplayColumn?: Partial<Table_ColumnDef<TData>>
	displayColumnDefOptions?: Partial<{
		[key in Table_DisplayColumnIds]: Partial<Table_ColumnDef>
	}>
	editingMode?: 'table' | 'modal' | 'row' | 'cell'
	enableAggregationRow?: boolean
	enableMergedGrouping?: boolean
	enableBottomToolbar?: boolean
	enableClickToCopy?: boolean
	enableColumnActions?: boolean
	enableColumnDragging?: boolean
	enableColumnFilterModes?: boolean
	enableColumnOrdering?: boolean
	enableColumnVirtualization?: boolean
	enableDensityToggle?: boolean
	enableEditing?: boolean
	enableExpandAll?: boolean
	enableFullScreenToggle?: boolean
	enableGlobalFilterModes?: boolean
	enableGlobalFilterRankedResults?: boolean
	enablePagination?: boolean
	enableRowActions?: boolean
	enableRowDragging?: boolean
	enableRowNumbers?: boolean
	enableRowOrdering?: boolean
	enableRowSelection?: boolean | ((row: Table_Row<TData>) => boolean)
	enableRowVirtualization?: boolean
	enableSelectAll?: boolean
	enableStickyFooter?: boolean
	enableStickyHeader?: boolean
	enableTableFooter?: boolean
	enableTableHead?: boolean
	enableToolbarInternalActions?: boolean
	enableTopToolbar?: boolean
	expandRowsFn?: (dataRow: TData) => TData[]
	getRowId?: (
		originalRow: TData,
		index: number,
		parentRow: Table_Row<TData>
	) => string
	globalFilterFn?: Table_FilterOption
	globalFilterModeOptions?: Table_FilterOption[] | null
	groupsSorting?: any
	groupBorder?: string | { left: string; top: string }
	icons?: Partial<Table_Icons>
	initialState?: Partial<Table_TableState<TData>>
	/**
	 * Changes which kind of CSS layout is used to render the table. `semantic` uses default semantic HTML elements, while `grid` adds CSS grid and flexbox styles
	 */
	layoutMode?: 'semantic' | 'grid'
	/**
	 * Pass in either a locale imported from `material-react-table/locales/*` or a custom locale object.
	 *
	 * See the localization (i18n) guide for more info:
	 * @link https://www.material-react-table.com/docs/guides/localization
	 */
	localization?: Partial<Table_Localization>
	/**
	 * Memoize cells, rows, or the entire table body to potentially improve render performance.
	 *
	 * @warning This will break some dynamic rendering features. See the memoization guide for more info:
	 * @link https://www.material-react-table.com/docs/guides/memoize-components
	 */
	memoMode?: 'cells' | 'rows' | 'table-body'
	muiBottomToolbarProps?:
		| ToolbarProps
		| (({ table }: { table: TableInstance<TData> }) => ToolbarProps)
	muiExpandAllButtonProps?:
		| IconButtonProps
		| (({ table }: { table: TableInstance<TData> }) => IconButtonProps)
	muiExpandButtonProps?:
		| IconButtonProps
		| (({
				row,
				table,
		  }: {
				table: TableInstance<TData>
				row: Table_Row<TData>
		  }) => IconButtonProps)
	muiLinearProgressProps?:
		| LinearProgressProps
		| (({
				isTopToolbar,
				table,
		  }: {
				isTopToolbar: boolean
				table: TableInstance<TData>
		  }) => LinearProgressProps)
	muiSearchTextFieldProps?:
		| TextFieldProps
		| (({ table }: { table: TableInstance<TData> }) => TextFieldProps)
	muiSelectAllCheckboxProps?:
		| CheckboxProps
		| (({ table }: { table: TableInstance<TData> }) => CheckboxProps)
	muiSelectCheckboxProps?:
		| (CheckboxProps | RadioProps)
		| (({
				table,
				row,
		  }: {
				table: TableInstance<TData>
				row: Table_Row<TData>
		  }) => CheckboxProps | RadioProps)
	muiTableBodyCellCopyButtonProps?:
		| ButtonProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => ButtonProps)
	muiTableBodyCellEditTextFieldProps?:
		| TextFieldProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => TextFieldProps)
	muiTableBodyCellProps?:
		| TableCellProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => TableCellProps)
	muiTableBodyCellSkeletonProps?:
		| SkeletonProps
		| (({
				cell,
				column,
				row,
				table,
		  }: {
				cell: Table_Cell<TData>
				column: Table_Column<TData>
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => SkeletonProps)
	muiTableBodyProps?:
		| TableBodyProps
		| (({ table }: { table: TableInstance<TData> }) => TableBodyProps)
	muiTableBodyRowDragHandleProps?:
		| IconButtonProps
		| (({
				table,
				row,
		  }: {
				table: TableInstance<TData>
				row: Table_Row<TData>
		  }) => IconButtonProps)
	muiTableBodyRowProps?:
		| TableRowProps
		| (({
				isDetailPanel = false,
				row,
				table,
		  }: {
				isDetailPanel?: boolean
				row: Table_Row<TData>
				table: TableInstance<TData>
		  }) => TableRowProps)
	muiTableContainerProps?:
		| TableContainerProps
		| (({ table }: { table: TableInstance<TData> }) => TableContainerProps)
	muiTableDetailPanelProps?:
		| TableCellProps
		| (({
				table,
				row,
		  }: {
				table: TableInstance<TData>
				row: Table_Row<TData>
		  }) => TableCellProps)
	muiTableFooterCellProps?:
		| TableCellProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => TableCellProps)
	muiTableFooterProps?:
		| TableFooterProps
		| (({ table }: { table: TableInstance<TData> }) => TableFooterProps)
	muiTableFooterRowProps?:
		| TableRowProps
		| (({
				table,
				footerGroup,
		  }: {
				table: TableInstance<TData>
				footerGroup: Table_HeaderGroup<TData>
		  }) => TableRowProps)
	muiTableHeadCellColumnActionsButtonProps?:
		| IconButtonProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => IconButtonProps)
	muiTableHeadCellDragHandleProps?:
		| IconButtonProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => IconButtonProps)
	muiTableHeadCellFilterCheckboxProps?:
		| CheckboxProps
		| (({
				column,
				table,
		  }: {
				column: Table_Column<TData>
				table: TableInstance<TData>
		  }) => CheckboxProps)
	muiTableHeadCellFilterTextFieldProps?:
		| TextFieldProps
		| (({
				table,
				column,
				rangeFilterIndex,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
				rangeFilterIndex?: number
		  }) => TextFieldProps)
	muiTableHeadCellProps?:
		| TableCellProps
		| (({
				table,
				column,
		  }: {
				table: TableInstance<TData>
				column: Table_Column<TData>
		  }) => TableCellProps)
	muiTableHeadProps?:
		| TableHeadProps
		| (({ table }: { table: TableInstance<TData> }) => TableHeadProps)
	muiTableHeadRowProps?:
		| TableRowProps
		| (({
				table,
				headerGroup,
		  }: {
				table: TableInstance<TData>
				headerGroup: Table_HeaderGroup<TData>
		  }) => TableRowProps)
	muiTablePaginationProps?:
		| Partial<TablePaginationProps>
		| (({
				table,
		  }: {
				table: TableInstance<TData>
		  }) => Partial<TablePaginationProps>)
	muiTablePaperProps?:
		| PaperProps
		| (({ table }: { table: TableInstance<TData> }) => PaperProps)
	muiTableProps?:
		| TableProps
		| (({ table }: { table: TableInstance<TData> }) => TableProps)
	muiToolbarAlertBannerChipProps?:
		| ChipProps
		| (({ table }: { table: TableInstance<TData> }) => ChipProps)
	muiToolbarAlertBannerProps?:
		| AlertProps
		| (({ table }: { table: TableInstance<TData> }) => AlertProps)
	muiTopToolbarProps?:
		| ToolbarProps
		| (({ table }: { table: TableInstance<TData> }) => ToolbarProps)
	onDraggingColumnChange?: OnChangeFn<Table_Column<TData> | null>
	onDraggingRowChange?: OnChangeFn<Table_Row<TData> | null>
	onEditingCellChange?: OnChangeFn<Table_Cell<TData> | null>
	onEditingRowCancel?: ({
		row,
		table,
	}: {
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => void
	onEditingRowSave?: ({
		exitEditingMode,
		row,
		table,
		values,
	}: {
		exitEditingMode: () => void
		row: Table_Row<TData>
		table: TableInstance<TData>
		values: Record<LiteralUnion<string & DeepKeys<TData>>, any>
	}) => Promise<void> | void
	onEditingRowChange?: OnChangeFn<Table_Row<TData> | null>
	onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: Table_FilterOption }>
	onGlobalFilterFnChange?: OnChangeFn<Table_FilterOption>
	onHoveredColumnChange?: OnChangeFn<Table_Column<TData> | null>
	onHoveredRowChange?: OnChangeFn<Table_Row<TData> | null>
	onIsFullScreenChange?: OnChangeFn<boolean>
	onShowAlertBannerChange?: OnChangeFn<boolean>
	onShowFiltersChange?: OnChangeFn<boolean>
	onShowGlobalFilterChange?: OnChangeFn<boolean>
	onShowToolbarDropZoneChange?: OnChangeFn<boolean>
	positionActionsColumn?: 'first' | 'last'
	positionExpandColumn?: 'first' | 'last'
	positionGlobalFilter?: 'left' | 'right' | 'none'
	positionPagination?: 'bottom' | 'top' | 'both' | 'none'
	positionToolbarAlertBanner?: 'bottom' | 'top' | 'none'
	positionToolbarDropZone?: 'bottom' | 'top' | 'none' | 'both'
	renderBottomToolbar?:
		| ReactNode
		| (({ table }: { table: TableInstance<TData> }) => ReactNode)
	renderBottomToolbarCustomActions?: ({
		table,
	}: {
		table: TableInstance<TData>
	}) => ReactNode
	renderColumnActionsMenuItems?: ({
		column,
		closeMenu,
		table,
	}: {
		column: Table_Column<TData>
		closeMenu: () => void
		table: TableInstance<TData>
	}) => ReactNode[]
	renderColumnFilterModeMenuItems?: ({
		column,
		internalFilterOptions,
		onSelectFilterMode,
		table,
	}: {
		column: Table_Column<TData>
		internalFilterOptions: Table_InternalFilterOption[]
		onSelectFilterMode: (filterMode: Table_FilterOption) => void
		table: TableInstance<TData>
	}) => ReactNode[]
	renderDetailPanel?: ({
		row,
		table,
	}: {
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode
	renderGlobalFilterModeMenuItems?: ({
		internalFilterOptions,
		onSelectFilterMode,
		table,
	}: {
		internalFilterOptions: Table_InternalFilterOption[]
		onSelectFilterMode: (filterMode: Table_FilterOption) => void
		table: TableInstance<TData>
	}) => ReactNode[]
	renderRowActionMenuItems?: ({
		closeMenu,
		row,
		table,
	}: {
		closeMenu: () => void
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode[]
	renderRowActions?: ({
		cell,
		row,
		table,
	}: {
		cell: Table_Cell<TData>
		row: Table_Row<TData>
		table: TableInstance<TData>
	}) => ReactNode
	renderToolbarInternalActions?: ({
		table,
	}: {
		table: TableInstance<TData>
	}) => ReactNode
	renderTopToolbar?:
		| ReactNode
		| (({ table }: { table: TableInstance<TData> }) => ReactNode)
	renderTopToolbarCustomActions?: ({
		table,
	}: {
		table: TableInstance<TData>
	}) => ReactNode
	rowCount?: number
	rowNumberMode?: 'original' | 'static'
	selectAllMode?: 'all' | 'page'
	state?: Partial<Table_TableState<TData>>
	columnVirtualizerInstanceRef?: MutableRefObject<Virtualizer<
		HTMLDivElement,
		HTMLTableCellElement
	> | null>
	columnVirtualizerProps?:
		| Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>
		| (({
				table,
		  }: {
				table: TableInstance<TData>
		  }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableCellElement>>)
	rowVirtualizerInstanceRef?: MutableRefObject<Virtualizer<
		HTMLDivElement,
		HTMLTableRowElement
	> | null>
	rowVirtualizerProps?:
		| Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>
		| (({
				table,
		  }: {
				table: TableInstance<TData>
		  }) => Partial<VirtualizerOptions<HTMLDivElement, HTMLTableRowElement>>)
	tableInstanceRef?: MutableRefObject<TableInstance<TData> | null>
	uppercaseHeader?: boolean
	/**
	 * @deprecated Use `rowVirtualizerInstanceRef` instead
	 */
	virtualizerInstanceRef?: any
	/**
	 * @deprecated Use `rowVirtualizerProps` instead
	 */
	virtualizerProps?: any
}

const TableComponent = <TData extends Record<string, any> = {}>({
	aggregationFns,
	autoResetExpanded = false,
	columnResizeMode = 'onEnd',
	defaultColumn,
	defaultDisplayColumn,
	editingMode = 'modal',
	enableBottomToolbar = true,
	enableColumnActions = true,
	enableColumnFilters = true,
	enableColumnOrdering = false,
	enableColumnResizing = false,
	enableDensityToggle = true,
	enableExpandAll = true,
	enableFilters = true,
	enableFullScreenToggle = true,
	enableGlobalFilter = true,
	enableGlobalFilterRankedResults = true,
	enableGrouping = false,
	enableHiding = true,
	enableMultiRowSelection = true,
	enableMultiSort = true,
	enablePagination = true,
	enablePinning = false,
	enableRowSelection = false,
	enableSelectAll = true,
	enableSorting = true,
	enableStickyHeader = false,
	enableTableFooter = true,
	enableTableHead = true,
	enableToolbarInternalActions = true,
	enableTopToolbar = true,
	filterFns,
	icons,
	layoutMode = 'semantic',
	localization,
	manualFiltering,
	manualGrouping,
	manualPagination,
	manualSorting,
	positionActionsColumn = 'first',
	positionExpandColumn = 'first',
	positionGlobalFilter = 'right',
	positionPagination = 'bottom',
	positionToolbarAlertBanner = 'top',
	positionToolbarDropZone = 'top',
	rowNumberMode = 'original',
	selectAllMode = 'page',
	sortingFns,
	...rest
}: TableComponentProps<TData>) => {
	const _icons = useMemo(() => ({ ...Default_Icons, ...icons }), [icons])
	const _localization = useMemo(
		() => ({
			...Table_Localization_EN,
			...localization,
		}),
		[localization]
	)
	const _aggregationFns = useMemo(
		() => ({ ...Table_AggregationFns, ...aggregationFns }),
		[]
	)
	const _filterFns = useMemo(() => ({ ...Table_FilterFns, ...filterFns }), [])
	const _sortingFns = useMemo(
		() => ({ ...Table_SortingFns, ...sortingFns }),
		[]
	)
	const _defaultColumn = useMemo<Partial<Table_ColumnDef<TData>>>(
		() => ({ ...Table_DefaultColumn, ...defaultColumn }),
		[defaultColumn]
	)
	const _defaultDisplayColumn = useMemo<Partial<Table_ColumnDef<TData>>>(
		() => ({
			...(Table_DefaultDisplayColumn as unknown as Partial<
				Table_ColumnDef<TData>
			>),
			...defaultDisplayColumn,
		}),
		[defaultDisplayColumn]
	)

	if (rest.enableRowVirtualization || rest.enableColumnVirtualization) {
		layoutMode = 'grid'
	}

	if (rest.enableRowVirtualization) {
		enableStickyHeader = true
	}

	if (enablePagination === false && manualPagination === undefined) {
		manualPagination = true
	}

	if (!rest.data?.length) {
		manualFiltering = true
		manualGrouping = true
		manualPagination = true
		manualSorting = true
	}

	return (
		<TableRoot
			aggregationFns={_aggregationFns}
			autoResetExpanded={autoResetExpanded}
			columnResizeMode={columnResizeMode}
			defaultColumn={_defaultColumn}
			defaultDisplayColumn={_defaultDisplayColumn}
			editingMode={editingMode}
			enableBottomToolbar={enableBottomToolbar}
			enableColumnActions={enableColumnActions}
			enableColumnFilters={enableColumnFilters}
			enableColumnOrdering={enableColumnOrdering}
			enableColumnResizing={enableColumnResizing}
			enableDensityToggle={enableDensityToggle}
			enableExpandAll={enableExpandAll}
			enableFilters={enableFilters}
			enableFullScreenToggle={enableFullScreenToggle}
			enableGlobalFilter={enableGlobalFilter}
			enableGlobalFilterRankedResults={enableGlobalFilterRankedResults}
			enableGrouping={enableGrouping}
			enableHiding={enableHiding}
			enableMultiRowSelection={enableMultiRowSelection}
			enableMultiSort={enableMultiSort}
			enablePagination={enablePagination}
			enablePinning={enablePinning}
			enableRowSelection={enableRowSelection}
			enableSelectAll={enableSelectAll}
			enableSorting={enableSorting}
			enableStickyHeader={enableStickyHeader}
			enableTableFooter={enableTableFooter}
			enableTableHead={enableTableHead}
			enableToolbarInternalActions={enableToolbarInternalActions}
			enableTopToolbar={enableTopToolbar}
			filterFns={_filterFns}
			icons={_icons}
			layoutMode={layoutMode}
			localization={_localization}
			manualFiltering={manualFiltering}
			manualGrouping={manualGrouping}
			manualPagination={manualPagination}
			manualSorting={manualSorting}
			positionActionsColumn={positionActionsColumn}
			positionExpandColumn={positionExpandColumn}
			positionGlobalFilter={positionGlobalFilter}
			positionPagination={positionPagination}
			positionToolbarAlertBanner={positionToolbarAlertBanner}
			positionToolbarDropZone={positionToolbarDropZone}
			rowNumberMode={rowNumberMode}
			selectAllMode={selectAllMode}
			sortingFns={_sortingFns}
			{...rest}
		/>
	)
}

export default TableComponent