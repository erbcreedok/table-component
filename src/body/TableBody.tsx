/* eslint-disable react/jsx-pascal-case */
import { FC, memo, useMemo, useEffect } from 'react'
import { Virtualizer, VirtualItem } from '@tanstack/react-virtual'
import MuiTableBody from '@mui/material/TableBody'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { HoveredRowLine } from '../components/HoveredRowLine'
import { LinearProgressBar } from '../toolbar/LinearProgressBar'
import { rankGlobalFuzzy } from '../sortingFns'
import type { TableInstance } from '..'
import { isColumnDisplayed } from '../utils/getFilteredByDisplay'
import { getTableRowVirtualizer } from '../utils/getTableRowVirtualizer'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

import { TableBodyRows } from './TableBodyRows'

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
			enableRowVirtualization,
			enableGlobalFilterRankedResults,
			enablePagination,
			layoutMode,
			localization,
			manualFiltering,
			manualPagination,
			manualSorting,
			muiTableBodyProps,
			noResultsFoundSlot,
			noRecordsToDisplaySlot,
			rowVirtualizerProps,
			windowVirtualizer,
			tablePlugSlot,
			isTablePlugSlotActive,
			virtualizerProps,
			onInfiniteScrollLoad,
			showBottomProggressBar,
			infiniteScrollIntersectorStyles,
		},
		refs: { tableContainerRef, tablePaperRef },
	} = table
	const {
		columnFilters,
		globalFilter,
		pagination,
		sorting,
		editingCell,
		editingRow,
	} = getState()

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

	const tableBodyProps = getValueOrFunctionHandler(muiTableBodyProps)({ table })

	const vProps_old = getValueOrFunctionHandler(virtualizerProps)({ table })

	const vProps = getValueOrFunctionHandler(rowVirtualizerProps)({ table })

	const commonVirtualizerProps = {
		count: rows.length,
		estimateSize: () => 48,
		...(!windowVirtualizer && {
			getScrollElement: () => tableContainerRef.current,
		}),
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
	}

	const Virtualizer = useMemo(() => {
		return getTableRowVirtualizer(enableRowVirtualization, windowVirtualizer)
	}, [windowVirtualizer])

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
							<Virtualizer virtualizerProps={commonVirtualizerProps}>
								{(virtualizer) => (
									<TableBodyRows
										virtualizer={virtualizer}
										table={table}
										columnVirtualizer={columnVirtualizer}
										virtualColumns={virtualColumns}
										rows={rows}
										columnsCount={columnsCount}
									/>
								)}
							</Virtualizer>
						))}
				</>
			)}
			<Box
				component="tr"
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
