import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import { darken, lighten, useTheme } from '@mui/material/styles'
import MuiTableCell from '@mui/material/TableCell'
import type { VirtualItem } from '@tanstack/react-virtual'
import React, {
	DragEvent,
	FC,
	HTMLProps,
	memo,
	MouseEvent,
	ReactElement,
	RefObject,
	useEffect,
	useMemo,
	useState,
} from 'react'

import type { Table_Cell, Table_ColumnDef, TableInstance } from '..'
import { CopyButton } from '../buttons/CopyButton'
import { getCommonCellStyles } from '../column.utils'
import { ConditionalBox } from '../components/ConditionalBox'
import { Colors } from '../components/styles'
import { EditCellTextField } from '../inputs/EditCellTextField'
import { GroupBorders } from '../utils/getGroupBorders'

import { TableBodyCellValue } from './TableBodyCellValue'
import { TableBodyRowGrabHandle } from './TableBodyRowGrabHandle'

interface Props {
	cell: Table_Cell
	enableHover?: boolean
	measureElement?: (element: HTMLTableCellElement) => void
	numRows: number
	rowIndex: number
	rowRef: RefObject<HTMLTableRowElement>
	rowSpan?: HTMLProps<HTMLTableCellElement>['rowSpan']
	table: TableInstance
	virtualCell?: VirtualItem
	isSummaryRowCell?: boolean
	isGroupedCell?: boolean
	groupBorders?: GroupBorders
}

