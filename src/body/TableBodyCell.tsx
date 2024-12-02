import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import { lighten, useTheme } from '@mui/material/styles'
import MuiTableCell from '@mui/material/TableCell'
import type { VirtualItem } from '@tanstack/react-virtual'
import React, {
	DragEvent,
	HTMLProps,
	memo,
	MouseEvent,
	ReactElement,
	RefObject,
	useEffect,
	useMemo,
	useState,
} from 'react'
import { ControllerFieldState, useFormContext } from 'react-hook-form'

import {
	CellFormController,
	Colors,
	DEFAULT_EXPAND_PADDING,
	ErrorTooltipIconWithTable,
	ExpandByClick,
	type Table_Cell,
	type Table_Row,
	TableData,
	type TableInstance,
} from '..'
import { getCommonCellStyles, Table_DefaultColumn } from '../column.utils'
import { EditCellField } from '../inputs/EditCellField'
import { utilColumns } from '../utilColumns'
import { getColorAlpha } from '../utils/getColorAlpha'
import { getFunctionWithArgs } from '../utils/getFunctionWithArgs'
import { GroupBorders } from '../utils/getGroupBorders'
import { getIsMockRow } from '../utils/getIsMockRow'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { isEditingEnabled } from '../utils/isEditingEnabled'
import { mergeSx } from '../utils/mergeSx'

import { ExpandableColumnButton } from './ExpandableColumnButton'
import { TableBodyCellEditValue } from './TableBodyCellEditValue'
import { TableBodyCellUtility } from './TableBodyCellUtility'
import { TableBodyCellValue } from './TableBodyCellValue'

interface Props<TData = TableData> {
	cell: Table_Cell<TData>
	enableHover?: boolean
	measureElement?: (element: HTMLTableCellElement) => void
	numRows: number
	row: Table_Row<TData>
	rowHovered?: boolean
	rowIndex: number
	rowNumber: number
	rowRef: RefObject<HTMLTableRowElement>
	rowSpan?: HTMLProps<HTMLTableCellElement>['rowSpan']
	table: TableInstance<TData>
	virtualCell?: VirtualItem
	isSummaryRowCell?: boolean
	isGroupedCell?: boolean
	groupBorders?: GroupBorders
	fieldState?: ControllerFieldState
	isEditable?: boolean
	isEditing?: boolean
	isEditingTable?: boolean
}

