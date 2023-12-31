import {
	getFacetedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getFacetedUniqueValues,
	GroupingState,
	TableState,
	ColumnFiltersState,
	useReactTable,
	VisibilityState,
	SortingState,
	ColumnOrderState,
} from '@tanstack/react-table'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import { getDefaultPreset } from '../TableToolbar/components/buttons/presetContants'
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
import { TableComponentState } from '../context/TableContext'
import {
	GroupCollapsed,
	HoveredRowState,
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_FilterOption,
	Table_Localization,
	Table_Row,
	Table_TableState,
	TableComponentProps,
	TableData,
	TableInstance,
} from '../TableComponent'
import { getUtilColumn, utilColumns } from '../utilColumns'
import { getCoreRowModel } from '../utils/getCoreRowModel'
import { getExpandedRowModel } from '../utils/getExpandedRowModel'
import { getGroupedRowModel } from '../utils/getGroupedRowModel'
import { getSortedRowModel } from '../utils/getSortedRowModel'
import { showRowActionsColumn } from '../utils/showRowActionsColumn'

export const useTable = <TData extends TableData = TableData>(
	config: TableComponentProps<TData> & { localization: Table_Localization }
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
			...getAllLeafColumnDefs(
				config.columns as Array<Table_ColumnDef<TData>>
			).map((col) => ({
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
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialState.columnVisibility ?? {}
	)
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
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
	const [showAlertBanner, setShowAlertBanner] = useState(
		config.initialState?.showAlertBanner ?? false
	)
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
	const [searchId, setSearchId] = useState<string | string[] | null>(null)
	const [highlightHeadCellId, setHighlightHeadCellId] = useState<string | null>(
		null
	)
	const [groupCollapsed, setGroupCollapsed] = useState<GroupCollapsed>({})
	const [stickyHorizontalScrollbarHeight, setStickyHorizontalScrollbarHeight] =
		useState(0)

	const displayColumns = useMemo(
		() =>
			(
				[
					(config.enableRowDragging ||
						config.enableRowNumbers ||
						(!config.hideRowSelectionColumn && config.enableRowSelection)) &&
						getUtilColumn(config),
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
		const tableData =
			(config.state?.isLoading || config.state?.showSkeletons) &&
			!config.data.length
				? [
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
				: config.data

		return searchId
			? tableData.filter((item) => {
					if (Array.isArray(searchId)) {
						return searchId.includes(item.id)
					}

					return item.id === searchId
			  })
			: tableData
	}, [
		config.data,
		config.state?.isLoading,
		config.state?.showSkeletons,
		searchId,
	])

	const setMergedGrouping = useCallback((setter) => {
		const setColumnSizings = (currentGrouping) => {
			const newSizes = currentGrouping
				.slice(0, currentGrouping.length - 1)
				.reduce(
					(acc, columnId) => ({
						...acc,
						[columnId]: 1,
					}),
					{}
				)

			table.setColumnSizing((oldSizes) =>
				Object.entries(oldSizes).reduce(
					(acc, [columnId, size]) => ({
						[columnId]: size === 1 ? undefined : size,
						...acc,
					}),
					newSizes
				)
			)
		}

		return setGrouping((old) => {
			let newGrouping = setter
			if (newGrouping instanceof Function) {
				newGrouping = setter(old)
			}
			setColumnSizings(newGrouping)

			return newGrouping
		})
	}, [])

	const getPresets = useCallback(
		() => JSON.parse(localStorage.getItem('tablePresets') as string),
		[]
	)

	const savePresets = useCallback((presets) => {
		localStorage.setItem('tablePresets', JSON.stringify(presets))
	}, [])

	const getDefaultPresets = useCallback(() => {
		if (config.onGetDefaultPresets) {
			return config.onGetDefaultPresets(initialState)
		}

		return [getDefaultPreset(initialState)]
	}, [])

	const searchData = (id: string | string[] | null) => {
		setSearchId(id)

		if (config.onSearchData) {
			config.onSearchData()
		}
	}

	const highlightCellId = (id: string | null) => {
		setHighlightHeadCellId(id)
	}

	const state = {
		columnFilterFns,
		columnFilters,
		rowSelection,
		columnOrder,
		columnVisibility,
		draggingColumn,
		draggingRows,
		editingCell,
		editingRow,
		globalFilterFn,
		grouping,
		groupCollapsed,
		hoveredColumn,
		hoveredRow,
		openedDetailedPanels,
		isFullScreen,
		showAlertBanner,
		showColumnFilters,
		showGlobalFilter,
		showToolbarDropZone,
		sorting,
		searchId,
		highlightHeadCellId,
		stickyHorizontalScrollbarHeight,
		...config.state,
	} as TableComponentState<TData>

	const isGroupableRow = useCallback(
		(row: Table_Row<TData>) => {
			return config.getIsUnitTreeItem
				? !config.getIsUnitTreeItem(row.original)
				: true
		},
		[config.getIsUnitTreeItem]
	)

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const table = {
		...useReactTable({
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
			getSubRows: (row) => row?.subRows,
			onColumnFiltersChange: setColumnFilters,
			onColumnOrderChange: setColumnOrder,
			onRowSelectionChange: setRowSelection,
			onColumnVisibilityChange: setColumnVisibility,
			onGroupingChange: setMergedGrouping,
			onSortingChange: setSorting,
			onStateChange: config.onStateChange,
			...config,
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
		refs: {
			bottomToolbarRef,
			bulkActionsRef,
			editInputRefs,
			filterInputRefs,
			searchInputRef,
			rowDragEnterTimeoutRef,
			tableContainerRef,
			tableHeadCellRefs,
			tablePaperRef,
			topToolbarRef,
		},
		setColumnFilterFns: config.onColumnFilterFnsChange ?? setColumnFilterFns,
		setDraggingColumn: config.onDraggingColumnChange ?? setDraggingColumn,
		setDraggingRows: config.onDraggingRowsChange ?? setDraggingRows,
		setEditingCell: config.onEditingCellChange ?? setEditingCell,
		setEditingRow: config.onEditingRowChange ?? setEditingRow,
		setGlobalFilterFn: config.onGlobalFilterFnChange ?? setGlobalFilterFn,
		setGroupCollapsed: config.onGroupCollapsedChange ?? setGroupCollapsed,
		setHoveredColumn: config.onHoveredColumnChange ?? setHoveredColumn,
		setHoveredRow: config.onHoveredRowChange ?? setHoveredRow,
		setOpenedDetailedPanels,
		setIsFullScreen: config.onIsFullScreenChange ?? setIsFullScreen,
		setShowAlertBanner: config.onShowAlertBannerChange ?? setShowAlertBanner,
		setShowFilters: config.onShowFiltersChange ?? setShowFilters,
		setShowGlobalFilter: config.onShowGlobalFilterChange ?? setShowGlobalFilter,
		setShowToolbarDropZone:
			config.onShowToolbarDropZoneChange ?? setShowToolbarDropZone,
		getPresets: config.onGetPresets ?? getPresets,
		savePresets: config.onSavePresets ?? savePresets,
		getDefaultPresets,
		showSearchData: searchData,
		setHighlightHeadCellId: highlightCellId,
		CustomRow: config.CustomRow,
		setStickyHorizontalScrollbarHeight,
	} as TableInstance<TData>

	if (config.tableInstanceRef) {
		config.tableInstanceRef.current = table
	}

	return { state, table, config }
}