export const TableBodyCell: FC<Props> = ({
	isGroupedCell,
	cell,
	enableHover,
	measureElement,
	numRows,
	rowIndex,
	rowRef,
	rowSpan,
	table,
	virtualCell,
	isSummaryRowCell,
	groupBorders,
}) => {
	const theme = useTheme()
	const {
		getState,
		options: {
			editingMode,
			enableClickToCopy,
			enableColumnOrdering,
			enableEditing,
			enableGrouping,
			enableRowNumbers,
			layoutMode,
			muiTableBodyCellProps,
			muiTableBodyCellSkeletonProps,
			rowNumberMode,
			enableDetailedPanel,
			cellStyleRules,
			notClickableCells,
			summaryRowCell,
			icons: { ExpandIcon, ExpandMoreIcon },
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
		!row?.getIsGrouped?.()

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

	const clickedCells = table?.getState()?.clickedCells || []

	const closeClickedCell = (cellToRemove: Table_Cell) => {
		cellToRemove.row.toggleExpanded()

		table.setClickedCells([
			...clickedCells.filter(
				(clickedCell) => clickedCell?.id !== cellToRemove.id
			),
		])
	}

	const openClickedCell = (
		cellToOpen: Table_Cell,
		isPanelExpanded: boolean
	) => {
		if (!isPanelExpanded) {
			cellToOpen.row.toggleExpanded()
		}

		table.setClickedCells([...clickedCells, cellToOpen])
	}

	const handleSingleClick = () => {
		if (!enableDetailedPanel) {
			return
		}

		const columnId = cell?.column?.id
		const isNotClickableCell =
			Array.isArray(notClickableCells) && notClickableCells?.includes(columnId)

		if (isNotClickableCell) {
			return
		}

		const cellId = cell?.id
		const rowId = cell?.row?.id
		const isPanelExpanded = cell?.row?.getIsExpanded?.()

		const isCellClicked = clickedCells.some(
			(clickedCell) => clickedCell?.id === cellId
		)

		if (isCellClicked) {
			closeClickedCell(cell)

			return
		}

		const anotherClickedCellInRow = clickedCells.find(
			(clickedCell) => clickedCell?.row.id === rowId
		)

		if (anotherClickedCellInRow?.id) {
			table.setClickedCells([
				...clickedCells.filter(
					(clickedCell) => clickedCell?.id !== anotherClickedCellInRow.id
				),
				cell,
			])

			anotherClickedCellInRow.row.toggleExpanded()
			cell.row.toggleExpanded()

			return
		}

		openClickedCell(cell, isPanelExpanded)
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

	const handleExpand = (event: MouseEvent<HTMLButtonElement>) => {
		if (columnDef.cellAction === 'expand') {
			const rowId = row.id
			const clickedCells = table.getState().clickedCells

			if (clickedCells?.length) {
				const filteredClickedCells = clickedCells.filter(
					(cell) => cell.row.id !== rowId
				)

				table.setClickedCells(filteredClickedCells)
			}
		}

		event.stopPropagation()
		row.toggleExpanded()
	}

	const isSelectCell = column.id === 'mrt-row-select'
	const isAnyRowSelected = table.getSelectedRowModel().flatRows.length > 0
	const hideCheckBoxSpan = isSelectCell && !isAnyRowSelected
	const isRowExpanded = row?.getIsExpanded?.()

	const isCurrentCellClicked =
		enableDetailedPanel &&
		clickedCells.some((clickedCell) => {
			return clickedCell?.id === cell?.id
		})

	const getTableCellStyles = (theme) => ({
		alignItems: layoutMode === 'grid' ? 'center' : undefined,
		cursor: isEditable && editingMode === 'cell' ? 'pointer' : 'inherit',
		height: columnDefType === 'display' ? '1px' : '48px',
		boxSizing: 'border-box',
		overflow: 'hidden',
		verticalAlign: 'middle',
		position: 'relative',
		p: columnDefType === 'display' || isGroupedCell ? '0.5rem 0.75rem' : '0rem',
		px: columnDefType === 'display' ? '0.5rem 0.75rem' : '0.75rem',
		pl: column.id === 'mrt-row-expand' ? `${row.depth + 0.75}rem` : undefined,
		textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined,
		whiteSpace: 'normal',
		zIndex: draggingColumn?.id === column.id ? 2 : column.getIsPinned() ? 1 : 0,
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
			'& > div > button': {
				visibility: 'visible',
			},
		},
		'& span': {
			visibility: hideCheckBoxSpan ? 'hidden' : 'visible',
		},
		borderBottom: `1px solid ${Colors.Lightgray}`,
		borderLeft:
			columnDef.enableDividerLeft && !isSummaryRowCell
				? `1px solid ${Colors.Lightgray}`
				: 'none',
		borderRight:
			columnDef.enableDividerRight && !isSummaryRowCell
				? `1px solid ${Colors.Lightgray}`
				: 'none',
		...groupBorders,
		...getCommonCellStyles({
			column,
			table,
			theme,
			tableCellProps,
		}),
		...draggingBorders,
		...(cellStyleRules?.[cell.column.id]?.executeStyleCondition?.({
			cell,
			row,
			column,
			table,
			isCurrentCellClicked,
		}) || {}),
		...columnDef.getTableCellSx?.({
			cell,
			row,
			column,
			table,
			isCurrentCellClicked,
		}),
	})

	if (isSummaryRowCell && summaryRowCell) {
		return summaryRowCell({
			table,
			column: column as Table_ColumnDef,
			defaultStyles: getTableCellStyles(theme),
		}) as ReactElement
	}

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
			onClick={handleSingleClick}
			sx={(theme) => getTableCellStyles(theme)}
		>
			<ConditionalBox
				condition={!!columnDef.cellAction}
				sx={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}
			>
				{isGroupedCell ? (
					<TableBodyCellValue cell={cell} table={table} />
				) : cell.getIsPlaceholder() ? null : isLoading || showSkeletons ? (
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
				  (column.id === 'mrt-row-select' || column.id === 'mrt-row-expand') ? (
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
				{columnDef?.cellAction === 'expand' ? (
					<IconButton
						sx={{
							width: '24px',
							height: '24px',
							border: '1px solid #E1E3EB',
							borderRadius: '4px',
							backgroundColor: '#F5F6FA',
							visibility: isRowExpanded ? 'visible' : 'hidden',
						}}
						onClick={handleExpand}
					>
						<ExpandMoreIcon
							sx={{
								transform: `rotate(${isRowExpanded ? -180 : 0}deg)`,
								transition: 'transform 150ms',
							}}
						/>
					</IconButton>
				) : columnDef?.cellAction &&
				  typeof columnDef.cellAction === 'function' ? (
					<IconButton
						sx={{
							width: '24px',
							height: '24px',
							border: '1px solid #E1E3EB',
							borderRadius: '4px',
							backgroundColor: '#F5F6FA',
							visibility: 'hidden',
						}}
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						onClick={() => columnDef.cellAction({ row, table })}
					>
						<ExpandIcon />
					</IconButton>
				) : null}
			</ConditionalBox>
		</MuiTableCell>
	)
}

export const Memo_TableBodyCell = memo(
	TableBodyCell,
	(prev, next) => next.cell === prev.cell
)
