import React, { FC, memo, useMemo } from 'react'
import {
	useVirtualizer,
	Virtualizer,
	VirtualItem,
} from '@tanstack/react-virtual'
import MuiTableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'

import { rankGlobalFuzzy } from '../sortingFns'
import type { Table_Row, TableInstance } from '..'

import { Memo_TableBodyRow, TableBodyRow } from './TableBodyRow'

interface Props {
	columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
}

export const TableBody: FC<Props> = ({
	columnVirtualizer,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
}) => {
	const {
		getRowModel,
		getPrePaginationRowModel,
		getState,
		options: {
			enableGlobalFilterRankedResults,
			enablePagination,
			enableRowVirtualization,
			layoutMode,
			localization,
			manualFiltering,
			manualPagination,
			manualSorting,
			memoMode,
			muiTableBodyProps,
			rowVirtualizerInstanceRef,
			rowVirtualizerProps,
			tablePlugSlot,
			isTablePlugSlotActive,
			virtualizerInstanceRef,
			virtualizerProps,
		},
		refs: { tableContainerRef, tablePaperRef },
		CustomRow,
	} = table
	const { columnFilters, globalFilter, pagination, sorting } = getState()

	const tableBodyProps =
		muiTableBodyProps instanceof Function
			? muiTableBodyProps({ table })
			: muiTableBodyProps

	const vProps_old =
		virtualizerProps instanceof Function
			? virtualizerProps({ table })
			: virtualizerProps

	const vProps =
		rowVirtualizerProps instanceof Function
			? rowVirtualizerProps({ table })
			: rowVirtualizerProps

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
			if (enablePagination && !manualPagination) {
				const start = pagination.pageIndex * pagination.pageSize

				return rankedRows.slice(start, start + pagination.pageSize)
			}

			return rankedRows
		}

		return getRowModel().rows
	}, [
		enableGlobalFilterRankedResults,
		(enableGlobalFilterRankedResults && globalFilter) || !enablePagination
			? getPrePaginationRowModel().rows
			: getRowModel().rows,
		globalFilter,
		pagination.pageIndex,
		pagination.pageSize,
	])

	const rowVirtualizer:
		| Virtualizer<HTMLDivElement, HTMLTableRowElement>
		| undefined = enableRowVirtualization
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useVirtualizer({
				count: rows.length,
				estimateSize: () => 48,
				getScrollElement: () => tableContainerRef.current,
				measureElement: (element) => element?.getBoundingClientRect().height,
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

	return (
		<MuiTableBody
			{...tableBodyProps}
			sx={(theme) => ({
				display: layoutMode === 'grid' ? 'grid' : 'table-row-group',
				height: rowVirtualizer
					? `${rowVirtualizer.getTotalSize()}px`
					: 'inherit',
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
									colSpan={table.getVisibleLeafColumns().length}
									style={{
										display: layoutMode === 'grid' ? 'grid' : 'table-cell',
									}}
								>
									<Typography
										sx={{
											color: 'text.secondary',
											fontStyle: 'italic',
											maxWidth: `min(100vw, ${
												tablePaperRef.current?.clientWidth ?? 360
											}px)`,
											py: '2rem',
											textAlign: 'center',
											width: '100%',
										}}
									>
										{globalFilter || columnFilters.length
											? localization.noResultsFound
											: localization.noRecordsToDisplay}
									</Typography>
								</td>
							</tr>
						) : (
							<>
								{(virtualRows ?? rows).map((rowOrVirtualRow, rowIndex) => {
									const row = rowVirtualizer
										? rows[rowOrVirtualRow.index]
										: (rowOrVirtualRow as Table_Row)
									const props = {
										columnVirtualizer,
										key: row.id,
										measureElement: rowVirtualizer?.measureElement,
										numRows: rows.length,
										row,
										rowIndex: rowVirtualizer ? rowOrVirtualRow.index : rowIndex,
										table,
										virtualColumns,
										virtualPaddingLeft,
										virtualPaddingRight,
										virtualRow: rowVirtualizer
											? (rowOrVirtualRow as VirtualItem)
											: undefined,
									}

									return memoMode === 'rows' ? (
										// eslint-disable-next-line react/jsx-pascal-case
										<Memo_TableBodyRow {...props} />
									) : CustomRow ? (
										<CustomRow {...props} />
									) : (
										<TableBodyRow {...props} />
									)
								})}
							</>
						))}
				</>
			)}
		</MuiTableBody>
	)
}

export const Memo_TableBody = memo(
	TableBody,
	(prev, next) => prev.table.options.data === next.table.options.data
)
