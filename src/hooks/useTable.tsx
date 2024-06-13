import {
	ColumnFiltersState,
	ColumnOrderState,
	ColumnPinningState,
	ColumnSizingState,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getPaginationRowModel,
	GroupingState,
	SortingState,
	TableState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import { ExpandAllButton } from '../buttons/ExpandAllButton'
import { ExpandButton } from '../buttons/ExpandButton'
import { ToggleRowActionMenuButton } from '../buttons/ToggleRowActionMenuButton'
import {
	getAllLeafColumnDefs,
	getColumnId,
	getDefaultColumnFilterFn,
	getDefaultColumnOrderIds,
	prepareColumns,
	showExpandColumn,
} from '../column.utils'
import {
	GroupCollapsed,
	HoveredRowState,
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_FilterOption,
	Table_Row,
	Table_TableState,
	TableComponentPropsDefined,
	TableData,
	TableInstance,
} from '../TableComponent'
import { usePresets } from '../features'
import { getUtilColumn, utilColumns } from '../utilColumns'
import { defaultGetSubRows } from '../utils/defaultGetSubRows'
import { flatHierarchyTree } from '../utils/flatHierarchyTree'
import { getCoreRowModel } from '../utils/getCoreRowModel'
import { getExpandableColumn } from '../utils/getExpandableColumn'
import { getExpandedRowModel } from '../utils/getExpandedRowModel'
import { getFilteredRowModel } from '../utils/getFilteredRowModel'
import { getGroupedRowModel } from '../utils/getGroupedRowModel'
import { getSortedRowModel } from '../utils/getSortedRowModel'
import { showRowActionsColumn } from '../utils/showRowActionsColumn'
import { showUtilityColumn } from '../utils/showUtilityColumn'

import { NewRowState, useCreateNewRow } from './useCreateNewRow'
import { useTableColumns } from './useTableColumns'
import { useTableHierarchy } from './useTableHierarchy'

export const useTable = <TData extends TableData = TableData>(
	config: TableComponentPropsDefined<TData>
) => {
	const bottomToolbarRef = useRef<HTMLDivElement>(null)
	const editInputRefs = useRef<Record<string, HTMLInputElement>>({})
	const filterInputRefs = useRef<Record<string, HTMLInputElement>>({})
	const searchInputRef = useRef<HTMLInputElement>(null)
	const tableContainerRef = useRef<HTMLDivElement>(null)
	const tableHeadCellRefs = useRef<Record<string, HTMLTableCellElement>>({})
	const tablePaperRef = useRef<HTMLDivElement>(null)
	const topToolbarRef = useRef<HTMLDivElement>(null)
	const bulkActionsRef = useRef<HTMLDivElement>(null)
	const rowDragEnterTimeoutRef = useRef<NodeJS.Timeout>()
	const expandRowTimeoutRef = useRef<NodeJS.Timeout>()
	// required to get search value in different places
	// hopefully, we need to redo current HeaderSearch behavior, and pass filtering logic into getFilteredRowModel
	const headerSearchValueRef = useRef('')

	const initialState: Partial<Table_TableState<TData>> = useMemo(() => {
		const initState = config.initialState ?? {}
		initState.columnOrder =
			initState.columnOrder ?? getDefaultColumnOrderIds(config)
		initState.globalFilterFn = config.globalFilterFn ?? 'fuzzy'

		return initState
	}, [config.initialState, config.globalFilterFn])

	const [columnFilterFns, setColumnFilterFns] = useState<{
		[key: string]: Table_FilterOption
	}>(() =>
		Object.assign(
			{},
			...getAllLeafColumnDefs(config.columns).map((col) => ({
				[getColumnId(col)]:
					col.filterFn instanceof Function
						? col.filterFn.name ?? 'custom'
						: col.filterFn ??
						  initialState?.columnFilterFns?.[getColumnId(col)] ??
						  getDefaultColumnFilterFn(col),
			}))
		)
	)
	const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
		initialState.columnOrder ?? []
	)
	const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
		initialState.columnPinning ?? {}
	)
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialState.columnVisibility ?? {}
	)
	const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(
		initialState.columnSizing ?? {}
	)
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		initialState.columnFilters ?? []
	)
	const [rowSelection, setRowSelection] = React.useState({})
	const [draggingColumn, setDraggingColumn] =
		useState<Table_Column<TData> | null>(initialState.draggingColumn ?? null)
	const [draggingRows, setDraggingRows] = useState<Table_Row<TData>[]>(
		initialState.draggingRows ?? []
	)
	const [editingCell, setEditingCell] = useState<Table_Cell<TData> | null>(
		initialState.editingCell ?? null
	)
	const [editingRow, setEditingRow] = useState<Table_Row<TData> | null>(
		initialState.editingRow ?? null
	)
	const [isEditingTable, setIsEditingTable] = useState<boolean>(false)
	const [customColumnEditor, setCustomColumnEditor] = useState<
		string | undefined
	>()
	const [globalFilterFn, setGlobalFilterFn] = useState<Table_FilterOption>(
		initialState.globalFilterFn ?? 'fuzzy'
	)
	const [grouping, setGrouping] = useState<GroupingState>(
		initialState.grouping ?? []
	)
	const [hoveredColumn, setHoveredColumn] = useState<
		Table_Column<TData> | { id: string } | null
	>(initialState.hoveredColumn ?? null)
	const [hoveredRow, setHoveredRow] = useState<HoveredRowState<TData>>(
		initialState.hoveredRow ?? null
	)
	const [openedDetailedPanels, setOpenedDetailedPanels] = useState<Record<
		string,
		{
			cell: Table_Cell<TData>
			row: Table_Row<TData>
		}
	> | null>(null)
	const [isFullScreen, setIsFullScreen] = useState(
		initialState?.isFullScreen ?? false
	)
	const [newRow, setNewRow] = useState<NewRowState>(null)
	const [showAlertBanner, setShowAlertBanner] = useState(
		config.initialState?.showAlertBanner ?? false
	)
	// TODO: remove this state, its not used anymore
	const [showColumnFilters, setShowFilters] = useState(
		initialState?.showColumnFilters ?? false
	)
	const [showGlobalFilter, setShowGlobalFilter] = useState(
		initialState?.showGlobalFilter ?? false
	)
	const [showToolbarDropZone, setShowToolbarDropZone] = useState(
		initialState?.showToolbarDropZone ?? false
	)
	const [sorting, setSorting] = useState<SortingState>(
		initialState.sorting ?? []
	)
	const [searchData, setSearchData] = useState<Table_Row<TData>[] | null>(null)
	const [highlightHeadCellId, setHighlightHeadCellId] = useState<string | null>(
		null
	)
	const [groupCollapsed, setGroupCollapsed] = useState<GroupCollapsed>({})
	const [stickyHorizontalScrollbarHeight, setStickyHorizontalScrollbarHeight] =
		useState(0)
	const [collapsedMultirow, setCollapsedMultirow] = useState(
		config.defaultCollapsedMultiRow ?? []
	)

	const hideHierarchyTree =
		config.hierarchyTreeConfig &&
		!(config.hierarchyTreeConfig.enableHierarchyTree ?? true)
	const isHierarchyItem = config.hierarchyTreeConfig?.isHierarchyItem

	const isUtilityColumnVisible = showUtilityColumn(config)
	const displayColumns = useMemo(
		() =>
			(
				[
					isUtilityColumnVisible && getUtilColumn(config),
					showRowActionsColumn(config) && {
						Cell: ({ cell, row, table }) => (
							<ToggleRowActionMenuButton cell={cell} row={row} table={table} />
						),
						header: config.localization.actions,
						size: 40,
						emptyHeader: true,
						...config.defaultDisplayColumn,
						...config.displayColumnDefOptions?.[utilColumns.actions],
						id: utilColumns.actions,
					},
					showExpandColumn(config) && {
						Cell: ({ row, table }) => <ExpandButton row={row} table={table} />,
						Header: config.enableExpandAll ? (
							({ table }) => <ExpandAllButton table={table} />
						) : (
							<></>
						),
						header: config.localization.expand,
						size: 24,
						muiTableHeadCellWrapperProps: {
							sx: { width: '100%' },
						},
						muiTableBodyCellWrapperProps: {
							sx: { width: '100%' },
						},
						...config.defaultDisplayColumn,
						...config.displayColumnDefOptions?.[utilColumns.expand],
						id: utilColumns.expand,
					},
				] as Array<Table_ColumnDef<TData>>
			).filter(Boolean),
		[
			config.displayColumnDefOptions,
			config.editingMode,
			config.enableColumnDragging,
			config.enableColumnFilterModes,
			config.enableColumnOrdering,
			config.enableEditing,
			config.enableExpandAll,
			config.enableExpanding,
			config.enableGrouping,
			config.enableRowActions,
			config.enableRowDragging,
			config.enableRowNumbers,
			config.enableRowSelection,
			config.enableSelectAll,
			config.hideRowSelectionColumn,
			config.localization,
			config.positionActionsColumn,
			config.renderDetailPanel,
		]
	)

	const columnDefs = useMemo(
		() =>
			prepareColumns({
				aggregationFns: config.aggregationFns as any,
				columnDefs: [...displayColumns, ...config.columns],
				columnFilterFns: config.state?.columnFilterFns ?? columnFilterFns,
				defaultDisplayColumn: config.defaultDisplayColumn ?? {},
				filterFns: config.filterFns as any,
				sortingFns: config.sortingFns as any,
			}),
		[
			columnFilterFns,
			displayColumns,
			config.columns,
			config.state?.columnFilterFns,
		]
	)

	const data: TData[] = useMemo(() => {
		const tableData = config.data

		if (
			(config.state?.isLoading || config.state?.showSkeletons) &&
			(!tableData || !tableData.length)
		) {
			return [
				...Array(
					config.state?.pagination?.pageSize ||
						initialState?.pagination?.pageSize ||
						10
				).fill(null),
			].map(() =>
				Object.assign(
					{},
					...getAllLeafColumnDefs(config.columns).map((col) => ({
						[getColumnId(col)]: null,
					}))
				)
			)
		}
		if (isHierarchyItem && hideHierarchyTree) {
			return flatHierarchyTree(
				tableData,
				isHierarchyItem,
				config.getSubRows,
				config.setSubRows
			)
		}

		return tableData
	}, [
		config.getSubRows,
		config.setSubRows,
		config.data,
		config.state?.isLoading,
		config.state?.showSkeletons,
		hideHierarchyTree,
		isHierarchyItem,
	])

	const highlightCellId = (id: string | null) => {
		setHighlightHeadCellId(id)
	}

	const state = {
		columnFilterFns,
		columnFilters,
		rowSelection,
		columnOrder,
		columnPinning,
		columnVisibility,
		columnSizing,
		draggingColumn,
		draggingRows,
		editingCell,
		editingRow,
		customColumnEditor,
		globalFilterFn,
		grouping,
		groupCollapsed,
		hoveredColumn,
		hoveredRow,
		openedDetailedPanels,
		isEditingTable,
		isFullScreen,
		newRow,
		showAlertBanner,
		showColumnFilters,
		showGlobalFilter,
		showToolbarDropZone,
		sorting,
		searchData,
		highlightHeadCellId,
		stickyHorizontalScrollbarHeight,
		collapsedMultirow,
		...config.state,
	} as Table_TableState<TData>

	const isGroupableRow = useCallback(
		(row: Table_Row<TData>) => {
			return isHierarchyItem ? !isHierarchyItem(row.original) : true
		},
		[isHierarchyItem]
	)

	const onGroupingChange = useCallback(
		(setter) => {
			const _setColumnSizing = (currentGrouping) => {
				const newSizes = currentGrouping
					.slice(0, currentGrouping.length - 1)
					.reduce(
						(acc, columnId) => ({
							...acc,
							[columnId]: 44,
						}),
						{}
					)
				const currentSetColumnSizing =
					config.onColumnSizingChange ?? setColumnSizing
				currentSetColumnSizing((oldSizes) =>
					Object.entries(oldSizes).reduce(
						(acc, [columnId, size]) => ({
							[columnId]: size <= 44 ? undefined : size,
							...acc,
						}),
						newSizes
					)
				)
			}
			const currentSetGrouping = config.onGroupingChange ?? setGrouping

			return currentSetGrouping((old) => {
				let newGrouping = setter
				if (newGrouping instanceof Function) {
					newGrouping = setter(old)
				}
				for (const groupedColumn of newGrouping) {
					const collapsedMultirowExcludeIndex = collapsedMultirow.findIndex(
						(mult) => mult.colIds.includes(groupedColumn)
					)

					if (collapsedMultirowExcludeIndex !== -1) {
						const newCollapsedMultirowData = [...collapsedMultirow]
						newCollapsedMultirowData.splice(collapsedMultirowExcludeIndex, 1)

						setCollapsedMultirow(newCollapsedMultirowData)
					}
				}
				_setColumnSizing(newGrouping)

				return newGrouping
			})
		},
		[config.onGroupingChange, config.onColumnSizingChange, collapsedMultirow]
	)

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const table = Object.assign(
		useReactTable({
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getFacetedRowModel: getFacetedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getGroupedRowModel: getGroupedRowModel({
				isGroupableRow,
			}),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFacetedUniqueValues: getFacetedUniqueValues(),
			getSubRows: defaultGetSubRows,
			onColumnFiltersChange: setColumnFilters,
			onColumnOrderChange: setColumnOrder,
			onColumnSizingChange: setColumnSizing,
			onRowSelectionChange: setRowSelection,
			onColumnPinningChange: setColumnPinning,
			onColumnVisibilityChange: setColumnVisibility,
			onSortingChange: setSorting,
			onStateChange: config.onStateChange,
			...config,
			onGroupingChange,
			detailPanelBorderColor:
				config.detailPanelBorderColor ?? config.theme?.palette.primary.main,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			columns: columnDefs,
			data,
			globalFilterFn:
				config.filterFns?.[globalFilterFn] ?? config.filterFns?.fuzzy,
			initialState: {
				expanded: true,
				...initialState,
			},
			state: state as TableState,
		}),
		{
			refs: {
				bottomToolbarRef,
				bulkActionsRef,
				editInputRefs,
				expandRowTimeoutRef,
				filterInputRefs,
				headerSearchValueRef,
				searchInputRef,
				rowDragEnterTimeoutRef,
				tableContainerRef,
				tableHeadCellRefs,
				tablePaperRef,
				topToolbarRef,
			},
			constants: {},
			isHierarchyItem,
			setColumnFilterFns: config.onColumnFilterFnsChange ?? setColumnFilterFns,
			setDraggingColumn: config.onDraggingColumnChange ?? setDraggingColumn,
			setDraggingRows: config.onDraggingRowsChange ?? setDraggingRows,
			setEditingCell: config.onEditingCellChange ?? setEditingCell,
			setEditingRow: config.onEditingRowChange ?? setEditingRow,
			setCustomColumnEditor,
			setGlobalFilterFn: config.onGlobalFilterFnChange ?? setGlobalFilterFn,
			setGroupCollapsed: config.onGroupCollapsedChange ?? setGroupCollapsed,
			setHoveredColumn: config.onHoveredColumnChange ?? setHoveredColumn,
			setHoveredRow: config.onHoveredRowChange ?? setHoveredRow,
			setOpenedDetailedPanels,
			setIsEditingTable: config.onIsEditingTableChange ?? setIsEditingTable,
			setIsFullScreen: config.onIsFullScreenChange ?? setIsFullScreen,
			setNewRow: config.setNewRow ?? setNewRow,
			setShowAlertBanner: config.onShowAlertBannerChange ?? setShowAlertBanner,
			setShowFilters: config.onShowFiltersChange ?? setShowFilters,
			setShowGlobalFilter:
				config.onShowGlobalFilterChange ?? setShowGlobalFilter,
			setShowToolbarDropZone:
				config.onShowToolbarDropZoneChange ?? setShowToolbarDropZone,
			expandableColumn: null,
			setSearchData,
			setHighlightHeadCellId: highlightCellId,
			CustomRow: config.CustomRow,
			setStickyHorizontalScrollbarHeight,
			setCollapsedMultirow,
		}
	) as TableInstance<TData>

	if (config.tableInstanceRef) {
		config.tableInstanceRef.current = table
	}

	const visibleLeafColumns = table.getAllLeafColumns()

	table.constants.expandableColumn = useMemo(
		() => (table ? getExpandableColumn(visibleLeafColumns, table) : null),
		// recalculate expandable row, if column order changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[visibleLeafColumns, table, table.options.enableExpanding]
	)
	table.constants.disableActionButtons =
		table.getState().isEditingTable && table.options.editingMode === 'table'
	table.constants.hideInputErrorOnFocus = table.options.editingMode !== 'table'

	table.constants.totalRowCount = table.getFilteredRowModel().flatRows.length

	useTableColumns(table)
	useCreateNewRow(table)
	useTableHierarchy(table)
	usePresets(table, initialState)

	return { state, table, config }
}
