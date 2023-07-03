import { tableRowClasses } from '@mui/material'
import Box from '@mui/material/Box'
import React, { FC, memo, useMemo, useRef } from 'react'
import MuiTableRow from '@mui/material/TableRow'
import { lighten, useTheme } from '@mui/material/styles'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'

import type { Table_Cell, Table_Row, TableInstance } from '..'
import { getColumnId } from '../column.utils'
import { Colors } from '../components/styles'
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
			enableRowDragging,
			layoutMode,
			memoMode,
			muiTableBodyRowProps,
			renderDetailPanel,
			validateHoveredRow,
		},
		setHoveredRow,
	} = table
	const {
		draggingColumn,
		draggingRows,
		editingCell,
		editingRow,
		hoveredRow,
		grouping,
	} = getState()

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
		if (enableRowDragging && draggingRows.length > 0) {
			setHoveredRow(currentHoveredRow)
		}
	}

	const rowRef = useRef<HTMLTableRowElement | null>(null)

	const isDraggingRow = useMemo(
		() => draggingRows.some((dRow) => dRow?.id === row.id),
		[draggingRows, row.id]
	)
	const isHoveredRow = hoveredRow?.row?.id === row.id
	const canDragOver = useMemo(() => {
		if (!hoveredRow) return false

		return validateHoveredRow?.(hoveredRow, table) === true
	}, [isHoveredRow])

	const draggingBorder = useMemo(
		() =>
			isDraggingRow
				? `1px dashed ${theme.palette.text.secondary}`
				: isHoveredRow
				? `2px dashed ${theme.palette.primary.main}`
				: undefined,
		[isDraggingRow, hoveredRow]
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

	const cells = virtualColumns ?? row?.getVisibleCells?.() ?? []

	const getHoveredRowDropLine = (isTopLine: boolean) =>
		isHoveredRow ? (
			<tr>
				{isTopLine && grouping.length > 0 ? (
					<td colSpan={grouping.length} />
				) : null}
				<td
					colSpan={cells.length - grouping.length}
					style={{ position: 'relative' }}
				>
					<Box
						sx={{
							position: 'absolute',
							left: '0',
							right: '0',
							bottom: '0',
							zIndex: '1',
							background: canDragOver ? Colors.LightBlue : Colors.Gray20,
							height: '1px',
						}}
					/>
				</td>
			</tr>
		) : null

	return (
		<>
			{hoveredRow?.position === 'top' && getHoveredRowDropLine(true)}
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
				{cells.map((cellOrVirtualCell, colIndex) => {
					const cell = columnVirtualizer
						? row?.getVisibleCells?.()?.[
								(cellOrVirtualCell as VirtualItem).index
						  ]
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
			{hoveredRow?.position === 'bottom' && getHoveredRowDropLine(false)}
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
