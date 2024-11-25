/* eslint-disable no-param-reassign */
import { BoxProps, TooltipProps } from '@mui/material'
import type { AlertProps } from '@mui/material/Alert'
import type { ButtonProps } from '@mui/material/Button'
import type { CheckboxProps } from '@mui/material/Checkbox'
import type { ChipProps } from '@mui/material/Chip'
import type { IconButtonProps } from '@mui/material/IconButton'
import type { LinearProgressProps } from '@mui/material/LinearProgress'
import type { PaperProps } from '@mui/material/Paper'
import type { RadioProps } from '@mui/material/Radio'
import type { SkeletonProps } from '@mui/material/Skeleton'
import { Theme } from '@mui/material/styles'
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
	GroupingState,
	Header,
	HeaderGroup,
	OnChangeFn,
	Row,
	SortingFn,
	Table,
	TableOptions,
	TableState,
} from '@tanstack/react-table'
import type { Virtualizer, VirtualizerOptions } from '@tanstack/react-virtual'
import React, {
	Dispatch,
	FC,
	MouseEventHandler,
	MutableRefObject,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	RefObject,
	SetStateAction,
} from 'react'
import { UseFormProps } from 'react-hook-form'

import { Table_Localization_EN } from './_locales/en'
import { Table_AggregationFns } from './aggregationFns'
import { TableBodyRowProps } from './body/TableBodyRow'
import {
	BulkActionButtonProps,
	EditFloatingActionButtonsProps,
	NotificationBoxProps,
	type RowTooltipProps,
	type SidebarProps,
	TableBulkActionsProps,
} from './components'
import { TableProvider } from './context/TableProvider'
import { TableInstanceWithPresets, TablePropsWithPresets } from './features'
import { Table_FilterFns } from './filterFns'
import { multirowActions } from './head/constants'
import { TableHeadCellFilterLabelProps } from './head/TableHeadCellFilterLabel'
import { TableHeadRowProps } from './head/TableHeadRow'
import {
	HierarchyTreeConfig,
	NewRowState,
	TableFormValues,
	TableInstanceWithCreateNewRow,
	TableInstanceWithForm,
	TableInstanceWithTableHierarchy,
	TablePropsWithCreateNewRow,
	TablePropsWithForm,
} from './hooks'
import { Table_Icons } from './icons'
import { DayPickerInputProps } from './inputs/DayPickerInput'
import { InputProps } from './inputs/Input'
import { SelectProps } from './inputs/Select'
import { Table_SortingFns } from './sortingFns'
import { TableMain } from './table/TableMain'
import {
	TableStatusBarAdornment,
	TableStatusBarWrapperProps,
} from './TableStatusBar'
import { ColumnsMenuProps } from './TableToolbar/components/menus/ColumnsMenu/ColumnsMenu'
import { FiltersMenuProps } from './TableToolbar/components/menus/FiltersMenu/FiltersMenu'
import { GroupingMenuProps } from './TableToolbar/components/menus/GroupingMenu/GroupingMenu'
import type { TableToolbarProps } from './TableToolbar/TableToolbar'
import type { FunctionProps, LiteralUnion } from './types'
import type { GetIsColumnAllGroupsCollapsedProps } from './utils/getIsColumnAllGroupsCollapsed'
import type { GetIsGroupCollapsedProps } from './utils/getIsGroupCollapsed'
import {
	EmptyColumn,
	NonCollapsedItem,
} from './utils/getNonCollapsedColumnItems'
import type { OnGroupCollapsedToggleProps } from './utils/onGroupCollapsedToggle'
import type { OnGroupCollapsedToggleAllProps } from './utils/onGroupCollapseToggleAll'

/**
 * Most of this file is just TypeScript types
 */

export type TableData = Record<string, any>

export type GroupCollapsed = Record<string, boolean | undefined>
export type {
	TableToolbarProps,
	GetIsColumnAllGroupsCollapsedProps,
	GetIsGroupCollapsedProps,
	OnGroupCollapsedToggleProps,
	OnGroupCollapsedToggleAllProps,
}

export type Table_Localization = typeof Table_Localization_EN

export type DraggingMessage = {
	text: string | ReactNode
	type?: string | 'danger' | 'warning'
}

export type Table_RowModel<TData = TableData> = {
	flatRows: Table_Row<TData>[]
	rows: Table_Row<TData>[]
	rowsById: { [key: string]: Table_Row<TData> }
}

export type OpenedDetailPanel<TData = TableData> = {
	cell: Table_Cell<TData>
	row: Table_Row<TData>
}

export type TableInstance<TData = TableData> = Omit<
	Table<TData>,
	| '_getOrderColumnsFn'
	| 'getAllColumns'
	| 'getAllFlatColumns'
	| 'getAllLeafColumns'
	| 'getCenterLeafColumns'
	| 'getCenterVisibleLeafColumns'
	| 'getColumn'
	| 'getCoreRowModel'
	| 'getExpandedRowModel'
	| 'getFlatHeaders'
	| 'getHeaderGroups'
	| 'getLeafHeaders'
	| 'getLeftLeafColumns'
	| 'getLeftVisibleLeafColumns'
	| 'getPaginationRowModel'
	| 'getPreExpandedRowModel'
	| 'getPreFilteredRowModel'
	| 'getPrePaginationRowModel'
	| 'getVisibleLeafColumns'
	| 'getRightLeafColumns'
	| 'getRightVisibleLeafColumns'
	| 'getRowModel'
	| 'getRow'
	| 'getSelectedRowModel'
	| 'getState'
	| 'options'
