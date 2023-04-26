import React, {
	DragEvent,
	FC,
	memo,
	MouseEvent,
	RefObject,
	useEffect,
	useMemo,
	useState,
} from 'react'
import Skeleton from '@mui/material/Skeleton'
import MuiTableCell from '@mui/material/TableCell'
import { darken, lighten, useTheme } from '@mui/material/styles'
import type { VirtualItem } from '@tanstack/react-virtual'

import { ExpandButton } from '../buttons/ExpandButton'
import { EditCellTextField } from '../inputs/EditCellTextField'
import { CopyButton } from '../buttons/CopyButton'
import { getGroupBorders } from '../utils/getGroupBorders'
import { getCommonCellStyles } from '../column.utils'
import type { Table_Cell, TableInstance } from '..'
import { getVisibleLeafRows } from '../utils/getVisibleLeafRows'

import { TableBodyRowGrabHandle } from './TableBodyRowGrabHandle'
import { TableBodyCellValue } from './TableBodyCellValue'

interface Props {
	cell: Table_Cell
	enableHover?: boolean
	measureElement?: (element: HTMLTableCellElement) => void
	numRows: number
	rowIndex: number
	rowRef: RefObject<HTMLTableRowElement>
	table: TableInstance
	virtualCell?: VirtualItem
}

