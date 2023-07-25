import React, { FC, useCallback, useMemo } from 'react'
import {
	defaultRangeExtractor,
	Range,
	useVirtualizer,
	Virtualizer,
} from '@tanstack/react-virtual'
import MuiTable from '@mui/material/Table'

import { TableHead } from '../head/TableHead'
import { Memo_TableBody, TableBody } from '../body/TableBody'
import { TableBodyRow } from '../body/TableBodyRow'
import { TableFooter } from '../footer/TableFooter'
import type { Table_Row, TableInstance } from '..'
import { TableHeadInvisible } from '../head/TableHeadInvisible'

interface Props {
	table: TableInstance
}

export const Table: FC<Props> = ({ table }) => {
	const {
		getState,
		options: {
			columnVirtualizerInstanceRef,
			columnVirtualizerProps,
			enableColumnResizing,
			enableColumnVirtualization,
			enablePinning,
			enableStickyHeader,
			enableTableFooter,
			enableTableHead,
			hideTableHead,
			layoutMode,
			memoMode,
			muiTableProps,
			enableSummaryRow,
			summaryRowCell,
		},
		refs: { tableContainerRef },
	} = table
	const { isFullScreen, columnPinning, columnVisibility } = getState()

	const tableProps =
		muiTableProps instanceof Function ? muiTableProps({ table }) : muiTableProps

	const vProps =
		columnVirtualizerProps instanceof Function
			? columnVirtualizerProps({ table })
			: columnVirtualizerProps

	// get first 16 column widths and average them
	const averageColumnWidth = useMemo(() => {
		if (!enableColumnVirtualization) return 0
		const columnsWidths =
			table
				.getRowModel()
				.rows[0]?.getCenterVisibleCells()
				?.slice(0, 16)
				?.map((cell) => cell.column.getSize() * 1.2) ?? []

		return columnsWidths.reduce((a, b) => a + b, 0) / columnsWidths.length
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [table.getRowModel().rows, columnPinning, columnVisibility])

	const [leftPinnedIndexes, rightPinnedIndexes] = useMemo(
		() =>
			enableColumnVirtualization && enablePinning
				? [
						table.getLeftLeafColumns().map((c) => c.getPinnedIndex()),
						table
							.getRightLeafColumns()
							.map(
								(c) =>
									table.getVisibleLeafColumns().length - c.getPinnedIndex() - 1
							),
				  ]
				: [[], []],
		[enableColumnVirtualization, enablePinning, table]
	)

	const columnVirtualizer:
		| Virtualizer<HTMLDivElement, HTMLTableCellElement>
		| undefined = enableColumnVirtualization
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useVirtualizer({
				count: table.getVisibleLeafColumns().length,
				estimateSize: () => averageColumnWidth,
				getScrollElement: () => tableContainerRef.current,
				horizontal: true,
				overscan: 3,
				// eslint-disable-next-line react-hooks/rules-of-hooks
				rangeExtractor: useCallback(
					(range: Range) =>
						Array.from(
							new Set([
								...leftPinnedIndexes,
								...defaultRangeExtractor(range),
								...rightPinnedIndexes,
							])
						),
					[leftPinnedIndexes, rightPinnedIndexes]
				),
				...vProps,
		  })
		: undefined

	if (columnVirtualizerInstanceRef && columnVirtualizer) {
		columnVirtualizerInstanceRef.current = columnVirtualizer
	}

	const virtualColumns = columnVirtualizer
		? columnVirtualizer.getVirtualItems()
		: undefined

	let virtualPaddingLeft: number | undefined
	let virtualPaddingRight: number | undefined

	if (columnVirtualizer && virtualColumns?.length) {
		virtualPaddingLeft = virtualColumns[leftPinnedIndexes.length]?.start ?? 0
		virtualPaddingRight =
			columnVirtualizer.getTotalSize() -
			(virtualColumns[virtualColumns.length - 1 - rightPinnedIndexes.length]
				?.end ?? 0)
	}

	const props = {
		table,
		virtualColumns,
		virtualPaddingLeft,
		virtualPaddingRight,
	}

	const summaryRowProps = {
		columnVirtualizer,
		numRows: table.getRowModel().rows.length as number,
		rowIndex: -1,
		table,
		row: {
			getIsSelected: () => false,
			getVisibleCells: table.getRowModel()?.rows[0]?.getVisibleCells,
		} as Table_Row,
	}

	return (
		<MuiTable
			stickyHeader={enableStickyHeader || isFullScreen}
			{...tableProps}
			sx={(theme) => ({
				borderCollapse: 'separate',
				display: layoutMode === 'grid' ? 'grid' : 'table',
				// Invisible Table Head margin
				marginTop: enableTableHead ? '-2px' : undefined,
				tableLayout:
					layoutMode !== 'grid' && enableColumnResizing ? 'fixed' : undefined,
				...(tableProps?.sx instanceof Function
					? tableProps.sx(theme)
					: (tableProps?.sx as any)),
			})}
		>
			{enableTableHead && <TableHeadInvisible table={table} />}
			{enableSummaryRow && summaryRowCell && (
				<thead>
					<TableBodyRow key="summaryRow" isSummaryRow {...summaryRowProps} />
				</thead>
			)}
			{enableTableHead && (
				<TableHead {...props} emptyTableHead={hideTableHead} />
			)}
			{memoMode === 'table-body' ? (
				// eslint-disable-next-line react/jsx-pascal-case
				<Memo_TableBody columnVirtualizer={columnVirtualizer} {...props} />
			) : (
				<TableBody columnVirtualizer={columnVirtualizer} {...props} />
			)}
			{enableTableFooter && <TableFooter {...props} />}
		</MuiTable>
	)
}