> &
	TableInstanceWithCreateNewRow<TData> &
	TableInstanceWithTableHierarchy<TData> &
	TableInstanceWithForm<TData> &
	TableInstanceWithPresets & {
		constants: {
			expandableColumn: Table_Column<TData> | null
			disableActionButtons: boolean
			hideInputErrorOnFocus: boolean
			totalRowCount: number
		}
		_getOrderColumnsFn: () => (
			columns: Table_Column<TData>[]
		) => Table_Column<TData>[]
		_getAllColumns: () => Table_Column<TData>[]
		getAllColumns: () => Table_Column<TData>[]
		getAllFlatColumns: () => Table_Column<TData>[]
		getAllLeafColumns: () => Table_Column<TData>[]
		getCenterLeafColumns: () => Table_Column<TData>[]
		getCenterVisibleLeafColumns: () => Table_Column<TData>[]
		getColumn: (columnId: string) => Table_Column<TData>
		getCoreRowModel: () => Table_RowModel<TData>
		getExpandedRowModel: () => Table_RowModel<TData>
		getFlatHeaders: () => Table_Header<TData>[]
		getHeaderGroups: () => Table_HeaderGroup<TData>[]
		getLeafHeaders: () => Table_Header<TData>[]
		getLeftLeafColumns: () => Table_Column<TData>[]
		getLeftVisibleLeafColumns: () => Table_Column<TData>[]
		getNonCollapsedLeafHeaders: () => NonCollapsedItem<Table_Header<TData>>[]
		getNonCollapsedColumns: () => NonCollapsedItem<Table_Column<TData>>[]
		getPaginationRowModel: () => Table_RowModel<TData>
		getPreExpandedRowModel: () => Table_RowModel<TData>
		getPreFilteredRowModel: () => Table_RowModel<TData>
		getPrePaginationRowModel: () => Table_RowModel<TData>
		getRightLeafColumns: () => Table_Column<TData>[]
		getRightVisibleLeafColumns: () => Table_Column<TData>[]
		getRow: (rowId: string) => Table_Row<TData>
		getRowModel: () => Table_RowModel<TData>
		getSelectedRowModel: () => Table_RowModel<TData>
		getState: () => Table_TableState<TData>
		getVisibleLeafColumns: () => Table_Column<TData>[]
		isHierarchyItem?: HierarchyTreeConfig<TData>['isHierarchyItem']
		setSearchData: (data: SearchData<TData>) => void
		setHighlightHeadCellId: (colId: string | null) => void
		options: TableComponentPropsDefined<TData>
		refs: {
			bottomToolbarRef: MutableRefObject<HTMLDivElement>
			bulkActionsRef: MutableRefObject<HTMLDivElement>
			editInputRefs: MutableRefObject<Record<string, HTMLInputElement>>
			expandRowTimeoutRef: MutableRefObject<NodeJS.Timeout>
			filterInputRefs: MutableRefObject<Record<string, HTMLInputElement>>
			headerSearchValueRef: MutableRefObject<string>
			searchInputRef: MutableRefObject<HTMLInputElement>
			rowDragEnterTimeoutRef: MutableRefObject<NodeJS.Timeout>
			tableContainerRef: MutableRefObject<HTMLDivElement>
			tableHeadCellRefs: MutableRefObject<Record<string, HTMLTableCellElement>>
			tablePaperRef: MutableRefObject<HTMLDivElement>
			topToolbarRef: MutableRefObject<HTMLDivElement>
			tableToolbarRef: MutableRefObject<HTMLDivElement>
			/** Signals to pagination to return to specified row id  */
			returnToRow: MutableRefObject<string | undefined>
		}
		resetRowSelection: (defaultState?: boolean) => void
		setColumnFilterFns: Dispatch<
			SetStateAction<{ [key: string]: Table_FilterOption }>
		>
		setDraggingColumn: Dispatch<SetStateAction<Table_Column<TData> | null>>
		setDraggingRows: Dispatch<SetStateAction<Table_Row<TData>[]>>
		setEditingCell: Dispatch<SetStateAction<Table_Cell<TData> | null>>
		setEditingRow: Dispatch<SetStateAction<Table_Row<TData> | null>>
		setCustomColumnEditor: Dispatch<SetStateAction<string | undefined>>
		setGlobalFilterFn: Dispatch<SetStateAction<Table_FilterOption>>
		setGroupCollapsed: Dispatch<SetStateAction<GroupCollapsed>>
		setHoveredColumn: Dispatch<
			SetStateAction<Table_Column<TData> | { id: string } | null>
		>
		setHoveredRow: Dispatch<SetStateAction<HoveredRowState<TData>>>
		setOpenedDetailedPanels: Dispatch<
			SetStateAction<Record<string, OpenedDetailPanel<TData>>>
		>
		setIsEditingTable: Dispatch<SetStateAction<boolean>>
		setIsFullScreen: Dispatch<SetStateAction<boolean>>
		setShowAlertBanner: Dispatch<SetStateAction<boolean>>
		setShowFilters: Dispatch<SetStateAction<boolean>>
		setShowGlobalFilter: Dispatch<SetStateAction<boolean>>
		setShowToolbarDropZone: Dispatch<SetStateAction<boolean>>
		setStickyHorizontalScrollbarHeight: Dispatch<SetStateAction<number>>
		setCollapsedMultirow: Dispatch<
			SetStateAction<{ id: string; colIds: string[] }[]>
		>
		CustomRow?: FC<TableBodyRowProps>
		setStickyHeadersHeight: Dispatch<SetStateAction<number>>
	}

export type SearchData<TData = TableData> = Table_Row<TData>[] | null

export type Table_TableState<TData = TableData> = TableState & {
	columnFilterFns: Record<string, Table_FilterOption>
	draggingColumn: Table_Column<TData> | null
	draggingRows: Table_Row<TData>[]
	editingCell: Table_Cell<TData> | null
	editingRow: Table_Row<TData> | null
	/** Show editor for custom column accessorKey */
	customColumnEditor: string | undefined
	globalFilterFn: Table_FilterOption
	hoveredColumn: Table_Column<TData> | { id: string } | null
	openedDetailedPanels: Record<string, OpenedDetailPanel<TData>> | null
	hoveredRow: HoveredRowState<TData>
	isEditingTable: boolean
	isFullScreen: boolean
	isLoading: boolean
	newRow: NewRowState<TData>
	searchData: SearchData<TData>
	showAlertBanner: boolean
	showColumnFilters: boolean
	showGlobalFilter: boolean
	showProgressBars: boolean
	showSkeletons: boolean
	showToolbarDropZone: boolean
	highlightHeadCellId: string | null
	groupCollapsed: GroupCollapsed
	stickyHorizontalScrollbarHeight: number
	collapsedMultirow: {
		id: string
		colIds: string[]
		originalColIds: string[]
	}[]
	stickyHeadersHeight: number
}

