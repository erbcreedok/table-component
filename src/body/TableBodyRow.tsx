import React, { DragEvent, FC, memo, useMemo, useRef } from 'react'
import MuiTableRow from '@mui/material/TableRow'
import { darken, lighten, useTheme } from '@mui/material/styles'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import type { Table_Cell, Table_Row, TableInstance } from '..'
import { getColumnId } from '../column.utils'
import { getCellGroupBorders } from '../utils/getGroupBorders'
import { getGroupedRowsCount } from '../utils/getGroupedRowsCount'
import { getIsFirstRowInGroup } from '../utils/getIsFirstRowInGroup'
import { getSubRowIndex } from '../utils/getSubRowIndex'

import { Memo_TableBodyCell, TableBodyCell } from './TableBodyCell'
import { TableDetailPanel } from './TableDetailPanel'

export interface TableBodyRowProps {
	columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>
	measureElement?: (element: HTMLTableRowElement) => void
	numRows: number
	row: Table_Row
	rowIndex: number
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
	virtualRow?: VirtualItem
	isSummaryRow?: boolean
}

export const TableBodyRow: FC<TableBodyRowProps> = ({
	columnVirtualizer,
	measureElement,
	numRows,
	row,
	rowIndex,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	virtualRow,
	isSummaryRow = false,
}) => {
	const theme = useTheme()
	const {
		getIsSomeColumnsPinned,
		getState,
		options: {
			enableRowOrdering,
			layoutMode,
			memoMode,
			muiTableBodyRowProps,
			renderDetailPanel,
		},
		setHoveredRow,
	} = table
	const {
		draggingColumn,
		draggingRow,
		editingCell,
		editingRow,
		hoveredRow,
		grouping,
	} = getState()

	const tableRowProps =
		muiTableBodyRowProps instanceof Function
			? muiTableBodyRowProps({ row, table })
			: muiTableBodyRowProps

	const handleDragEnter = (_e: DragEvent) => {
		if (enableRowOrdering && draggingRow) {
			setHoveredRow(row)
		}
	}

	const rowRef = useRef<HTMLTableRowElement | null>(null)

	const draggingBorder = useMemo(
		() =>
			draggingRow?.id === row.id
				? `1px dashed ${theme.palette.text.secondary}`
				: hoveredRow?.id === row.id
				? `2px dashed ${theme.palette.primary.main}`
				: undefined,
		[draggingRow, hoveredRow]
	)

	const draggingBorders = draggingBorder
		? {
				border: draggingBorder,
		  }
		: undefined

	const groupedCells = grouping
		.map((columnId, colIndex) => {
			if (getIsFirstRowInGroup({ row, table, columnId })) {
				const rowSpan = getGroupedRowsCount({ row, table, columnId })
				const cell = row
					.getVisibleCells()
					.find((cell) => getColumnId(cell.column.columnDef) === columnId)
				if (cell === undefined) {
					return null
				}
				const props = {
					cell,
					enableHover: false,
					measureElement: columnVirtualizer?.measureElement,
					numRows,
					rowIndex,
					rowRef,
					table,
					isSummaryRowCell: isSummaryRow,
					rowSpan,
					isGroupedCell: true,
					groupBorders: getCellGroupBorders({
						table,
						isFirstOfGroup: true,
						isGroupedColumn: true,
						rowIndex: getSubRowIndex({ row, table }) ?? rowIndex,
						colIndex,
					}),
				}

				return (
					<TableBodyCell
						key={`grouped-cell-${columnId}-${row.getValue(columnId)}`}
						{...props}
					/>
				)
			}

			return null
		})
		.filter(Boolean)

	return (
		<>
			<MuiTableRow
				data-index={virtualRow?.index}
				hover
				onDragEnter={handleDragEnter}
				selected={row.getIsSelected()}
				ref={(node: HTMLTableRowElement) => {
					if (node) {
						rowRef.current = node
						measureElement?.(node)
					}
				}}
				{...tableRowProps}
				sx={(theme) => ({
					backgroundColor: lighten(theme.palette.background.default, 0.06),
					display: layoutMode === 'grid' ? 'flex' : 'table-row',
					opacity:
						draggingRow?.id === row.id || hoveredRow?.id === row.id ? 0.5 : 1,
					position: virtualRow ? 'absolute' : undefined,
					top: virtualRow ? 0 : undefined,
					transform: virtualRow
						? `translateY(${virtualRow?.start}px)`
						: undefined,
					transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
					width: '100%',
					'&:hover td': {
						backgroundColor:
							tableRowProps?.hover !== false && getIsSomeColumnsPinned()
								? theme.palette.mode === 'dark'
									? `${lighten(theme.palette.background.default, 0.12)}`
									: `${darken(theme.palette.background.default, 0.05)}`
								: undefined,
					},
					...(tableRowProps?.sx instanceof Function
						? tableRowProps.sx(theme)
						: (tableRowProps?.sx as any)),
					...draggingBorders,
				})}
			>
				{groupedCells}
				{virtualPaddingLeft ? (
					<td style={{ display: 'flex', width: virtualPaddingLeft }} />
				) : null}
				{(virtualColumns ?? row.getVisibleCells()).map(
					(cellOrVirtualCell, colIndex) => {
						const cell = columnVirtualizer
							? row.getVisibleCells()[(cellOrVirtualCell as VirtualItem).index]
							: (cellOrVirtualCell as Table_Cell)
						if (cell.getIsPlaceholder() && !isSummaryRow) {
							return null
						}
						const props = {
							cell,
							enableHover: tableRowProps?.hover !== false,
							key: cell.id,
							measureElement: columnVirtualizer?.measureElement,
							numRows,
							rowIndex,
							rowRef,
							table,
							virtualCell: columnVirtualizer
								? (cellOrVirtualCell as VirtualItem)
								: undefined,
							isSummaryRowCell: isSummaryRow,
							groupBorders: getCellGroupBorders({
								table,
								isFirstOfGroup: groupedCells.length > 0,
								rowIndex: getSubRowIndex({ row, table }) ?? rowIndex,
								colIndex,
								isGroupedColumn: false,
							}),
						}

						return memoMode === 'cells' &&
							cell.column.columnDef.columnDefType === 'data' &&
							!draggingColumn &&
							!draggingRow &&
							editingCell?.id !== cell.id &&
							editingRow?.id !== row.id ? (
							// eslint-disable-next-line react/jsx-pascal-case
							<Memo_TableBodyCell {...props} />
						) : (
							<TableBodyCell {...props} />
						)
					}
				)}
				{virtualPaddingRight ? (
					<td style={{ display: 'flex', width: virtualPaddingRight }} />
				) : null}
			</MuiTableRow>
			{renderDetailPanel && !row?.getIsGrouped?.() && (
				<TableDetailPanel
					parentRowRef={rowRef}
					row={row}
					table={table}
					virtualRow={virtualRow}
				/>
			)}
		</>
	)
}

export const Memo_TableBodyRow = memo(
	TableBodyRow,
	(prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex
)
