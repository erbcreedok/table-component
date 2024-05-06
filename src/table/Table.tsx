import MuiTable from '@mui/material/Table'
import {
	defaultRangeExtractor,
	Range,
	useVirtualizer,
	Virtualizer,
} from '@tanstack/react-virtual'
import { FC, useCallback, useMemo } from 'react'

import { TableInstance } from '..'
import { Memo_TableBody, TableBody } from '../body/TableBody'
import { TableBodyRow } from '../body/TableBodyRow'
import { VirtualizerProvider } from '../context/VirtualizerProvider'
import { TableFooter } from '../footer/TableFooter'
import { TableHead } from '../head/TableHead'
import { TableHeadInvisible } from '../head/TableHeadInvisible'
import { createTableRow } from '../utils'

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

	const _visibleColumns = table.getNonCollapsedColumns()

	const [leftPinnedIndexes, rightPinnedIndexes, groupedIndexes] = useMemo(
		() =>
			enableColumnVirtualization
				? _visibleColumns.reduce(
						([left, right, grouped], column, index) => {
							if (!column.empty) {
								if (column.getIsGrouped()) {
									grouped.push(index)
								}
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

							return [left, right, grouped]
						},
						[[], [], []] as [number[], number[], number[]]
				  )
				: [[], [], []],
		[enableColumnVirtualization, _visibleColumns]
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
					(range: Range) => {
						const rangeList = defaultRangeExtractor(range)

						return Array.from(
							new Set([
								...groupedIndexes.filter((index) => rangeList.includes(index)),
								...leftPinnedIndexes,
								...rangeList,
								...rightPinnedIndexes,
							])
						)
					},
					[groupedIndexes, leftPinnedIndexes, rightPinnedIndexes]
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
			row: createTableRow(table, 'summaryRow', {}, -1, 0, []),
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