export type SelectOption = {
	label: string
	value: any
}

export type MultirowColumnActionClickHandler<TData = TableData> = (props: {
	multirowColumn: MultirowColumn
	table: TableInstance<TData>
	columns: Table_Column<TData>[]
	event: React.MouseEvent
}) => void

export type MultirowColumnActionClickFns<TData = TableData> =
	| MultirowColumnActionClickHandler<TData>
	| keyof typeof multirowActions

export type MultirowColumnAction = {
	text: string
	onClick: MultirowColumnActionClickFns
}

export type MultirowColumn = {
	id: string
	text: string
	shorthandText?: string
	renderText?: () => ReactNode
	colSpan: number
	isGrouped: boolean
	isPinned: false | 'left' | 'right'
	leftPinnedPosition?: number
	rightPinnedPosition?: number
	multirowColumnActions: MultirowColumnAction[] | null
	colIds: string[]
	depth: number
	originalColIds: string[]
}

export type MultirowHeaderColumn = {
	text: string
	shorthandText?: string
	/** render node manually instead of using default `shorthandText` or `text` */
	renderText?: () => ReactNode
	columnIds: string[]
	columnActions?: MultirowColumnAction[]
	collapsed?: boolean
}

export type MultirowHeaderRow = {
	additionalRowContent?: (
		table: TableInstance,
		cellsPropsArray: MultirowColumn[]
	) => React.ReactNode
	pin?: boolean
	depth: number
	columns: MultirowHeaderColumn[]
}

export type MultirowHeader = MultirowHeaderRow[]

export type MultirowColumnsGroup<TData = TableData> = {
	columns: Table_Column<TData>[]
	text: string
	depth?: number
	isFinalGroup?: boolean
	subGroups?: MultirowColumnsGroup[]
}

export interface SimpleEventProps<T = string> {
	target: { value: T }
}
export class SimpleEvent<T = string> {
	target: SimpleEventProps<T>['target']

	// trick for RF
	stopPropagation = true

	preventDefault = true

	constructor(value: T) {
		this.target = { value }
	}
}

export type TableCellDataProps<TData = TableData> = {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
}
export type TableFunctionalProp<Prop, TData = {}> = FunctionProps<
	Partial<Prop>,
	{ table: TableInstance<TData> }
>
export type TableRowFunctionalProp<Prop, TData = {}> = FunctionProps<
	Partial<Prop>,
	{ table: TableInstance<TData>; row: Table_Row<TData> }
>
export type TableColumnFunctionalProp<Prop, TData = {}> = FunctionProps<
	Partial<Prop>,
	{ table: TableInstance<TData>; column: Table_Column<TData> }
>
export type TableCellFunctionalProp<Prop, TData = {}> = FunctionProps<
	Partial<Prop>,
	TableCellDataProps<TData>
>

export type TableColumnEditProps<TData = TableData> = {
	editVariant?:
		| 'text'
		| 'number'
		| 'percent'
		| 'formula'
		| 'select'
		| 'multi-select'
		| 'date'
		| 'date-range'
	required?: boolean
	editSelectOptions?: (string | SelectOption)[]
	muiEditDayPickerInputProps?: TableCellFunctionalProp<
		DayPickerInputProps,
		TData
	>
	muiEditInputProps?: TableCellFunctionalProp<InputProps, TData>
	muiEditSelectProps?: TableCellFunctionalProp<SelectProps, TData>
	Edit?: FC<TableCellDataProps<TData>> | ReactNode | null
	getEditValue?: (rowOriginal: TData) => any
}

export type EnableEditingArgs<TData = TableData> = {
	table: TableInstance<TData>
	row: Table_Row<TData>
}

export type EnableEditingOption<TData = TableData> =
	| boolean
	| ((args: EnableEditingArgs<TData>) => boolean)

export type SortingType = 'textual' | 'numeric' | 'custom'
export type GetSortingNode<TData = {}, Args = unknown> = (
	args: {
		table: TableInstance<TData>
		column: Table_Column<TData>
		isAsc: boolean
	} & Args
) => ReactNode | string | null

export type TableSortingConfigs<TData = TableData> = {
	getSortingIcon?: GetSortingNode<TData, { sortingIconProps?: any }>
	getSortingIconConstructor?: GetSortingNode<TData>
	getSortingText?: GetSortingNode<TData, { withSortWord?: boolean }>
}

export type ColumnSortingConfigs<TData = TableData> =
	TableSortingConfigs<TData> & {
		sortingType?: SortingType
		sortingFn?: Table_SortingFn<TData>
		/** This key has a higher precedence over accessor(Key/Fn) in sorting.
		 * The key can contain paths, ex: "onbect.prop1.anotherProp" */
		sortingKey?: string
	}

export type GroupingKey<TData = TableData> =
	| string
	| (<T = any>(args: {
			row: Table_Row<TData>
			table: TableInstance<TData>
			columnId: string
	  }) => T)