const TableBodyCellMain = ({
	isGroupedCell,
	cell,
	enableHover,
	measureElement,
	numRows,
	row,
	rowIndex,
	rowNumber,
	rowRef,
	rowSpan,
	table,
	virtualCell,
	isSummaryRowCell,
	isEditable,
	isEditing,
	isEditingTable,
	groupBorders,
	fieldState,
}: Props) => {
	const theme = useTheme()
	const {
		constants: { expandableColumn },
		getState,
		options: {
			detailedRowBackgroundColor,
			detailPanelBorderColor,
			editingMode,
			enableColumnOrdering,
			enableGrouping,
			enableEditingHighlighting,
			enableRowNumbers,
			enableRowDragging,
			expandableColumnButtonPosition = 'left',
			layoutMode,
			mockRowStyles,
			muiTableBodyCellProps,
			muiTableBodyCellSkeletonProps,
			muiTableBodyCellWrapperProps,
			enableDetailedPanel,
			cellStyleRules,
			expandByClick,
			expandPaddingSize = DEFAULT_EXPAND_PADDING,
			summaryRowCell,
			notClickableCells,
			icons: { ExpandMoreIcon },
		},
		refs: { editInputRefs },
		setEditingCell,
		setHoveredColumn,
	} = table
	const { draggingColumn, hoveredColumn, isLoading, showSkeletons } = getState()
	const { column } = cell
	const { columnDef } = column
	const { columnDefType, cellAction, cellActionIcon } = columnDef

	const callFunctionWithDefaultArgs = getFunctionWithArgs({
		cell,
		column,
		row,
		table,
	})

	const mTableCellBodyProps = callFunctionWithDefaultArgs(
		getValueOrFunctionHandler(muiTableBodyCellProps)
	)
	const mcTableCellBodyProps = callFunctionWithDefaultArgs(
		getValueOrFunctionHandler(columnDef.muiTableBodyCellProps)
	)

	const tableCellProps = {
		...mTableCellBodyProps,
		...mcTableCellBodyProps,
	}

	const skeletonProps = callFunctionWithDefaultArgs(
		getValueOrFunctionHandler(muiTableBodyCellSkeletonProps)
	)
	const mWrapperProps = callFunctionWithDefaultArgs(
		getValueOrFunctionHandler(muiTableBodyCellWrapperProps)
	)
	const mcWrapperProps = callFunctionWithDefaultArgs(
		getValueOrFunctionHandler(columnDef.muiTableBodyCellWrapperProps)
	)
	const wrapperProps: BoxProps = {
		...mWrapperProps,
		...mcWrapperProps,
	}

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

	const handleDoubleClick = (event: MouseEvent<HTMLTableCellElement>) => {
		tableCellProps?.onDoubleClick?.(event)
		if (isEditable && editingMode === 'cell') {
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
			setHoveredColumn(
				columnDef.enableColumnOrdering !== false &&
					draggingColumn.getIsGrouped() === column.getIsGrouped() &&
					draggingColumn.getIsPinned() === column.getIsPinned()
					? column
					: null
			)
		}
	}

	const handleExpand = (
		event: MouseEvent<HTMLButtonElement> | MouseEvent<HTMLTableCellElement>
	) => {
		const isCellNotClickable = notClickableCells?.includes(cell.column.id)
		if (isCellNotClickable) {
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
				const filteredClickedCells = { ...openedDetailedPanels }
				delete filteredClickedCells[rowId]
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
		tableCellProps.onClick?.(event)
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

	const isUtilColumn = column.id === utilColumns.column
	const isExpandColumn = column.id === utilColumns.expand
	const isExpandableColumn =
		expandableColumn && expandableColumn.id === column.id
	const isExpandButtonRTL = expandableColumnButtonPosition === 'right'
	const isCurrentRowSelected = row.getIsSelected()
	const isAnyRowSelected = table.getSelectedRowModel().flatRows.length > 0
	const hideCheckBoxSpan =
		isUtilColumn &&
		(enableRowNumbers ? !isCurrentRowSelected : !isAnyRowSelected)
	const isDraggableCell =
		enableRowDragging instanceof Function
			? enableRowDragging(row)
			: enableRowDragging

	const isCurrentRowDetailOpened = !!openedDetailedPanels[row.id]
	const isCurrentCellDetailOpened =
		openedDetailedPanels[row.id]?.cell.id === cell.id
	const isDetailedPanelExpanded =
		enableDetailedPanel &&
		!!openedDetailedPanels[row.id] &&
		isCurrentCellDetailOpened

	const isMockCell =
		getIsMockRow(row) && !isGroupedCell && !isExpandColumn && !isUtilColumn

	const depthPaddingAttr =
		expandableColumnButtonPosition === 'right' ? 'pr' : 'pl'

	const getTableCellStyles = (theme) => ({
		alignItems: layoutMode === 'grid' ? 'center' : undefined,
		cursor: isEditable && editingMode === 'cell' ? 'pointer' : 'inherit',
		height: '47px',
		boxSizing: 'content-box',
		overflow: isGroupedCell ? 'unset' : 'hidden',
		verticalAlign: 'middle',
		position: 'relative',
		...(isMockCell ? mockRowStyles : {}),
		p: isGroupedCell ? '0.5rem 0.75rem' : '0',
		px: 0,
		[depthPaddingAttr]:
			isExpandColumn || isExpandableColumn
				? `${
						table.getRelativeDepth(row) * expandPaddingSize +
						(isExpandableColumn ? 24 : 0)
				  }px`
				: undefined,
		textOverflow: columnDefType !== 'display' ? 'ellipsis' : undefined,
		whiteSpace: 'normal',
		zIndex: draggingColumn?.id === column.id ? 2 : column.getIsPinned() ? 1 : 0,
		'&:hover': {
			...(isExpandColumn
				? {
						zIndex: 2,
						overflow: 'visible',
				  }
				: {}),
			backgroundColor:
				enableHover && isEditable && editingMode === 'cell'
					? theme.palette.mode === 'dark'
						? `${lighten(theme.palette.background.default, 0.2)} !important`
						: `${getColorAlpha(Colors.Gray90, 0.05)} !important`
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
		...(fieldState?.isDirty && enableEditingHighlighting
			? { backgroundColor: Colors.Yellow }
			: {}),
		...draggingBorders,
		...(isCurrentRowDetailOpened
			? {
					borderBottom: `1px solid ${detailPanelBorderColor}`,
			  }
			: {}),
		...(isCurrentCellDetailOpened
			? {
					borderTop: `1px solid ${detailPanelBorderColor}`,
					borderLeft: `1px solid ${detailPanelBorderColor}`,
					borderRight: `1px solid ${detailPanelBorderColor}`,
					borderBottom: 'none',
					backgroundColor: detailedRowBackgroundColor,
			  }
			: {}),
		...(cellStyleRules?.[cell.column.id]?.executeStyleCondition?.({
			cell,
			row,
			column,
			table,
			isCurrentCellClicked: isCurrentCellDetailOpened,
			isCurrentRowDetailOpened,
			isEditing,
		}) || {}),
		...columnDef.getTableCellSx?.({
			cell,
			row,
			column,
			table,
			isCurrentCellClicked: isCurrentCellDetailOpened,
			isCurrentRowDetailOpened,
			isEditing,
		}),
	})

	if (isSummaryRowCell && summaryRowCell) {
		return summaryRowCell({
			table,
			column,
			defaultStyles: getTableCellStyles(theme),
		}) as ReactElement
	}

	const cellActionButton =
		cellAction === 'expand' ? (
			<IconButton
				sx={{
					width: '24px',
					height: '24px',
					border: '1px solid #E1E3EB',
					borderRadius: '4px',
					backgroundColor: '#F5F6FA',
					visibility: isDetailedPanelExpanded ? 'visible' : 'hidden',
				}}
				onClick={handleExpandByClickOnCellActionButton}
			>
				<>
					{cellActionIcon || (
						<ExpandMoreIcon
							sx={{
								transform: `rotate(${isDetailedPanelExpanded ? -180 : 0}deg)`,
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
		) : null

	return (
		<MuiTableCell
			rowSpan={rowSpan}
			data-index={virtualCell?.index}
			data-is-grouped={isGroupedCell}
			data-is-util={isUtilColumn}
			ref={measureElement}
			{...tableCellProps}
			onDragEnter={handleDragEnter}
			onDoubleClick={handleDoubleClick}
			onClick={handleExpandByClickOnCell}
			sx={(theme) => getTableCellStyles(theme)}
		>
			<Box
				{...wrapperProps}
				sx={mergeSx(
					{
						display: 'flex',
						alignItems: 'center',
						mx: 'auto',
						width: isUtilColumn
							? '100%'
							: `max(calc(100% - ${isEditing ? `6px` : `1.4rem`}), ${
									Table_DefaultColumn.minSize
							  }px)`,
					},
					wrapperProps.sx
				)}
			>
				{isExpandableColumn && !isExpandButtonRTL && (
					<ExpandableColumnButton row={row} table={table} />
				)}
				{isGroupedCell ? (
					<TableBodyCellValue cell={cell} row={row} table={table} />
				) : isLoading || showSkeletons ? (
					<Skeleton
						animation="wave"
						height={20}
						width={skeletonWidth}
						{...skeletonProps}
					/>
				) : isUtilColumn ? (
					<TableBodyCellUtility
						table={table}
						cell={cell}
						isDraggableCell={isDraggableCell}
						isCurrentRowSelected={isCurrentRowSelected}
						rowRef={rowRef}
						rowNumber={rowNumber}
						enableRowNumbers={enableRowNumbers}
					/>
				) : isEditing && !isMockCell ? (
					<EditCellField cell={cell} table={table} />
				) : isEditingTable ? (
					<TableBodyCellEditValue cell={cell} table={table} />
				) : (
					<TableBodyCellValue cell={cell} table={table} row={row} />
				)}
				{isGroupedCell ? null : cellActionButton}
				{isExpandableColumn && isExpandButtonRTL && (
					<ExpandableColumnButton row={row} table={table} position="right" />
				)}
				{fieldState?.error && !isEditing && (
					<Box sx={{ ml: 'auto', mr: '-8px' }}>
						<ErrorTooltipIconWithTable error={fieldState.error.message} />
					</Box>
				)}
			</Box>
		</MuiTableCell>
	)
}

const TableBodyCellEditable = (props: Props) => {
	const { table, row, cell, isGroupedCell } = props
	const {
		options: { editingMode },
	} = table
	const { isEditingTable, editingCell, editingRow } = table.getState()
	const { getValues } = useFormContext()

	const isNewRow = table.getIsNewRow(row)

	const isEditing =
		isNewRow ||
		(!isGroupedCell &&
			// if editingCell state is provided, it should be higher priority, than any config
			(editingCell?.id === cell.id ||
				(editingMode !== 'modal' && editingRow?.id === row.id)))

	if ((!isEditing && !isEditingTable) || getValues(row.id) === undefined) {
		return <TableBodyCellMain {...props} />
	}

	return (
		<CellFormController
			cell={props.cell}
			render={({ fieldState }) => (
				<TableBodyCellMain
					{...props}
					fieldState={fieldState}
					isEditing={isEditing}
					isEditingTable={isEditingTable}
				/>
			)}
		/>
	)
}

export const TableBodyCell = (props: Props) => {
	const { cell, table, row } = props
	const { column } = cell
	const { columnDef } = column
	const { enableEditing: cEnableEditing } = columnDef
	const {
		options: { enableEditing },
	} = table

	const isEditable = useMemo(
		() =>
			!row.isMock &&
			(cEnableEditing !== undefined
				? isEditingEnabled(cEnableEditing, { table, row })
				: isEditingEnabled(enableEditing, { table, row })),
		[table, row, cEnableEditing, enableEditing]
	)

	if (isEditable) {
		return <TableBodyCellEditable {...props} isEditable />
	}

	return <TableBodyCellMain {...props} />
}

export const Memo_TableBodyCell = memo(
	TableBodyCell,
	(prev, next) => next.cell === prev.cell
)
