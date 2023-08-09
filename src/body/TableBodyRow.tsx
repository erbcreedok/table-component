import { tableRowClasses } from '@mui/material'
import React, { FC, memo, useMemo, useRef } from 'react'
import MuiTableRow from '@mui/material/TableRow'
import { lighten } from '@mui/material/styles'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import { EmptyCell } from '../components/EmptyCell'
import { getCellGroupBorders } from '../utils/getGroupBorders'
import type { Table_Cell, Table_Row, TableInstance } from '..'
import { getColumnId } from '../column.utils'
import { Colors } from '../components/styles'
import { getSubRowIndex } from '../utils/getSubRowIndex'

import { Memo_TableBodyCell, TableBodyCell } from './TableBodyCell'
import { TableDetailPanel } from './TableDetailPanel'

export interface TableBodyRowProps {
	columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>
	domIndex?: number
	measureElement?: (element: HTMLTableRowElement) => void
	numRows: number
	row: Table_Row
	rowIndex: number
	rowNumber: number
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
	virtualRow?: VirtualItem
	isSummaryRow?: boolean
	groupingProps?: {
		groupId: string
		columnIndex: number
		columnId: string
		count: number
	}[]
}

export const TableBodyRow: FC<TableBodyRowProps> = ({
	columnVirtualizer,
	measureElement,
	numRows,
	row,
	rowIndex,
	rowNumber,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	virtualRow,
	isSummaryRow = false,
	groupingProps,
}) => {
	const {
		getIsSomeColumnsPinned,
		getState,
		options: {
			enableRowDragging,
			layoutMode,
			memoMode,
			muiTableBodyRowProps,
			renderDetailPanel,
		},
		refs: { rowDragEnterTimeoutRef },
		setHoveredRow,
	} = table
	const { draggingColumn, draggingRows, editingCell, editingRow } = getState()

	const tableRowProps =
		muiTableBodyRowProps instanceof Function
			? muiTableBodyRowProps({ row, table })
			: muiTableBodyRowProps

	const currentHoveredRow = useMemo(
		() => ({
			row,
			position: 'bottom' as const,
		}),
		[row]
	)

	const handleDragEnter = () => {
		clearTimeout(rowDragEnterTimeoutRef.current)
		rowDragEnterTimeoutRef.current = setTimeout(() => {
			if (enableRowDragging && draggingRows.length > 0) {
				setHoveredRow({ ...currentHoveredRow, rowRef })
			}
		}, 250)
	}

	const rowRef = useRef<HTMLTableRowElement | null>(null)

	const isDraggingRow = useMemo(
		() => draggingRows.some((dRow) => dRow?.id === row.id),
		[draggingRows, row.id]
	)

	const { collapsedColumnIndex } = row
	const groupedCells = (groupingProps ?? [])
		.map((group, index, arr) => {
			// There is an extra row for the detail panel, so multiply rowspan by 2
			const rowSpan = group.count * (renderDetailPanel ? 2 : 1)
			const cell = row
				.getVisibleCells()
				.find((cell) => getColumnId(cell.column.columnDef) === group.columnId)
			if (cell === undefined) {
				return null
			}
			const groupBorders = getCellGroupBorders({
				table,
				isFirstOfGroup: true,
				isGroupedColumn: true,
				rowIndex: getSubRowIndex({ row }) ?? rowIndex,
				colIndex: group.columnIndex,
			})
			if (collapsedColumnIndex !== undefined && collapsedColumnIndex < index) {
				return (
					<EmptyCell
						key={group.groupId}
						groupBorders={groupBorders}
						isGroupedCell
						isLastGroupedColumn={index === arr.length - 1}
					/>
				)
			}
			const props = {
				cell,
				enableHover: false,
				measureElement: columnVirtualizer?.measureElement,
				numRows,
				row,
				rowIndex,
				rowNumber,
				rowRef,
				table,
				isSummaryRowCell: isSummaryRow,
				rowSpan,
				isGroupedCell: true,
				groupBorders,
			}

			return <TableBodyCell key={group.groupId} {...props} />
		})
		.filter(Boolean)

	const cells = virtualColumns ?? row?.getVisibleCells?.() ?? []

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
					opacity: isDraggingRow ? 0.5 : 1,
					position: virtualRow ? 'absolute' : undefined,
					top: virtualRow ? 0 : undefined,
					transform: virtualRow
						? `translateY(${virtualRow?.start}px)`
						: undefined,
					transition: virtualRow ? 'none' : 'all 150ms ease-in-out',
					width: '100%',
					[`&.${tableRowClasses.hover}:hover`]: {
						backgroundColor: Colors.Gray10,
					},
					'&:hover td': {
						backgroundColor:
							tableRowProps?.hover !== false && getIsSomeColumnsPinned()
								? Colors.Gray10
								: undefined,
					},
					'&:first-child td * *': {
						borderTop: 'none',
					},
					...(tableRowProps?.sx instanceof Function
						? tableRowProps.sx(theme)
						: (tableRowProps?.sx as any)),
				})}
			>
				{groupedCells}
				{virtualPaddingLeft ? (
					<td style={{ display: 'flex', width: virtualPaddingLeft }} />
				) : null}
				{cells.map((cellOrVirtualCell, index) => {
					const groupBorders = getCellGroupBorders({
						table,
						rowIndex: getSubRowIndex({ row }) ?? rowIndex,
						colIndex: index,
						isGroupedColumn: false,
						isFirstOfGroup: !!groupingProps,
					})
					const cell = columnVirtualizer
						? row?.getVisibleCells?.()?.[
								(cellOrVirtualCell as VirtualItem).index
						  ]
						: (cellOrVirtualCell as Table_Cell)
					if (cell.getIsPlaceholder() && !isSummaryRow) {
						return null
					}
					if (collapsedColumnIndex !== undefined && !isSummaryRow)
						return <EmptyCell key={cell.id} groupBorders={groupBorders} />
					const props = {
						cell,
						enableHover: tableRowProps?.hover !== false,
						key: cell.id,
						measureElement: columnVirtualizer?.measureElement,
						numRows,
						row,
						rowIndex,
						rowNumber,
						rowRef,
						table,
						virtualCell: columnVirtualizer
							? (cellOrVirtualCell as VirtualItem)
							: undefined,
						isSummaryRowCell: isSummaryRow,
						groupBorders,
					}

					return memoMode === 'cells' &&
						cell.column.columnDef.columnDefType === 'data' &&
						!draggingColumn &&
						!draggingRows.length &&
						editingCell?.id !== cell.id &&
						editingRow?.id !== row.id ? (
						// eslint-disable-next-line react/jsx-pascal-case
						<Memo_TableBodyCell {...props} />
					) : (
						<TableBodyCell {...props} />
					)
				})}
				{virtualPaddingRight ? (
					<td style={{ display: 'flex', width: virtualPaddingRight }} />
				) : null}
			</MuiTableRow>
			{renderDetailPanel &&
				!row?.getIsGrouped?.() &&
				(collapsedColumnIndex === undefined ? (
					<TableDetailPanel
						parentRowRef={rowRef}
						row={row}
						table={table}
						virtualRow={virtualRow}
					/>
				) : (
					<tr />
				))}
		</>
	)
}

export const Memo_TableBodyRow = memo(
	TableBodyRow,
	(prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex
)