export type Table_ColumnDef<TData = TableData> = Omit<
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
> &
	TableColumnEditProps<TData> &
	ColumnSortingConfigs<TData> & {
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
			children,
		}: {
			cell: Table_Cell<TData>
			column: Table_Column<TData>
			row: Table_Row<TData>
			table: TableInstance<TData>
			children?: ReactNode
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
		}: PropsWithChildren<{
			cell: Table_Cell<TData>
			column: Table_Column<TData>
			row: Table_Row<TData>
			table: TableInstance<TData>
		}>) => ReactNode
		GroupedCellCollapsedContent?: ({
			cell,
			row,
			table,
		}: PropsWithChildren<{
			cell: Table_Cell<TData>
			row: Table_Row<TData>
			table: TableInstance<TData>
		}>) => ReactNode
		Header?:
			| ReactNode
			| (({
					column,
					header,
					table,
					parentRow,
			  }: {
					column: Table_Column<TData>
					header: Table_Header<TData>
					table: TableInstance<TData>
					parentRow?: Table_Row<TData>
			  }) => ReactNode)
		FilterField?: ({
			column,
			table,
			onChange,
			value,
			autoFocus,
		}: {
			column: Table_Column<TData>
			table: TableInstance<TData>
			onChange: (value: unknown) => void
			value: unknown
			autoFocus?: boolean
		}) => ReactElement
		FilterChipField?: ({
			column,
			table,
			onChange,
			value,
		}: {
			column: Table_Column<TData>
			table: TableInstance<TData>
			onChange: (value: unknown) => void
			value: unknown
		}) => ReactElement
		ColumnActionsFilterField?: ({
			column,
			table,
			value,
			onChange,
		}: {
			column: Table_Column<TData>
			table: TableInstance<TData>
			value: unknown
			onChange: (value: unknown) => void
		}) => ReactElement
		headerEndAdornment?: ReactNode
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
		aggregationFn?:
			| Table_AggregationFn<TData>
			| Array<Table_AggregationFn<TData>>
		getTableCellSx?: (options: {
			cell: Table_Cell<TData>
			column: Table_Column<TData>
			isCurrentCellClicked?: boolean
			isCurrentRowDetailOpened?: boolean
			isEditing?: boolean
			isEditValueChanged?: boolean
			row: Table_Row<TData>
			table: TableInstance<TData>
		}) => TableCellProps['sx']
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
		/**
		 * @ignore Internal use only! (for now)
		 * Custom Column Flag/Options
		 * Specify if this column can be customized by the user.
		 * `setColumns` table option must be defined to be operational.
		 * In the future it could hold an object of customization props:
		 * for example: {canBeDeleted:true, allowedTypes: ['text','numeric']...}
		 */
		enableCustomization?: true
		columns?: Table_ColumnDef<TData>[]
		formatCellValue?: (value: unknown) => string
		emptyHeader?: boolean
		errorText?: string
		enableColumnActions?: boolean
		enableColumnDragging?: boolean
		enableColumnFilterModes?: boolean
		enableColumnOrdering?: boolean
		enableDividerLeft?: boolean
		enableDividerRight?: boolean
		enableEditing?: EnableEditingOption<TData>
		filterFn?: Table_FilterFn<TData>
		/** This key has a higher precedence over accessor(Key/Fn) in filtering.
		 * The key can contain paths, ex: "onbect.prop1.anotherProp" */
		filteringKey?: string
		filterSelectOptions?: (string | SelectOption)[]
		filterChipText?: (
			column: Table_Column<TData>,
			table: TableInstance<TData>
		) => string
		/** This key has a higher precedence over accessor(Key/Fn) in grouping.
		 * The key can contain:
		 * - paths, ex: "onbect.prop1.anotherProp"
		 * - function to extract the value used for grouping */
		groupingKey?: GroupingKey<TData>
		/**
		 * footer must be a string. If you want custom JSX to render the footer, you can also specify a `Footer` option. (Capital F)
		 */
		footer?: string
		/**
		 * header must be a string. If you want custom JSX to render the header, you can also specify a `Header` option. (Capital H)
		 */
		header: string
		/**
		 * shortHeader must be a string. This prop is used to display short header name for table columns
		 */
		shortHeader?: string
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
		muiTableBodyCellWrapperProps?:
			| BoxProps
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
			  }) => BoxProps)
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
		muiTableHeadCellWrapperProps?:
			| BoxProps
			| (({
					table,
					column,
			  }: {
					table: TableInstance<TData>
					column: Table_Column<TData>
			  }) => BoxProps)
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
		subtitle?: string
		validator?: ({
			value,
			table,
			row,
			cell,
			values,
		}: {
			value: any
			table: TableInstance<TData>
			row: Table_Row<TData>
			cell: Table_Cell<TData>
			values: Record<string, any>
		}) => boolean | string
		cellGroupedPlaceholderText?: string
		cellPlaceholderText?: string
		lineClamp?: number | boolean
		/**
		 * Specifies that column is not diplayed in table and sidebars, except filtering
		 */
		notDisplayed?: boolean

		// TODO In the next major release:

		// todo split editVariant between dataTypes

		// todo split filterVariant between dataTypes
		filterVariant?: 'text' | 'select' | 'multi-select' | 'range' | 'checkbox'

		// todo move to NumericColumn
		minValue?: number
		maxValue?: number
	} & (
		| NumericColumn
		| PercentColumn
		| {
				dataType?:
					| 'textual'
					| 'date'
					| 'formula'
					| 'single-select'
					| 'multi-select'
					| 'custom'
		  }
	)

export interface NumericColumn {
	dataType: 'numeric'
	/* // todo
	minValue?: number
	maxValue?: number
	editVariant?: 'number'
	*/
	/** Number of digits after decimal point */
	decimalPlaces?: number
	/**
	 * @default "123456789.12345"
	 * SPACE1000 - "123 456 789.12345"
	 */
	displayFormat?: 'SPACE_1000'
}

export interface PercentColumn
	extends Pick<
		NumericColumn,
		'decimalPlaces' // todo | 'minValue' | 'maxValue'
	> {
	dataType: 'percent'
	/**
	 * @default "123456.123%"
	 * PROGRESS_BAR - 123% <ProgressBar>
	 */
	displayFormat?: 'PROGRESS_BAR'
}

export type Table_DefinedColumnDef<TData = TableData> = Omit<
	Table_ColumnDef<TData>,
	'id' | 'defaultDisplayColumn'
> & {
	defaultDisplayColumn: Partial<Table_ColumnDef<TData>>
	id: string
	displayDataKey: string
	_filterFn: Table_FilterOption
	cellAction?: string | (({ row, table }) => void)
	cellActionIcon?: any
	filterTypeLabel?: string
}

export type Table_Column<TData = TableData> = Omit<
	Column<TData, unknown>,
	'header' | 'footer' | 'columns' | 'columnDef' | 'filterFn' | 'getLeafColumns'
> & {
	columnDef: Table_DefinedColumnDef<TData>
	columns?: Table_Column<TData>[]
	filterFn?: Table_FilterFn<TData>
	footer: string
	getLeafColumns: () => Table_Column<TData>[]
	header: string
}

