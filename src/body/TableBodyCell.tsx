import Box from '@mui/material/Box'
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

import {
	ExpandByClick,
	type Table_Cell,
	type Table_ColumnDef,
	type TableInstance,
} from '..'
import { CopyButton } from '../buttons/CopyButton'
import { getCommonCellStyles, Table_DefaultColumn } from '../column.utils'
import { Colors } from '../components/styles'
import { EditCellTextField } from '../inputs/EditCellTextField'
import { utilColumns } from '../utilColumns'
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
			expandByClick,
			summaryRowCell,
			notClickableCells,
			icons: { ExpandMoreIcon },
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
	const { columnDefType, cellAction, cellActionIcon } = columnDef

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

	const openedDetailedPanels = table?.getState()?.openedDetailedPanels || {}

	const handleDragEnter = (e: DragEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDragEnter?.(e)
		if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
			setHoveredColumn(null)
		}
		if (enableColumnOrdering && draggingColumn) {
			setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
		}
	}

	const handleExpand = (
		event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLTableCellElement>
	) => {
		const isSellNotClickable = notClickableCells?.includes(cell.column.id)
		if (isSellNotClickable) {
			return
		}
		if (cellAction === 'expand') {
			const rowId = row.id
			const openedDetailedPanels = table.getState().openedDetailedPanels
			const isClicked = openedDetailedPanels?.[rowId]
			const isCurrentCellClicked =
				openedDetailedPanels?.[rowId]?.cell.id === cell.id

			const isOpenedPanelClicked = isClicked && isCurrentCellClicked

			if (isOpenedPanelClicked) {
				const filteredClickedCells = Object.keys(openedDetailedPanels).reduce(
					(acc, key) => {
						if (key !== rowId) {
							acc[key] = openedDetailedPanels[key]
						}

						return acc
					},
					{}
				)

				table.setOpenedDetailedPanels(filteredClickedCells)
			} else {
				table.setOpenedDetailedPanels({
					[rowId]: {
						cell,
						row,
					},
				})

				Object.values(openedDetailedPanels || {}).forEach((openedPanel) => {
					if (
						openedPanel?.cell.id !== cell.id &&
						openedPanel?.row.id !== rowId
					) {
						openedPanel.row.toggleExpanded()
					}
				})
			}

			if (openedDetailedPanels?.[rowId]?.cell.id === cell.id || !isClicked) {
				event.stopPropagation()
				row.toggleExpanded()
			}

			return
		}

		event.stopPropagation()
		row.toggleExpanded()
	}

	const handleExpandByClickOnCell = (
		event: MouseEvent<HTMLTableCellElement>
	) => {
		if (expandByClick !== ExpandByClick.Cell) {
			return
		}

		handleExpand(event)
	}

	const handleExpandByClickOnCellActionButton = (
		event: MouseEvent<HTMLButtonElement>
	) => {
		if (expandByClick !== ExpandByClick.CellAction) {
			return
		}

		handleExpand(event)
	}

	const isSelectCell = column.id === utilColumns.select
	const isAnyRowSelected = table.getSelectedRowModel().flatRows.length > 0
	const hideCheckBoxSpan = isSelectCell && !isAnyRowSelected

	const isCurrentCellClicked = openedDetailedPanels[row.id]?.cell.id === cell.id
	const isDettailedPanelExpanded =
		enableDetailedPanel &&
		Object.keys(openedDetailedPanels).includes(row.id) &&
		isCurrentCellClicked

	const getTableCellStyles = (theme) => ({
		alignItems: layoutMode === 'grid' ? 'center' : undefined,
		cursor: isEditable && editingMode === 'cell' ? 'pointer' : 'inherit',
		height: columnDefType === 'display' ? '1px' : '47px',
		boxSizing: 'content-box',
		overflow: 'hidden',
		verticalAlign: 'middle',
		position: 'relative',
		p: columnDefType === 'display' || isGroupedCell ? '0.5rem 0.75rem' : '0',
		px: 0,
		pl: column.id === utilColumns.expand ? `${row.depth + 0.75}rem` : undefined,
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
			'& > div > button': {
				visibility: 'visible',
			},
		},
		'tr:hover & span': {
			visibility: 'visible',
			transition: '0.2s ease-in-out',
		},
		'& span': {
			transition: 'visibility 0s',
			visibility: hideCheckBoxSpan ? 'hidden' : 'visible',
		},
		borderBottom: `1px solid ${Colors.Gray20}`,
		borderLeft:
			columnDef.enableDividerLeft && !isSummaryRowCell
				? `1px solid ${Colors.Gray20}`
				: 'none',
		borderRight:
			columnDef.enableDividerRight && !isSummaryRowCell
				? `1px solid ${Colors.Gray20}`
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
			onClick={handleExpandByClickOnCell}
			sx={(theme) => getTableCellStyles(theme)}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					mx: 'auto',
					width: `max(calc(100% - 1.4rem), ${Table_DefaultColumn.minSize}px)`,
				}}
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
				  column.id === utilColumns.numbers ? (
					rowIndex + 1
				) : column.id === utilColumns.drag ? (
					<TableBodyRowGrabHandle cell={cell} rowRef={rowRef} table={table} />
				) : columnDefType === 'display' &&
				  (column.id === utilColumns.select ||
						column.id === utilColumns.expand) ? (
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
				{cellAction === 'expand' ? (
					<IconButton
						sx={{
							width: '24px',
							height: '24px',
							border: '1px solid #E1E3EB',
							borderRadius: '4px',
							backgroundColor: '#F5F6FA',
							visibility: isDettailedPanelExpanded ? 'visible' : 'hidden',
						}}
						onClick={handleExpandByClickOnCellActionButton}
					>
						<>
							{cellActionIcon || (
								<ExpandMoreIcon
									sx={{
										transform: `rotate(${
											isDettailedPanelExpanded ? -180 : 0
										}deg)`,
										transition: 'transform 150ms',
									}}
								/>
							)}
						</>
					</IconButton>
				) : columnDef.cellAction instanceof Function ? (
					<IconButton
						sx={{
							width: '24px',
							height: '24px',
							border: '1px solid #E1E3EB',
							borderRadius: '4px',
							backgroundColor: '#F5F6FA',
							visibility: 'hidden',
						}}
						onClick={() =>
							cellAction instanceof Function && cellAction({ row, table })
						}
					>
						{cellActionIcon}
					</IconButton>
				) : null}
			</Box>
		</MuiTableCell>
	)
}

export const Memo_TableBodyCell = memo(
	TableBodyCell,
	(prev, next) => next.cell === prev.cell
)
