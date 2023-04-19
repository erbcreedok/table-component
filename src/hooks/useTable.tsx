import {
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedRowModel,
	getFilteredRowModel,
	getGroupedRowModel,
	getPaginationRowModel,
	getSortedRowModel,
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

import { DEFAULT_PRESETS } from '../TableToolbar/components/buttons/presetContants'
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
import { SelectCheckbox } from '../inputs/SelectCheckbox'
import {
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_FilterOption,
	Table_Localization,
	Table_Row,
	Table_TableState,
	TableComponentProps,
	TableInstance,
} from '../TableComponent'

export const useTable = <TData extends Record<string, any> = {}>(
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
			...getAllLeafColumnDefs(config.columns as Table_ColumnDef<TData>[]).map(
				(col) => ({
					[getColumnId(col)]:
						col.filterFn instanceof Function
							? col.filterFn.name ?? 'custom'
							: col.filterFn ??
							  initialState?.columnFilterFns?.[getColumnId(col)] ??
							  getDefaultColumnFilterFn(col),
				})
			)
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
	const [draggingColumn, setDraggingColumn] =
		useState<Table_Column<TData> | null>(initialState.draggingColumn ?? null)
	const [draggingRow, setDraggingRow] = useState<Table_Row<TData> | null>(
		initialState.draggingRow ?? null
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
	const [hoveredRow, setHoveredRow] = useState<
		Table_Row<TData> | { id: string } | null
	>(initialState.hoveredRow ?? null)
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

	const displayColumns = useMemo(
		() =>
			(
				[
					columnOrder.includes('mrt-row-drag') && {
						header: config.localization.move,
						size: 60,
						...config.defaultDisplayColumn,
						...config.displayColumnDefOptions?.['mrt-row-drag'],
						id: 'mrt-row-drag',
					},
					columnOrder.includes('mrt-row-actions') && {
						Cell: ({ cell, row }) => (
							<ToggleRowActionMenuButton
								cell={cell as any}
								row={row as any}
								table={table as any}
							/>
						),
						header: config.localization.actions,
						size: 70,
						...config.defaultDisplayColumn,
						...config.displayColumnDefOptions?.['mrt-row-actions'],
						id: 'mrt-row-actions',
					},
					columnOrder.includes('mrt-row-expand') &&
						showExpandColumn(config) && {
							Cell: ({ row }) => (
								<ExpandButton row={row as any} table={table as any} />
							),
							Header: config.enableExpandAll
								? () => <ExpandAllButton table={table as any} />
								: null,
							header: config.localization.expand,
							size: 60,
							...config.defaultDisplayColumn,
							...config.displayColumnDefOptions?.['mrt-row-expand'],
							id: 'mrt-row-expand',
						},
					columnOrder.includes('mrt-row-select') && {
						Cell: ({ row }) => (
							<SelectCheckbox row={row as any} table={table as any} />
						),
						Header:
							config.enableSelectAll && config.enableMultiRowSelection
								? () => <SelectCheckbox selectAll table={table as any} />
								: null,
						header: config.localization.select,
						size: 60,
						...config.defaultDisplayColumn,
						...config.displayColumnDefOptions?.['mrt-row-select'],
						id: 'mrt-row-select',
					},
					columnOrder.includes('mrt-row-numbers') && {
						Cell: ({ row }) => row.index + 1,
						Header: () => config.localization.rowNumber,
						header: config.localization.rowNumbers,
						size: 60,
						...config.defaultDisplayColumn,
						...config.displayColumnDefOptions?.['mrt-row-numbers'],
						id: 'mrt-row-numbers',
					},
				] as Table_ColumnDef<TData>[]
			).filter(Boolean),
		[
			columnOrder,
			grouping,
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
			config.enableRowOrdering,
			config.enableRowSelection,
			config.enableSelectAll,
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

	const data: TData[] = useMemo(
		() =>
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
				: config.data,
		[config.data, config.state?.isLoading, config.state?.showSkeletons]
	)

	const setMergedGrouping = useCallback((setter) => {
		const setColumnSizings = (grouping) => {
			const newSizes = grouping.slice(0, grouping.length - 1).reduce(
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
			const newGrouping = setter(old)
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

	const getDefaultPresets = useCallback(() => DEFAULT_PRESETS, [])

	const state = {
		columnFilterFns,
		columnFilters,
		columnOrder,
		columnVisibility,
		draggingColumn,
		draggingRow,
		editingCell,
		editingRow,
		globalFilterFn,
		grouping,
		hoveredColumn,
		hoveredRow,
		isFullScreen,
		showAlertBanner,
		showColumnFilters,
		showGlobalFilter,
		showToolbarDropZone,
		sorting,
		...config.state,
	} as TableComponentState

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const table = {
		...useReactTable({
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getFacetedRowModel: getFacetedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getGroupedRowModel: getGroupedRowModel(),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			getFacetedUniqueValues: getFacetedUniqueValues(),
			getSubRows: (row) => row?.subRows,
			onColumnFiltersChange: setColumnFilters,
			onColumnOrderChange: setColumnOrder,
			onColumnVisibilityChange: setColumnVisibility,
			onGroupingChange: config.enableAggregationRow
				? setGrouping
				: setMergedGrouping,
			onSortingChange: setSorting,
			...config,
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
			editInputRefs,
			filterInputRefs,
			searchInputRef,
			tableContainerRef,
			tableHeadCellRefs,
			tablePaperRef,
			topToolbarRef,
		},
		setColumnFilterFns: config.onColumnFilterFnsChange ?? setColumnFilterFns,
		setDraggingColumn: config.onDraggingColumnChange ?? setDraggingColumn,
		setDraggingRow: config.onDraggingRowChange ?? setDraggingRow,
		setEditingCell: config.onEditingCellChange ?? setEditingCell,
		setEditingRow: config.onEditingRowChange ?? setEditingRow,
		setGlobalFilterFn: config.onGlobalFilterFnChange ?? setGlobalFilterFn,
		setHoveredColumn: config.onHoveredColumnChange ?? setHoveredColumn,
		setHoveredRow: config.onHoveredRowChange ?? setHoveredRow,
		setIsFullScreen: config.onIsFullScreenChange ?? setIsFullScreen,
		setShowAlertBanner: config.onShowAlertBannerChange ?? setShowAlertBanner,
		setShowFilters: config.onShowFiltersChange ?? setShowFilters,
		setShowGlobalFilter: config.onShowGlobalFilterChange ?? setShowGlobalFilter,
		setShowToolbarDropZone:
			config.onShowToolbarDropZoneChange ?? setShowToolbarDropZone,
		getPresets: config.onGetPresets ?? getPresets,
		savePresets: config.onSavePresets ?? savePresets,
		getDefaultPresets: config.onGetDefaultPresets ?? getDefaultPresets,
	} as TableInstance<TData>

	if (config.tableInstanceRef) {
		config.tableInstanceRef.current = table
	}

	return { state, table, config }
}