export type Table_ColumnOrEmpty<TData = TableData> =
	| (Table_Column<TData> & { empty?: false })
	| EmptyColumn

export type Table_Header<TData = TableData> = Omit<
	Header<TData, unknown>,
	'column'
> & {
	column: Table_Column<TData>
}

export type Table_HeaderOrEmpty<TData = TableData> =
	| (Table_Header<TData> & { empty?: false })
	| EmptyColumn

export type Table_HeaderGroup<TData = TableData> = Omit<
	HeaderGroup<TData>,
	'headers'
> & {
	headers: Table_Header<TData>[]
	getNonCollapsedHeaders: () => NonCollapsedItem<Table_Header<TData>>[]
}

export type Table_HeaderGroupOrEmpty<TData = TableData> = Omit<
	Table_HeaderGroup<TData>,
	'headers'
> & {
	headers: Table_HeaderOrEmpty<TData>[]
}

export type Table_Row<TData = TableData> = Omit<
	Row<TData>,
	| '_getAllVisibleCells'
	| 'getVisibleCells'
	| 'getAllCells'
	| 'subRows'
	| '_valuesCache'
	| 'getParent'
> & {
	_getAllVisibleCells: () => Table_Cell<TData>[]
	getAllCells: () => Table_Cell<TData>[]
	getVisibleCells: () => Table_Cell<TData>[]
	getNonCollapsedCells: () => NonCollapsedItem<Table_Cell<TData>>[]
	subRows?: Table_Row<TData>[]
	_valuesCache: Record<LiteralUnion<string & DeepKeys<TData>>, any>
	groupIds?: Record<string, string>
	groupRows?: Record<string, Table_Row<TData>>
	collapsedColumnIndex?: number
	getParent(): Table_Row<TData> | undefined
	isMock?: boolean
}

export type Table_Cell<TData = TableData> = Omit<
	Cell<TData, unknown>,
	'column' | 'row'
> & {
	column: Table_Column<TData>
	row: Table_Row<TData>
}

export type Table_CellOrEmpty<TData = TableData> =
	| (Table_Cell<TData> & { empty?: false })
	| EmptyColumn

export type Table_AggregationOption = string & keyof typeof Table_AggregationFns

export type Table_AggregationFn<TData = TableData> =
	| AggregationFn<TData>
	| Table_AggregationOption

export type Table_SortingOption = LiteralUnion<
	string & keyof typeof Table_SortingFns
>

export type Table_SortingFn<TData = TableData> =
	| SortingFn<TData>
	| Table_SortingOption

export type Table_FilterOption = LiteralUnion<
	string & keyof typeof Table_FilterFns
>

export type Table_FilterFn<TData = TableData> =
	| FilterFn<TData>
	| Table_FilterOption

export type Table_ColumnActionsFiltersMenuProps<TData = TableData> = {
	table: TableInstance<TData>
	column: Table_Column<TData>
	selectedFilters: string[]
	filterOptions: SelectOption[]
	onCheckFilter: (value: string) => void
}

export type Table_InternalFilterOption = {
	option: string
	symbol: string
	label: string
	divider: boolean
}

export type Table_DisplayColumnIds =
	| 'table-row-actions'
	| 'table-row-expand'
	| 'table-util-column'

export type Table_Actions<TData = TableData> = BulkActionButtonProps<TData>

export enum ExpandByClick {
	Cell = 'Cell',
	CellAction = 'CellAction',
}

export type HoveredRowState<TData = TableData> = {
	row: Table_Row<TData>
	asChild?: boolean
	position: 'bottom' | 'top'
	rowRef: MutableRefObject<HTMLTableRowElement | null>
} | null

export type NativeEventArgs = {
	el: any
	type: 'click' | 'keypress' | 'hover' | 'dragstart' | 'dragend'
	event?: any
	value?: any
}

export type ValidateHoveredRowProp<TData = TableData> = (
	row: NonNullable<HoveredRowState<TData>>,
	table: TableInstance<TData>
) => boolean | NotificationBoxProps
export type GetRowDragValuesChangeMessageProp<TData = TableData> = (args: {
	table: TableInstance<TData>
	hoveredRow: HoveredRowState<TData>
	draggingRows: Table_Row<TData>[]
	current: { label: string; value: string }[]
}) => { label: string; value: string }[]
export type MuiTableBodyRowDragHandleFnProps<TData = TableData> = ({
	table,
	row,
}: {
	table: TableInstance<TData>
	row: Table_Row<TData>
}) => IconButtonProps

type RenderEditMenuItem<TData = TableData> = (args: {
	table: TableInstance<TData>
	row: Table_Row<TData>
	handleEdit: MouseEventHandler
}) => ReactNode

export type ValueTransformer<In, Out = In> = (value: In) => Out

export interface TestIds {
	headerRow?: string
	columnMenu?: string
	columnMenuFreeze?: string
	columnMenuFreezeMenu?: string
	columnMenuFreezingClear?: string
	columnMenuItemFreezeColumnLeft?: string
	columnMenuItemFreezeColumnRight?: string
	columnMenuItemFreezeUpToThisColumnLeft?: string
	columnMenuItemFreezeUpToThisColumnRight?: string
	columnMenuSort?: string
	columnMenuSortMenu?: string
	columnMenuSortAsc?: string
	columnMenuSortDesc?: string
	columnMenuSortMenuClear?: string
	columnMenuFilter?: string
	columnMenuGroup?: string
	columnMenuPin?: string
	columnMenuHide?: string
	columnMenuInsert?: string
	columnMenuInsertLeft?: string
	columnMenuInsertRight?: string
	columnMenuInsertText?: string
	columnMenuInsertNumeric?: string
	columnMenuEdit?: string
	columnMenuDelete?: string
	rowActionMenu?: string
	sidebarColumns?: string
	sidebarColumnsHideAll?: string
	sidebarColumnsShowAll?: string
	sidebarSorting?: string
	sidebarSortingRemoveAll?: string
	sidebarFilters?: string
	sidebarFiltersAddFilter?: string
	sidebarFiltersRemoveAll?: string
	sidebarGrouping?: string
	sidebarGroupingRemoveAll?: string
	bulkActions?: string
}