export const TableBodyCell: FC<Props> = ({
	cell,
	enableHover,
	measureElement,
	numRows,
	rowIndex,
	rowRef,
	table,
	virtualCell,
}) => {
	const theme = useTheme()
	const {
		getState,
		options: {
			editingMode,
			enableAggregationRow,
			enableClickToCopy,
			enableColumnOrdering,
			enableEditing,
			enableGrouping,
			enableRowNumbers,
			layoutMode,
			muiTableBodyCellProps,
			muiTableBodyCellSkeletonProps,
			rowNumberMode,
		},
		refs: { editInputRefs },
		setEditingCell,
		setHoveredColumn,
	} = table
	const {
		draggingColumn,
		editingCell,
		editingRow,
		hoveredColumn,
		isLoading,
		showSkeletons,
	} = getState()
	const { column, row } = cell
	const { columnDef } = column
	const { columnDefType } = columnDef

	const mTableCellBodyProps =
		muiTableBodyCellProps instanceof Function
			? muiTableBodyCellProps({ cell, column, row, table })
			: muiTableBodyCellProps

	const mcTableCellBodyProps =
		columnDef.muiTableBodyCellProps instanceof Function
			? columnDef.muiTableBodyCellProps({ cell, column, row, table })
			: columnDef.muiTableBodyCellProps

	const tableCellProps = {
		...mTableCellBodyProps,
		...mcTableCellBodyProps,
	}

	const skeletonProps =
		muiTableBodyCellSkeletonProps instanceof Function
			? muiTableBodyCellSkeletonProps({ cell, column, row, table })
			: muiTableBodyCellSkeletonProps

	const [skeletonWidth, setSkeletonWidth] = useState(0)
	useEffect(
		() =>
			setSkeletonWidth(
				isLoading || showSkeletons
					? columnDefType === 'display'
						? column.getSize() / 2
						: Math.round(
								Math.random() * (column.getSize() - column.getSize() / 3) +
									column.getSize() / 3
						  )
					: 100
			),
		[]
	)

	const draggingBorder = useMemo(
		() =>
			draggingColumn?.id === column.id
				? `1px dashed ${theme.palette.text.secondary}`
				: hoveredColumn?.id === column.id
				? `2px dashed ${theme.palette.primary.main}`
				: undefined,
		[draggingColumn, hoveredColumn]
	)

	const draggingBorders = useMemo(
		() =>
			draggingBorder
				? {
						borderLeft: draggingBorder,
						borderRight: draggingBorder,
						borderBottom: rowIndex === numRows - 1 ? draggingBorder : undefined,
				  }
				: undefined,
		[draggingBorder, numRows]
	)

	const isEditable =
		(enableEditing || columnDef.enableEditing) &&
		columnDef.enableEditing !== false

	const isEditing =
		isEditable &&
		editingMode !== 'modal' &&
		(editingMode === 'table' ||
			editingRow?.id === row.id ||
			editingCell?.id === cell.id) &&
		!row.getIsGrouped()

	const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDoubleClick?.(event)
		if (
			(enableEditing || columnDef.enableEditing) &&
			columnDef.enableEditing !== false &&
			editingMode === 'cell'
		) {
			setEditingCell(cell)
			queueMicrotask(() => {
				const textField = editInputRefs.current[column.id]
				if (textField) {
					textField.focus()
					textField.select?.()
				}
			})
		}
	}

	const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDragEnter?.(e)
		if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
			setHoveredColumn(null)
		}
		if (enableColumnOrdering && draggingColumn) {
			setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
		}
	}

	if (!enableAggregationRow && row.getIsGrouped() && !cell.getIsGrouped()) {
		return null
	}
	if (!enableAggregationRow && !row.getIsGrouped() && column.getIsGrouped()) {
		return null
	}
	const isGroupedCell =
		!enableAggregationRow && row.getIsGrouped() && cell.getIsGrouped()

	const rowSpan =
		!enableAggregationRow && row.getIsGrouped()
			? getVisibleLeafRows(row, table).length
			: 1

	const isSelectCell = column.id === 'mrt-row-select'
	const isAnyRowSelected = table.getSelectedRowModel().rows.length > 0
	const hideCheckBoxSpan = isSelectCell && !isAnyRowSelected

	return (
		<MuiTableCell
			rowSpan={rowSpan}
			data-index={virtualCell?.index}
			ref={(node: HTMLTableCellElement) => {
				if (node) {
					measureElement?.(node)
				}
			}}
			{...tableCellProps}
			onDragEnter={handleDragEnter}
			onDoubleClick={handleDoubleClick}
			sx={(theme) => ({
				alignItems: layoutMode === 'grid' ? 'center' : undefined,
				cursor: isEditable && editingMode === 'cell' ? 'pointer' : 'inherit',
				height: columnDefType === 'display' ? '1px' : '48px',
				boxSizing: 'border-box',
				overflow: 'hidden',
				verticalAlign: 'middle',
				position: 'relative',
				p:
					columnDefType === 'display' || isGroupedCell
						? '0.5rem 0.75rem'
						: '0rem',
				px: columnDefType === 'display' ? '0.5rem 0.75rem' : '0.75rem',
				pl:
					column.id === 'mrt-row-expand' ? `${row.depth + 0.75}rem` : undefined,
				textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined,
				whiteSpace: 'normal',
				zIndex:
					draggingColumn?.id === column.id ? 2 : column.getIsPinned() ? 1 : 0,
				'&:hover': {
					backgroundColor:
						enableHover &&
						enableEditing &&
						columnDef.enableEditing !== false &&
						['table', 'cell'].includes(editingMode ?? '')
							? theme.palette.mode === 'dark'
								? `${lighten(theme.palette.background.default, 0.2)} !important`
								: `${darken(theme.palette.background.default, 0.1)} !important`
							: undefined,
					'& span': {
						visibility: 'visible',
					},
				},
				'& span': {
					visibility: hideCheckBoxSpan ? 'hidden' : 'visible',
				},
				...getGroupBorders({ table, cell }),
				...getCommonCellStyles({
					column,
					table,
					theme,
					tableCellProps,
				}),
				...draggingBorders,
			})}
		>
			{enableAggregationRow && cell.getIsGrouped() && (
				<ExpandButton row={row} table={table} />
			)}
			<>
				{cell.getIsPlaceholder() && enableAggregationRow ? null : isLoading ||
				  showSkeletons ? (
					<Skeleton
						animation="wave"
						height={20}
						width={skeletonWidth}
						{...skeletonProps}
					/>
				) : enableRowNumbers &&
				  rowNumberMode === 'static' &&
				  column.id === 'mrt-row-numbers' ? (
					rowIndex + 1
				) : column.id === 'mrt-row-drag' ? (
					<TableBodyRowGrabHandle cell={cell} rowRef={rowRef} table={table} />
				) : columnDefType === 'display' &&
				  (column.id === 'mrt-row-select' ||
						column.id === 'mrt-row-expand' ||
						!row.getIsGrouped()) ? (
					columnDef.Cell?.({ cell, column, row, table })
				) : isEditing ? (
					<EditCellTextField cell={cell} table={table} />
				) : (enableClickToCopy || columnDef.enableClickToCopy) &&
				  columnDef.enableClickToCopy !== false ? (
					<CopyButton cell={cell} table={table}>
						<TableBodyCellValue cell={cell} table={table} />
					</CopyButton>
				) : (
					<TableBodyCellValue cell={cell} table={table} />
				)}
			</>
		</MuiTableCell>
	)
}

export const Memo_TableBodyCell = memo(
	TableBodyCell,
	(prev, next) => next.cell === prev.cell
)
