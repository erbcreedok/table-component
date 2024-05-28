import type { Table as TableType } from '@tanstack/react-table'
import { FC, useCallback, useMemo } from 'react'
import {
	defaultRangeExtractor,
	Range,
	useVirtualizer,
	Virtualizer,
} from '@tanstack/react-virtual'
import MuiTable from '@mui/material/Table'

import { VirtualizerProvider } from '../context/VirtualizerProvider'
import { TableHead } from '../head/TableHead'
import { Memo_TableBody, TableBody } from '../body/TableBody'
import { TableBodyRow } from '../body/TableBodyRow'
import { TableFooter } from '../footer/TableFooter'
import { Table_Row, TableInstance, getColumnsFilteredByDisplay } from '..'
import { TableHeadInvisible } from '../head/TableHeadInvisible'
import { createRow } from '../utils/createRow'
import { getNonCollapsedColumns } from '../utils/getNonCollapsedColumns'

interface Props {
	table: TableInstance
}

export const Table: FC<Props> = ({ table }) => {
	const {
		getState,
		options: {
			columnVirtualizerInstanceRef,
			columnVirtualizerProps,
			enableColumnVirtualization,
			enableStickyHeader,
			enableTableFooter,
			enableTableHead,
			hideTableHead,
			hideSummaryRowInEmptyTable,
			layoutMode,
			memoMode,
			muiTableProps,
			enableSummaryRow,
			summaryRowCell,
		},
		refs: { tableContainerRef },
	} = table
	const {
		isFullScreen,
		columnPinning,
		columnVisibility,
		columnOrder,
		grouping,
		collapsedMultirow,
	} = getState()

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

	const _visibleColumns = getNonCollapsedColumns(
		getColumnsFilteredByDisplay([
			...table.getLeftVisibleLeafColumns(),
			...table.getCenterVisibleLeafColumns(),
			...table.getRightVisibleLeafColumns(),
		]),
		collapsedMultirow,
		'columnDef'
	)

	const [leftPinnedIndexes, rightPinnedIndexes] = useMemo(
		() =>
			enableColumnVirtualization
				? _visibleColumns.reduce(
						([left, right], column, index) => {
							if (!column.empty) {
								switch (column.getIsPinned()) {
									case 'left':
										left.push(index)
										break
									case 'right':
										right.push(index)
										break
									default:
										break
								}
							}

							return [left, right]
						},
						[[], []] as [number[], number[]]
				  )
				: [[], []],
		[
			enableColumnVirtualization,
			table,
			columnOrder,
			columnPinning,
			columnVisibility,
			grouping,
			_visibleColumns.length,
		]
	)

	const columnVirtualizer:
		| Virtualizer<HTMLDivElement, HTMLTableCellElement>
		| undefined = enableColumnVirtualization
		? // eslint-disable-next-line react-hooks/rules-of-hooks
		  useVirtualizer({
				count: _visibleColumns.length,
				estimateSize: () => averageColumnWidth,
				getScrollElement: () => tableContainerRef.current,
				horizontal: true,
				overscan: 1,
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
		? columnVirtualizer.getVirtualItems().filter(Boolean)
		: undefined

	let virtualPaddingLeft = 0
	let virtualPaddingRight = 0

	if (columnVirtualizer && virtualColumns?.length) {
		virtualPaddingLeft = virtualColumns[leftPinnedIndexes.length]?.start ?? 0
		virtualPaddingRight =
			columnVirtualizer.getTotalSize() -
			(virtualColumns[virtualColumns.length - 1 - rightPinnedIndexes.length]
				?.end ?? 0)
		const pinnedColumnsLeft =
			virtualColumns[leftPinnedIndexes.length - 1]?.end ?? 0
		const pinnedColumnsRight = rightPinnedIndexes.length
			? virtualColumns
					.slice(-rightPinnedIndexes.length)
					.reduce((acc, column) => acc + column.size, 0)
			: 0
		virtualPaddingLeft -= pinnedColumnsLeft
		virtualPaddingRight -= pinnedColumnsRight
	}

	const props = {
		table,
		virtualColumns,
	}

	const virtualizerProps = useMemo(
		() => ({
			virtualPaddingLeft,
			virtualPaddingRight,
		}),
		[virtualPaddingLeft, virtualPaddingRight]
	)

	const summaryRowProps = useMemo(
		() => ({
			columnVirtualizer,
			numRows: table.getRowModel().rows.length,
			rowIndex: -1,
			rowNumber: -1,
			table,
			virtualColumns,
			row: createRow(
				table as TableType<{}>,
				'summaryRow',
				{},
				-1,
				0,
				[]
			) as Table_Row,
		}),
		[columnVirtualizer, table, virtualColumns]
	)
	const showSummaryRow =
		enableSummaryRow &&
		summaryRowCell &&
		(!hideSummaryRowInEmptyTable ||
			table.getPaginationRowModel().rows.length > 0)

	return (
		<VirtualizerProvider value={virtualizerProps}>
			<MuiTable
				stickyHeader={enableStickyHeader || isFullScreen}
				{...tableProps}
				sx={(theme) => ({
					borderCollapse: 'separate',
					display: layoutMode === 'grid' ? 'grid' : 'table',
					// Invisible Table Head margin
					marginTop: enableTableHead ? '-2px' : undefined,
					tableLayout: layoutMode !== 'grid' ? 'fixed' : undefined,
					...(tableProps?.sx instanceof Function
						? tableProps.sx(theme)
						: (tableProps?.sx as any)),
				})}
			>
				{enableTableHead && layoutMode !== 'grid' && (
					<TableHeadInvisible
						{...props}
						measureElement={columnVirtualizer?.measureElement}
					/>
				)}
				{showSummaryRow && (
					<thead>
						<TableBodyRow
							key="summaryRow"
							domIndex={-1}
							isSummaryRow
							{...summaryRowProps}
						/>
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
		</VirtualizerProvider>
	)
}