export interface E2ELabelsOption {
	/** @default false */
	enabled?: boolean
	/** `data-testid` attributes */
	ids?: TestIds
	/** @default "table_" */
	idPrefix?: string
}

export type SetColumns<TData = TableData> = (
	columns: Table_ColumnDef<TData>[],
	current: Table_ColumnDef<TData>,
	action: 'INSERT' | 'UPDATE' | 'DELETE'
) => void

/**
 * `columns` and `data` props are the only required props, but there are over 150 other optional props.
 *
 * See more info on creating columns and data on the official docs site:
 * @link https://www.material-react-table.com/docs/getting-started/usage
 *
 * See the full props list on the official docs site:
 * @link https://www.material-react-table.com/docs/api/props
 */
export type TableComponentProps<TData = TableData> = Omit<
	Partial<TableOptions<TData>>,
	| 'columns'
	| 'data'
	| 'defaultColumn'
	| 'enableRowSelection'
	| 'expandRowsFn'
	| 'getRowId'
	| 'globalFilterFn'
	| 'initialState'
	| 'state'
> &
	TablePropsWithCreateNewRow<TData> &
	TableSortingConfigs<TData> &
	TablePropsWithForm<TData> &
	TablePropsWithPresets<TData> & {
		columnFilterModeOptions?: Array<
			LiteralUnion<string & Table_FilterOption>
		> | null
		/**
		 * The columns to display in the table. `accessorKey`s or `accessorFn`s must match keys in the `data` prop.
		 */
		columns: Table_ColumnDef<TData>[]
		/**
		 * Enable Editing of Custom Columns (insert, update, delete)
		 * See columns with `enableCustomization` option set
		 */
		setColumns?: SetColumns<TData>
		/**
		 * Custom Columns Settings
		 */
		customColumns?: {
			validate?: {
				header?: (value: string) => boolean | string
				shortHeader?: (value: string) => boolean | string
				subtitle?: (value: string) => boolean | string
			}
		}
		/**
		 * The columns to be suggested in sidebars.
		 * Contains list of column accessorKey.
		 */
		suggestedColumns?: {
			filtering?: readonly string[]
			grouping?: readonly string[]
			sorting?: readonly string[]
		}
		/**
		 * Pass your data as an array of objects. Objects can theoretically be any shape, but it's best to keep them consistent.
		 */
		data: TData[]
		bulkActions?: FunctionProps<
			Table_Actions<TData>[],
			{ table: TableInstance<TData> }
		>
		bulkActionProps?: TableBulkActionsProps<TData>
		cellGroupedPlaceholderText?: string
		cellPlaceholderText?: string
		/**
		 * Instead of specifying a bunch of the same options for each column, you can just change an option in the `defaultColumn` prop to change a default option for all columns.
		 */
		defaultColumn?: Partial<Table_ColumnDef<TData>>
		/**
		 * Change the default options for display columns.
		 */
		defaultDisplayColumn?: Partial<Table_ColumnDef<TData>>
		detailPanelBorderColor?: string
		displayColumnDefOptions?: Partial<{
			[key in Table_DisplayColumnIds]: Partial<Table_ColumnDef>
		}>
		editingMode?: 'table' | 'modal' | 'row' | 'cell'
		enableAggregationRow?: boolean
		enableBulkActions?: boolean
		enableBulkActionsCaptions?: boolean | 'auto'
		enableBulkActionsSelect?: boolean
		enableBottomToolbar?: boolean
		enableColumnActions?: boolean
		enableColumnDragging?: boolean
		enableColumnFilterModes?: boolean
		enableColumnOrdering?: boolean
		enableColumnVirtualization?: boolean
		enableDensityToggle?: boolean
		enableDetailedPanel?: boolean
		enableDragScrolling?: boolean | 'horizontal' | 'vertical'
		enableEditing?: EnableEditingOption<TData>
		enableEditingHighlighting?: boolean
		enableExpandAll?: boolean
		enableFlatSearch?: boolean
		enableGroupCount?: boolean
		enableGroupCollapsing?: boolean
		enableGroupSelection?: boolean
		/** @default false */
		enableHeaderGroupRowSpan?: boolean
		expandByClick?: ExpandByClick
		expandPaddingSize?: number
		expandableColumnButtonPosition?: 'left' | 'right'
		notClickableCells?: string[]
		tablePlugSlot?: React.ReactNode
		noResultsFoundSlot?: React.ReactNode
		noRecordsToDisplaySlot?: React.ReactNode
		isTablePlugSlotActive?: boolean
		validateHoveredRow?: ValidateHoveredRowProp<TData>
		getRowDragValuesChangeMessage?: GetRowDragValuesChangeMessageProp<TData>
		mockRowStyles?: Record<string, unknown>
		cellStyleRules?: Record<
			string,
			{
				executeStyleCondition: (params: {
					cell: Table_Cell
					row: Table_Row
					column: Table_Column
					table: TData
					isCurrentCellClicked?: boolean
					isCurrentRowDetailOpened?: boolean
					isEditing?: boolean
					isEditValueChanged?: boolean
				}) => object | undefined
			}
		>
		enableFullScreenToggle?: boolean
		enableGlobalFilterModes?: boolean
		enableGlobalFilterRankedResults?: boolean
		enableMultirowExpandCollapse?: boolean
		enablePagination?: boolean | 'pages' | 'scroll'
		enableRowActions?: boolean
		enableRowDragging?: boolean | ((row: Table_Row<TData>) => boolean)
		enableRowNumbers?: boolean
		enableRowSelection?: boolean | ((row: Table_Row<TData>) => boolean)
		enableRowVirtualization?: boolean
		enableSelectAll?: boolean
		enableStatusBar?: boolean
		enableStickyScrollbars?: {
			horizontal?: boolean
			relativeParentRef?: RefObject<HTMLElement | null | undefined>
		}
		enableStickyFooter?: boolean
		enableStickyHeader?: boolean
		enableSummaryRow?: boolean
		enableTableFooter?: boolean
		enableTableHead?: boolean
		enableToolbarInternalActions?: boolean
		enableTopToolbar?: boolean
		expandRowsFn?: (dataRow: TData) => TData[]
		floatingActionButtonProps?: TableRowFunctionalProp<
			Partial<EditFloatingActionButtonsProps<TData>>,
			TData
		>
		formOptions?: Partial<UseFormProps<TableFormValues>>
		getExpandableColumn?:
			| string
			| ((
					columns: Table_Column<TData>[],
					table: TableInstance<TData>
			  ) => Table_Column<TData> | null)
		getGroupRowCount?: (props: {
			groupId?: string
			groupRow?: Table_Row<TData>
			table: TableInstance<TData>
		}) => ReactNode
		getRowId?: (
			originalRow: TData,
			index: number,
			parentRow?: Table_Row<TData> | undefined
		) => string
		/**
		 * @deprecated Use `hierarchyTreeConfig.isHierarchyRow` instead
		 */
		getIsUnitTreeItem?: (rowOriginal: TData) => boolean
		getIsColumnAllGroupsCollapsed?: (
			props: GetIsColumnAllGroupsCollapsedProps<TData>
		) => boolean
		getIsGroupCollapsed?: (props: GetIsGroupCollapsedProps<TData>) => boolean
		getPinnedColumnPosition?: (
			column: Table_Column<TData>,
			table: TableInstance<TData>
		) => Record<string, unknown> | undefined
		globalFilterFn?: Table_FilterOption
		globalFilterModeOptions?: Table_FilterOption[] | null
		groupBorder?: string | { left: string; top: string }
		handleRowsDrop?: ({
			hoveredRow,
			draggingRows,
			grouping,
			table,
		}: {
			hoveredRow: HoveredRowState<TData>
			draggingRows: Table_Row<TData>[]
			grouping: GroupingState
			table: TableInstance<TData>
		}) => Promise<void> | void
		hideEditRowAction?: boolean
		hideExpandColumn?: boolean
		hideSummaryRowInEmptyTable?: boolean
		hideRowSelectionColumn?: boolean
		hideTableHead?: boolean
		hierarchyTreeConfig?: HierarchyTreeConfig<TData>
		icons?: Partial<Table_Icons>
		infiniteScrollIntersectorStyles?: Record<string, any>
		initialState?: Partial<Table_TableState<TData>>
		innerTable?: boolean
		innerTableTitle?: string
		isRowGroupable?: ({
			row,
			table,
		}: {
			row: Table_Row<TData>
			table: TableInstance<TData>
		}) => boolean
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
		muiBottomToolbarProps?: TableFunctionalProp<ToolbarProps, TData>
		muiColumnsMenuProps?: TableFunctionalProp<ColumnsMenuProps<TData>, TData>
		muiGroupingMenuProps?: TableFunctionalProp<GroupingMenuProps<TData>, TData>
		muiFiltersMenuProps?: TableFunctionalProp<FiltersMenuProps<TData>, TData>
		muiSortingMenuProps?: TableFunctionalProp<FiltersMenuProps<TData>, TData>
		muiEditInputProps?: TableCellFunctionalProp<InputProps, TData>
		muiEditSelectProps?: TableCellFunctionalProp<SelectProps, TData>
		muiEditDayPickerInputProps?: TableCellFunctionalProp<
			DayPickerInputProps,
			TData
		>
		muiExpandAllButtonProps?: TableFunctionalProp<IconButtonProps, TData>
		muiExpandButtonProps?: TableRowFunctionalProp<IconButtonProps, TData>
		muiLinearProgressProps?: FunctionProps<
			LinearProgressProps,
			{
				isTopToolbar: boolean
				table: TableInstance<TData>
			}
		>
		muiSearchTextFieldProps?: TableFunctionalProp<TextFieldProps, TData>
		muiSelectAllCheckboxProps?: TableFunctionalProp<CheckboxProps, TData>
		muiSelectCheckboxProps?: TableRowFunctionalProp<
			CheckboxProps | RadioProps,
			TData
		>
		muiSidebarProps?: TableFunctionalProp<SidebarProps, TData>
		muiTableBodyCellCopyButtonProps?: TableCellFunctionalProp<
			ButtonProps,
			TData
		>
		muiTableBodyCellProps?: TableCellFunctionalProp<TableCellProps, TData>
		muiTableBodyCellWrapperProps?: TableCellFunctionalProp<BoxProps, TData>
		muiTableBodyCellSkeletonProps?: TableCellFunctionalProp<
			SkeletonProps,
			TData
		>
		muiTableBodyProps?: TableFunctionalProp<TableBodyProps, TData>
		muiTableBodyRowDragHandleProps?: TableRowFunctionalProp<
			IconButtonProps,
			TData
		>
		muiTableBodyRowProps?: FunctionProps<
			TableRowProps,
			{
				isDetailPanel?: boolean
				row: Table_Row<TData>
				table: TableInstance<TData>
			}
		>
		muiTableContainerProps?: TableFunctionalProp<TableContainerProps, TData>
		muiTableDetailPanelProps?: TableRowFunctionalProp<TableCellProps, TData>
		muiTableFooterCellProps?: TableColumnFunctionalProp<TableCellProps, TData>
		muiTableFooterProps?: TableFunctionalProp<TableFooterProps, TData>
		muiTableFooterRowProps?: FunctionProps<
			TableRowProps,
			{
				table: TableInstance<TData>
				footerGroup: Table_HeaderGroup<TData>
			}
		>
		muiTableHeadCellColumnActionsButtonProps?: TableColumnFunctionalProp<
			IconButtonProps,
			TData
		>
		muiTableHeadCellDragHandleProps?: TableColumnFunctionalProp<
			IconButtonProps,
			TData
		>
		muiTableHeadCellFilterCheckboxProps?: TableColumnFunctionalProp<
			CheckboxProps,
			TData
		>
		muiTableHeadCellFilterLabelProps?: TableColumnFunctionalProp<
			TableHeadCellFilterLabelProps<TData>,
			TData
		>
		muiTableHeadCellProps?: TableColumnFunctionalProp<TableCellProps, TData>
		muiTableHeadCellWrapperProps?: TableColumnFunctionalProp<BoxProps, TData>
		muiTableHeadProps?: TableFunctionalProp<TableHeadProps, TData>
		muiTableHeadRowProps?: FunctionProps<
			TableRowProps,
			{
				table: TableInstance<TData>
				headerGroup: Table_HeaderGroup<TData>
			}
		>
		muiTablePaginationProps?: TableFunctionalProp<TablePaginationProps, TData>
		muiTablePaperProps?: TableFunctionalProp<PaperProps, TData>
		muiTableProps?: TableFunctionalProp<TableProps, TData>
		muiTableStatusBarWrapperProps?: TableFunctionalProp<
			TableStatusBarWrapperProps,
			TData
		>
		muiTableStatusClearAllButtonProps?: TableFunctionalProp<ButtonProps, TData>
		muiToolbarAlertBannerChipProps?: TableFunctionalProp<ChipProps, TData>
		muiToolbarAlertBannerProps?: TableFunctionalProp<AlertProps, TData>
		muiTopToolbarProps?: TableFunctionalProp<ToolbarProps, TData>
		multirowHeader?: MultirowHeader
		multirowColumnsDisplayDepth?: number
		onDraggingColumnChange?: OnChangeFn<Table_Column<TData> | null>
		onDraggingRowsChange?: OnChangeFn<Table_Row<TData>[]>
		onEditingCellChange?: OnChangeFn<Table_Cell<TData> | null>
		onEditingRowChange?: OnChangeFn<Table_Row<TData> | null>
		onColumnFilterFnsChange?: OnChangeFn<{ [key: string]: Table_FilterOption }>
		onGlobalFilterFnChange?: OnChangeFn<Table_FilterOption>
		onHoveredColumnChange?: OnChangeFn<Table_Column<TData> | null>
		onHoveredRowChange?: OnChangeFn<HoveredRowState<TData> | null>
		onGroupCollapsedChange?: OnChangeFn<GroupCollapsed>
		onGroupCollapsedToggle?: (props: OnGroupCollapsedToggleProps<TData>) => void
		onGroupCollapsedToggleAll?: (
			props: OnGroupCollapsedToggleAllProps<TData>
		) => void
		onIsEditingTableChange?: OnChangeFn<boolean>
		onIsFullScreenChange?: OnChangeFn<boolean>
		onShowAlertBannerChange?: OnChangeFn<boolean>
		onShowFiltersChange?: OnChangeFn<boolean>
		onShowGlobalFilterChange?: OnChangeFn<boolean>
		onShowToolbarDropZoneChange?: OnChangeFn<boolean>
		onNativeEvent?: ({
			el,
			type,
			event,
			value,
		}: {
			el: any
			type: 'click' | 'keypress' | 'hover' | 'dragstart' | 'dragend'
			event?: any
			value?: any
		}) => void
		onInfiniteScrollLoad?: ({ table }: { table: TableInstance<TData> }) => void
		organizeColumnsMenu?(
			columns: Table_Column<TData>[],
			table: TableInstance<TData>
		): Table_Column<TData>[]
		organizeGroupingMenu?:
			| readonly string[]
			| ValueTransformer<readonly Table_Column<TData>[]>
		organizeSortingMenu?:
			| readonly string[]
			| ValueTransformer<readonly Table_Column<TData>[]>
		organizeFilteringMenu?:
			| readonly string[]
			| ValueTransformer<readonly Table_Column<TData>[]>
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
		renderEditMenuItem?: RenderEditMenuItem<TData>
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
		renderRowActionMenuItemsOnOpen?: boolean
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
			originalChildren,
		}: {
			table: TableInstance<TData>
			originalChildren?: ReactNode
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
		rowTooltipProps?: TooltipProps | (({ row, table }) => TooltipProps)
		CustomRowTooltip?: FC<RowTooltipProps<TData>>
		rowNumberMode?: 'original' | 'static'
		selectAllMode?: 'all' | 'page'
		setSubRows?: (row: TData, subRows: TData[]) => TData
		showBottomProggressBar?: boolean
		showRowInTable?(row: Table_Row<TData>, table: TableInstance<TData>): void
		state?: Partial<Table_TableState<TData>>
		summaryRowCell?: (args: {
			table: TableInstance<TData>
			column: Table_Column<TData>
			defaultStyles: Record<string, any>
		}) => React.ReactNode
		statusBarAdornment?: TableStatusBarAdornment<TData>
		ColumnActionsFiltersMenu?: FC<Table_ColumnActionsFiltersMenuProps<TData>>
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
			HTMLDivElement | Window,
			HTMLTableRowElement
		> | null>
		rowVirtualizerProps?:
			| Partial<
					VirtualizerOptions<HTMLDivElement | Window, HTMLTableRowElement>
			  >
			| (({
					table,
			  }: {
					table: TableInstance<TData>
			  }) => Partial<
					VirtualizerOptions<HTMLDivElement | Window, HTMLTableRowElement>
			  >)
		windowVirtualizer?: boolean
		tableInstanceRef?: MutableRefObject<TableInstance<TData> | null>
		toolbarProps?: Partial<TableToolbarProps<TData>>
		uppercaseHeader?: boolean
		/**
		 * @deprecated Use `rowVirtualizerInstanceRef` instead
		 */
		virtualizerInstanceRef?: any
		/**
		 * @deprecated Use `rowVirtualizerProps` instead
		 */
		virtualizerProps?: any
		detailedRowBackgroundColor?: string
		CustomRow?: FC<TableBodyRowProps>
		theme?: Theme
		e2eLabels?: E2ELabelsOption
		defaultCollapsedMultiRow?: { id: string; colIds: string[] }[]
		tableHeadRowProps?: FunctionProps<
			TableHeadRowProps,
			{
				table: TableInstance<TData>
				headerGroup: Table_HeaderGroup<TData>
			}
		>
		disableFormProvider?: boolean
	}

export type TableComponentPropsDefined<TData = TableData> =
	TableComponentProps<TData> & {
		originalColumns: Table_ColumnDef<TData>[]
		icons: Table_Icons
		localization: Table_Localization
		theme: Theme
	}
const TableComponent = (props: TableComponentProps) => {
	return (
		<TableProvider {...props}>
			<TableMain />
		</TableProvider>
	)
}

export default TableComponent
