/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	getCoreRowModel,
	getExpandedRowModel,
	getFacetedRowModel,
	getFilteredRowModel,
	getGroupedRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Grow from '@mui/material/Grow'
import type { GroupingState, TableState } from '@tanstack/react-table'

import { ExpandAllButton } from '../buttons/ExpandAllButton'
import { ExpandButton } from '../buttons/ExpandButton'
import { ToggleRowActionMenuButton } from '../buttons/ToggleRowActionMenuButton'
import { SelectCheckbox } from '../inputs/SelectCheckbox'
import { EditRowModal } from '../body/EditRowModal'
import {
	prepareColumns,
	getAllLeafColumnDefs,
	getDefaultColumnOrderIds,
	getDefaultColumnFilterFn,
	showExpandColumn,
	getColumnId,
} from '../column.utils'
import type {
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_FilterOption,
	Table_Localization,
	Table_Row,
	TableInstance,
	Table_TableState,
	TableComponentProps,
} from '..'
import { getFlatGroupedRowModel } from '../utils/getFlatGroupedRowModel'

import { TablePaper } from './TablePaper'

export const TableRoot = <TData extends Record<string, any> = {}>(
	props: TableComponentProps<TData> & { localization: Table_Localization }
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
		const initState = props.initialState ?? {}
		initState.columnOrder =
			initState.columnOrder ?? getDefaultColumnOrderIds(props)
		initState.globalFilterFn = props.globalFilterFn ?? 'fuzzy'

		return initState
	}, [props.initialState, props.globalFilterFn])

	const [columnFilterFns, setColumnFilterFns] = useState<{
		[key: string]: Table_FilterOption
	}>(() =>
		Object.assign(
			{},
			...getAllLeafColumnDefs(props.columns as Table_ColumnDef<TData>[]).map(
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
	const [columnOrder, setColumnOrder] = useState(initialState.columnOrder ?? [])
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
		props.initialState?.showAlertBanner ?? false
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

	const displayColumns = useMemo(
		() =>
			(
				[
					columnOrder.includes('mrt-row-drag') && {
						header: props.localization.move,
						size: 60,
						...props.defaultDisplayColumn,
						...props.displayColumnDefOptions?.['mrt-row-drag'],
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
						header: props.localization.actions,
						size: 70,
						...props.defaultDisplayColumn,
						...props.displayColumnDefOptions?.['mrt-row-actions'],
						id: 'mrt-row-actions',
					},
					columnOrder.includes('mrt-row-expand') &&
						showExpandColumn(props) && {
							Cell: ({ row }) => (
								<ExpandButton row={row as any} table={table as any} />
							),
							Header: props.enableExpandAll
								? () => <ExpandAllButton table={table as any} />
								: null,
							header: props.localization.expand,
							size: 60,
							...props.defaultDisplayColumn,
							...props.displayColumnDefOptions?.['mrt-row-expand'],
							id: 'mrt-row-expand',
						},
					columnOrder.includes('mrt-row-select') && {
						Cell: ({ row }) => (
							<SelectCheckbox row={row as any} table={table as any} />
						),
						Header:
							props.enableSelectAll && props.enableMultiRowSelection
								? () => <SelectCheckbox selectAll table={table as any} />
								: null,
						header: props.localization.select,
						size: 60,
						...props.defaultDisplayColumn,
						...props.displayColumnDefOptions?.['mrt-row-select'],
						id: 'mrt-row-select',
					},
					columnOrder.includes('mrt-row-numbers') && {
						Cell: ({ row }) => row.index + 1,
						Header: () => props.localization.rowNumber,
						header: props.localization.rowNumbers,
						size: 60,
						...props.defaultDisplayColumn,
						...props.displayColumnDefOptions?.['mrt-row-numbers'],
						id: 'mrt-row-numbers',
					},
				] as Table_ColumnDef<TData>[]
			).filter(Boolean),
		[
			columnOrder,
			grouping,
			props.displayColumnDefOptions,
			props.editingMode,
			props.enableColumnDragging,
			props.enableColumnFilterModes,
			props.enableColumnOrdering,
			props.enableEditing,
			props.enableExpandAll,
			props.enableExpanding,
			props.enableGrouping,
			props.enableRowActions,
			props.enableRowDragging,
			props.enableRowNumbers,
			props.enableRowOrdering,
			props.enableRowSelection,
			props.enableSelectAll,
			props.localization,
			props.positionActionsColumn,
			props.renderDetailPanel,
		]
	)

	const columnDefs = useMemo(
		() =>
			prepareColumns({
				aggregationFns: props.aggregationFns as any,
				columnDefs: [...displayColumns, ...props.columns],
				columnFilterFns: props.state?.columnFilterFns ?? columnFilterFns,
				defaultDisplayColumn: props.defaultDisplayColumn ?? {},
				filterFns: props.filterFns as any,
				sortingFns: props.sortingFns as any,
			}),
		[
			columnFilterFns,
			displayColumns,
			props.columns,
			props.state?.columnFilterFns,
		]
	)

	const data: TData[] = useMemo(
		() =>
			(props.state?.isLoading || props.state?.showSkeletons) &&
			!props.data.length
				? [
						...Array(
							props.state?.pagination?.pageSize ||
								initialState?.pagination?.pageSize ||
								10
						).fill(null),
				  ].map(() =>
						Object.assign(
							{},
							...getAllLeafColumnDefs(props.columns).map((col) => ({
								[getColumnId(col)]: null,
							}))
						)
				  )
				: props.data,
		[props.data, props.state?.isLoading, props.state?.showSkeletons]
	)

	const setFlatGrouping = useCallback((setter) => {
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

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const table = {
		...useReactTable({
			getCoreRowModel: getCoreRowModel(),
			getExpandedRowModel: getExpandedRowModel(),
			getFacetedRowModel: getFacetedRowModel(),
			getFilteredRowModel: getFilteredRowModel(),
			getGroupedRowModel: props.enableAggregationRow
				? getGroupedRowModel()
				: getFlatGroupedRowModel(props.groupsSorting),
			getPaginationRowModel: getPaginationRowModel(),
			getSortedRowModel: getSortedRowModel(),
			onColumnOrderChange: setColumnOrder,
			onGroupingChange: props.enableAggregationRow
				? setGrouping
				: setFlatGrouping,
			getSubRows: (row) => row?.subRows,
			...props,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			columns: columnDefs,
			data,
			globalFilterFn:
				props.filterFns?.[globalFilterFn] ?? props.filterFns?.fuzzy,
			initialState: {
				...initialState,
			},
			state: {
				columnFilterFns,
				columnOrder,
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
				...props.state,
			} as TableState,
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
		setColumnFilterFns: props.onColumnFilterFnsChange ?? setColumnFilterFns,
		setDraggingColumn: props.onDraggingColumnChange ?? setDraggingColumn,
		setDraggingRow: props.onDraggingRowChange ?? setDraggingRow,
		setEditingCell: props.onEditingCellChange ?? setEditingCell,
		setEditingRow: props.onEditingRowChange ?? setEditingRow,
		setGlobalFilterFn: props.onGlobalFilterFnChange ?? setGlobalFilterFn,
		setHoveredColumn: props.onHoveredColumnChange ?? setHoveredColumn,
		setHoveredRow: props.onHoveredRowChange ?? setHoveredRow,
		setIsFullScreen: props.onIsFullScreenChange ?? setIsFullScreen,
		setShowAlertBanner: props.onShowAlertBannerChange ?? setShowAlertBanner,
		setShowFilters: props.onShowFiltersChange ?? setShowFilters,
		setShowGlobalFilter: props.onShowGlobalFilterChange ?? setShowGlobalFilter,
		setShowToolbarDropZone:
			props.onShowToolbarDropZoneChange ?? setShowToolbarDropZone,
	} as TableInstance<TData>

	if (props.tableInstanceRef) {
		props.tableInstanceRef.current = table
	}

	const initialBodyHeight = useRef<string>()

	useEffect(() => {
		if (typeof window !== 'undefined') {
			initialBodyHeight.current = document.body.style.height
		}
	}, [])

	useEffect(() => {
		if (typeof window !== 'undefined') {
			if (table.getState().isFullScreen) {
				document.body.style.height = '100vh'
			} else {
				document.body.style.height = initialBodyHeight.current as string
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [table.getState().isFullScreen])

	return (
		<>
			<Dialog
				PaperComponent={Box}
				TransitionComponent={!props.enableRowVirtualization ? Grow : undefined}
				disablePortal
				fullScreen
				keepMounted={false}
				onClose={() => table.setIsFullScreen(false)}
				open={table.getState().isFullScreen}
				transitionDuration={400}
			>
				<TablePaper table={table as any} />
			</Dialog>
			{!table.getState().isFullScreen && <TablePaper table={table as any} />}
			{editingRow && props.editingMode === 'modal' && (
				<EditRowModal row={editingRow as any} table={table} open />
			)}
		</>
	)
}
