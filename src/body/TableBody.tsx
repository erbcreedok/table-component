/* eslint-disable react/jsx-pascal-case */
import React, { FC, memo, useMemo, useEffect } from 'react'
import {
	useVirtualizer,
	Virtualizer,
	VirtualItem,
} from '@tanstack/react-virtual'
import MuiTableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { HierarchyRow, Memo_HierarchyRow } from '../components/HierarchyRow'
import { HoveredRowLine } from '../components/HoveredRowLine'
import { RowVirtualizerWrapper } from '../components/RowVirtualizerWrapper'
import { LinearProgressBar } from '../toolbar/LinearProgressBar'
import { rankGlobalFuzzy } from '../sortingFns'
import type { Table_Row, TableInstance } from '..'
import { isColumnDisplayed } from '../utils/getFilteredByDisplay'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

import {
	Memo_TableBodyRow,
	TableBodyRow,
	TableBodyRowProps,
} from './TableBodyRow'

interface Props {
	columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>
	table: TableInstance
	virtualColumns?: VirtualItem[]
}

export const TableBody: FC<Props> = ({
	columnVirtualizer,
	table,
	virtualColumns,
}) => {
	const {
		getRowModel,
		getPrePaginationRowModel,
		getState,
		resetRowSelection,
		options: {
			enableGlobalFilterRankedResults,
			enablePagination,
			enableRowVirtualization,
			hierarchyTreeConfig,
			layoutMode,
			localization,
			manualFiltering,
			manualPagination,
			manualSorting,
			memoMode,
			muiTableBodyProps,
			noResultsFoundSlot,
			noRecordsToDisplaySlot,
			rowVirtualizerInstanceRef,
			rowVirtualizerProps,
			tablePlugSlot,
			isTablePlugSlotActive,
			virtualizerInstanceRef,
			virtualizerProps,
			onInfiniteScrollLoad,
			showBottomProggressBar,
			infiniteScrollIntersectorStyles,
		},
		refs: { tableContainerRef, tablePaperRef },
		CustomRow,
	} = table
	const {
		columnFilters,
		globalFilter,
		pagination,
		sorting,
		groupCollapsed,
		editingCell,
		editingRow,
	} = getState()

	const tableBodyProps = getValueOrFunctionHandler(muiTableBodyProps)({ table })

	const vProps_old = getValueOrFunctionHandler(virtualizerProps)({ table })

	const vProps = getValueOrFunctionHandler(rowVirtualizerProps)({ table })

	// deselect all rows when cell or row editing has been started
	useEffect(() => {
		const isEditing = Boolean(editingCell?.id || editingRow?.id)

		if (isEditing) {
			resetRowSelection()
		}
	}, [editingCell, editingRow, resetRowSelection])

	const rows = useMemo(() => {
		if (
			enableGlobalFilterRankedResults &&
			globalFilter &&
			!manualFiltering &&
			!manualSorting &&
			!Object.values(sorting).some(Boolean)
		) {
			const rankedRows = [...getPrePaginationRowModel().rows].sort((a, b) =>
				rankGlobalFuzzy(a, b)
			)
			if (enablePagination === 'pages' && !manualPagination) {
				const start = pagination.pageIndex * pagination.pageSize

				return rankedRows.slice(start, start + pagination.pageSize)
			}

			return rankedRows
		}

		return getRowModel().rows
	}, [
		enableGlobalFilterRankedResults,
		(enableGlobalFilterRankedResults && globalFilter) ||
		enablePagination !== 'pages'
			? getPrePaginationRowModel().rows
			: getRowModel().rows,
		globalFilter,
		pagination.pageIndex,
		pagination.pageSize,
	])

	const { ref: intersectorRef } =
		useIntersectionObserver<HTMLTableSectionElement>({
			isEnabled: enablePagination === 'scroll',
			options: { threshold: 0 },
			onIntersectionChange: (isIntersecting) => {
				if (onInfiniteScrollLoad && isIntersecting) {
					onInfiniteScrollLoad({ table })
				}
			},
		})

	const rowVirtualizer:
		| Virtualizer<HTMLDivElement, HTMLTableRowElement>
		| undefined = enableRowVirtualization
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useVirtualizer({
				count: rows.length,
				estimateSize: () => 48,
				getScrollElement: () => tableContainerRef.current,
				measureElement: (element) => {
					if (!element) return null
					if (element.dataset.virtualHeight) {
						return +element.dataset.virtualHeight
					}

					return element?.getBoundingClientRect().height
				},
				overscan: 4,
				...vProps_old,
				...vProps,
		  })
		: undefined

	if (rowVirtualizerInstanceRef && rowVirtualizer) {
		rowVirtualizerInstanceRef.current = rowVirtualizer
	}

	// deprecated
	if (virtualizerInstanceRef && rowVirtualizer) {
		virtualizerInstanceRef.current = rowVirtualizer
	}

	const virtualRows = rowVirtualizer
		? rowVirtualizer.getVirtualItems()
		: undefined

	const rowsOrVirtualRows = virtualRows ?? rows
	const isHierarchyItem = hierarchyTreeConfig?.isHierarchyItem

	const rowProps = useMemo(() => {
		const increment =
			rowVirtualizer && rowsOrVirtualRows?.length
				? rowsOrVirtualRows[0].index + 1
				: 1
		let domIndex = 0

		return rowsOrVirtualRows.map((rowOrVirtualRow, rowIndex) => {
			const row = rowVirtualizer
				? rows[rowOrVirtualRow.index]
				: (rowOrVirtualRow as Table_Row)
			if (isHierarchyItem?.(row.original)) {
				domIndex = -1
			}
			const rowNumber = increment + domIndex
			// check if row has collapsed group rows
			const firstCollapsedGroupRow = Object.entries(row.groupRows ?? {}).reduce(
				(groupRow, [groupId, row]) => {
					if (
						!!groupCollapsed[groupId] &&
						row.depth < (groupRow?.depth ?? Infinity)
					) {
						return row
					}

					return groupRow
				},
				undefined as Table_Row | undefined
			)
			if (!firstCollapsedGroupRow) {
				domIndex += 1
			} else {
				// if row is collapsed, add the number of subrows to the domIndex
				domIndex += firstCollapsedGroupRow.subRows?.length ?? 0
			}

			return {
				columnVirtualizer,
				key: row.id,
				measureElement: rowVirtualizer?.measureElement,
				numRows: rows.length,
				row,
				rowIndex: rowVirtualizer ? rowOrVirtualRow.index : rowIndex,
				rowNumber,
				domIndex: rowIndex,
				table,
				virtualColumns,
				virtualRow: rowVirtualizer
					? (rowOrVirtualRow as VirtualItem)
					: undefined,
			} as TableBodyRowProps
		})
	}, [
		isHierarchyItem,
		rowsOrVirtualRows,
		rowVirtualizer,
		rows,
		columnVirtualizer,
		table,
		virtualColumns,
	])

	const rowsGroupingProps = useMemo(() => {
		const groupRows = {}
		const { grouping } = table.getState()
		rowProps.forEach(({ row }) => {
			grouping.forEach((columnId, columnIndex) => {
				if (!row.groupIds) return
				const groupId = row.groupIds[columnId]
				if (!groupId) return
				if (!groupRows[groupId])
					groupRows[groupId] = {
						rowId: row.id,
						count: 1,
						columnIndex,
						columnId,
					}
				else {
					groupRows[groupId].count += 1
				}
			})
		})
		const rowsGroupingProps = {}
		Object.keys(groupRows).forEach((groupId) => {
			const groupRow = groupRows[groupId]
			if (!rowsGroupingProps[groupRow.rowId]) {
				rowsGroupingProps[groupRow.rowId] = []
			}
			rowsGroupingProps[groupRow.rowId][groupRow.columnIndex] = {
				...groupRow,
				groupId,
			}
		})

		return rowsGroupingProps
	}, [rowProps, table])

	const getNoResultsSlot = (message: string) => (
		<Typography
			sx={{
				color: 'text.secondary',
				fontStyle: 'italic',
				maxWidth: `min(100vw, ${tablePaperRef.current?.clientWidth ?? 360}px)`,
				py: '2rem',
				textAlign: 'center',
				width: '100%',
			}}
		>
			{message}
		</Typography>
	)

	const columnsCount = virtualColumns
		? virtualColumns.length
		: table.getVisibleLeafColumns().filter(isColumnDisplayed).length

	return (
		<MuiTableBody
			{...tableBodyProps}
			sx={(theme) => ({
				display: layoutMode === 'grid' ? 'grid' : 'table-row-group',
				minHeight: !rows.length ? '100px' : undefined,
				position: 'relative',
				...(tableBodyProps?.sx instanceof Function
					? tableBodyProps?.sx(theme)
					: (tableBodyProps?.sx as any)),
			})}
		>
			{isTablePlugSlotActive ? (
				<tr style={{ display: layoutMode === 'grid' ? 'grid' : 'table-row' }}>
					<td
						colSpan={table.getVisibleLeafColumns().length}
						style={{ display: layoutMode === 'grid' ? 'grid' : 'table-cell' }}
					>
						{tablePlugSlot}
					</td>
				</tr>
			) : (
				<>
					{tableBodyProps?.children ??
						(!rows.length ? (
							<tr
								style={{
									display: layoutMode === 'grid' ? 'grid' : 'table-row',
								}}
							>
								<td
									colSpan={columnsCount}
									style={{
										display: layoutMode === 'grid' ? 'grid' : 'table-cell',
									}}
								>
									{globalFilter || columnFilters.length
										? noResultsFoundSlot ??
										  getNoResultsSlot(localization.noResultsFound)
										: noRecordsToDisplaySlot ??
										  getNoResultsSlot(localization.noRecordsToDisplay)}
								</td>
							</tr>
						) : (
							<RowVirtualizerWrapper
								rowVirtualizer={rowVirtualizer}
								colSpan={columnsCount}
							>
								{rowProps.map((props) => {
									const computedProps = {
										...props,
										groupingProps: rowsGroupingProps[props.row.id],
									}

									if (CustomRow)
										return (
											<CustomRow
												key={computedProps.row.id}
												{...computedProps}
											/>
										)
									if (hierarchyTreeConfig) {
										return memoMode === 'rows' ? (
											<Memo_HierarchyRow
												key={computedProps.row.id}
												{...computedProps}
											/>
										) : (
											<HierarchyRow
												key={computedProps.row.id}
												{...computedProps}
											/>
										)
									}

									return memoMode === 'rows' ? (
										<Memo_TableBodyRow
											key={computedProps.row.id}
											{...computedProps}
										/>
									) : (
										<TableBodyRow
											key={computedProps.row.id}
											{...computedProps}
										/>
									)
								})}
							</RowVirtualizerWrapper>
						))}
				</>
			)}
			<Box
				style={{
					height: '4px',
					width: '100%',
					position: 'absolute',
					bottom: '300px',
					...infiniteScrollIntersectorStyles,
				}}
				ref={intersectorRef}
			/>
			<HoveredRowLine />
			<LinearProgressBar
				table={table}
				isShown={showBottomProggressBar}
				isTopToolbar
			/>
		</MuiTableBody>
	)
}

export const Memo_TableBody = memo(
	TableBody,
	(prev, next) => prev.table.options.data === next.table.options.data
)
