import { tableRowClasses } from '@mui/material'
import { noop } from '@tanstack/react-table'
import {
	FC,
	memo,
	SyntheticEvent,
	useCallback,
	useMemo,
	useRef,
	useEffect,
} from 'react'
import MuiTableRow from '@mui/material/TableRow'
import { lighten } from '@mui/material/styles'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'
import { useResizeDetector } from 'react-resize-detector'

import { CreateNewRow } from '../buttons/CreateNewRow'
import { ColumnVirtualizerWrapper } from '../components/ColumnVirtualizerWrapper'
import { EditingRowActionButtons } from '../components/EditingRowActionButtons'
import { EmptyCell } from '../components/EmptyCell'
import { useComputedMeasureElement } from '../hooks/useComputedMeasureElement'
import { getCellGroupBorders } from '../utils/getGroupBorders'
import { getCellsFilteredByDisplay } from '../utils/getFilteredByDisplay'
import type { Table_Cell, Table_Row, TableData, TableInstance } from '..'
import { getColumnId } from '../column.utils'
import { Colors } from '../components/styles'
import { getIsMockRow } from '../utils/getIsMockRow'
import { getSubRowIndex } from '../utils/getSubRowIndex'
import { setHoveredRow } from '../utils/setHoveredRow'
import { sortMappedVirtualCells } from '../utils/sortColumns'
import { mapVirtualItems } from '../utils/virtual'

import { Memo_TableBodyCell, TableBodyCell } from './TableBodyCell'
import { TableDetailPanel } from './TableDetailPanel'

export interface TableBodyRowProps<TData extends TableData = TableData> {
	columnVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableCellElement>
	domIndex: number
	measureElement?: (element: HTMLTableRowElement) => void
	numRows: number
	row: Table_Row<TData>
	rowIndex: number
	rowNumber: number
	table: TableInstance<TData>
	virtualColumns?: VirtualItem[]
	virtualRow?: VirtualItem
	isSummaryRow?: boolean
	groupingProps?: {
		groupId: string
		columnIndex: number
		columnId: string
		count: number
	}[]
}

export const TableBodyRow: FC<TableBodyRowProps> = (props) => {
	const {
		columnVirtualizer,
		isSummaryRow = false,
		measureElement,
		numRows,
		row,
		rowIndex,
		rowNumber,
		table,
		virtualColumns,
		virtualRow,
		groupingProps,
	} = props
	const {
		getIsSomeColumnsPinned,
		getState,
		options: {
			enableCreateNewRow,
			enableExpanding,
			enableRowDragging,
			enableTableHead,
			editingMode,
			layoutMode,
			memoMode,
			muiTableBodyRowProps,
			renderDetailPanel,
		},
		refs: { rowDragEnterTimeoutRef, expandRowTimeoutRef },
	} = table
	const {
		draggingColumn,
		draggingRows,
		editingCell,
		editingRow,
		columnVisibility,
		openedDetailedPanels,
		hoveredRow,
	} = getState()
	const isEditingRow = !!editingRow && editingRow?.id === row.id
	const isNewRow = table.getIsNewRow(row)
	const isMockRow = getIsMockRow(row)

	const tableRowProps =
		muiTableBodyRowProps instanceof Function
			? muiTableBodyRowProps({ row, table })
			: muiTableBodyRowProps ?? {}

	const rowRef = useRef<HTMLTableRowElement | null>(null)
	const panelRef = useRef<HTMLTableRowElement | null>(null)
	const lastDragPositionRef = useRef({ x: 0, y: 0 })

	const isDraggingRow = draggingRows.some((dRow) => dRow?.id === row.id)
	const isHoveredRow = row.id === hoveredRow?.row?.id

	const newHoveredRow = useMemo(
		() => ({
			row,
			position: 'bottom' as const,
		}),
		[row]
	)

	const handleDragEnter = useCallback(() => {
		clearTimeout(rowDragEnterTimeoutRef.current)
		clearTimeout(expandRowTimeoutRef.current)
		if (isHoveredRow) return
		rowDragEnterTimeoutRef.current = setTimeout(() => {
			if (isMockRow || isDraggingRow) {
				setHoveredRow(table)(null)

				return
			}
			if (enableRowDragging && draggingRows.length > 0) {
				setHoveredRow(table)({ ...newHoveredRow, rowRef })
			}
		}, 500)
		if (enableExpanding && row.getCanExpand() && !row.getIsExpanded()) {
			expandRowTimeoutRef.current = setTimeout(() => {
				row.toggleExpanded(true)
			}, 1500)
		}
	}, [
		rowDragEnterTimeoutRef,
		expandRowTimeoutRef,
		isHoveredRow,
		enableExpanding,
		row,
		isMockRow,
		isDraggingRow,
		enableRowDragging,
		draggingRows.length,
		table,
		newHoveredRow,
	])

	const handleDragMove = useCallback(
		(e: SyntheticEvent<HTMLTableRowElement, DragEvent>) => {
			if (!hoveredRow || !isHoveredRow || !rowRef.current) return
			const asChildOffset = rowRef.current.getBoundingClientRect().bottom - 20
			const asChild = e.nativeEvent.clientY > asChildOffset
			if (!!hoveredRow.asChild === asChild) return
			setHoveredRow(table)({ ...hoveredRow, asChild })
		},
		[hoveredRow, isHoveredRow, table]
	)
	const handleDragOver = useCallback(
		(e: SyntheticEvent<HTMLTableRowElement, DragEvent>) => {
			const { x: lastX, y: lastY } = lastDragPositionRef.current
			const { x, y } = e.nativeEvent
			const deltaX = x - lastX
			const deltaY = y - lastY
			if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
				handleDragMove(e)
			}
			lastDragPositionRef.current.x = e.nativeEvent.clientX
			lastDragPositionRef.current.y = e.nativeEvent.clientY
		},
		[handleDragMove]
	)

	const { collapsedColumnIndex } = row
	const getGroupedCell = useCallback(
		(cell: Table_Cell, virtualCell?: VirtualItem) => {
			const groupIndex = (groupingProps ?? []).findIndex(
				(group) => group?.columnId === getColumnId(cell.column)
			)
			const group = groupingProps?.[groupIndex]
			if (!group || !groupingProps) return null
			// There could be an extra row for the detail panel
			// There could be an extra row to create new row
			const rowSpan =
				group.count *
				(1 + (renderDetailPanel ? 1 : 0) + (enableCreateNewRow ? 1 : 0))
			const groupBorders = getCellGroupBorders({
				table,
				isFirstOfGroup: true,
				isGroupedColumn: true,
				rowIndex: getSubRowIndex({ row }) ?? rowIndex,
				colIndex: group.columnIndex,
			})
			if (
				collapsedColumnIndex !== undefined &&
				collapsedColumnIndex < groupIndex
			) {
				return (
					<EmptyCell
						key={group.groupId}
						groupBorders={groupBorders}
						isGroupedCell
						isLastGroupedColumn={groupIndex === groupingProps.length - 1}
					/>
				)
			}
			const props = {
				cell,
				enableHover: false,
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
				virtualCell,
			}

			return <TableBodyCell key={group.groupId} {...props} />
		},
		[
			collapsedColumnIndex,
			groupingProps,
			isSummaryRow,
			enableCreateNewRow,
			numRows,
			renderDetailPanel,
			row,
			rowIndex,
			rowNumber,
			table,
		]
	)

	const cells = sortMappedVirtualCells(
		mapVirtualItems(
			getCellsFilteredByDisplay(row?.getVisibleCells()),
			virtualColumns
		)
	)

	const computedMeasureElement = useComputedMeasureElement(measureElement)

	// handle resize of detailed panel, if row virtualization is enabled
	useResizeDetector({
		targetRef: panelRef,
		handleWidth: false,
		handleHeight: !!measureElement && !!renderDetailPanel,
		onResize: useCallback(
			(_, height) => {
				if (rowRef.current) {
					computedMeasureElement?.(rowRef.current, (el) => {
						if (!height || !el) return null

						return el.getBoundingClientRect().height + height
					})
				}
			},
			[computedMeasureElement]
		),
		refreshMode: 'debounce',
	})

	// handle row's detail panel collapse when corresponding column is being hidden
	useEffect(() => {
		const isRowCellHidden = () => {
			const expandedCell = openedDetailedPanels?.[row.id].cell.column.id

			return expandedCell && columnVisibility[expandedCell] === false
		}

		if (row.getIsExpanded?.()) {
			if (isRowCellHidden()) {
				const filteredClickedCells = { ...openedDetailedPanels }
				delete filteredClickedCells[row.id]
				table.setOpenedDetailedPanels(filteredClickedCells)
				row.toggleExpanded(false)
			}
		}
	}, [columnVisibility])

	return (
		<>
			<EditingRowActionButtons
				open={(isEditingRow && editingMode === 'row') || isNewRow}
				table={table}
				row={row}
			>
				{({ ref }) => (
					<MuiTableRow
						data-index={virtualRow?.index}
						hover
						selected={row.getIsSelected()}
						onDragEnter={!isHoveredRow ? handleDragEnter : noop}
						onDragOver={enableExpanding && isHoveredRow ? handleDragOver : noop}
						ref={(node: HTMLTableRowElement) => {
							if (node) {
								ref(node)
								rowRef.current = node
								if (!renderDetailPanel) {
									measureElement?.(node)
								}
							}
						}}
						{...tableRowProps}
						sx={(theme) => ({
							backgroundColor: lighten(theme.palette.background.default, 0.06),
							display: layoutMode === 'grid' ? 'flex' : 'table-row',
							alignItems: 'center',
							opacity: isDraggingRow ? 0.5 : 1,
							width: '100%',
							[`&.${tableRowClasses.hover}:hover`]: {
								backgroundColor: Colors.Gray10,
							},
							...(isMockRow
								? {
										backgroundColor: Colors.LightestGray,
								  }
								: {}),
							'&:hover td': {
								backgroundColor:
									tableRowProps?.hover !== false && getIsSomeColumnsPinned()
										? Colors.Gray10
										: undefined,
							},
							...(tableRowProps?.sx instanceof Function
								? tableRowProps.sx(theme)
								: (tableRowProps?.sx as any)),
						})}
					>
						<ColumnVirtualizerWrapper>
							{cells.map(([cell, virtualCell], index) => {
								if (table.getIsNewRow(row) && cell.column.getIsGrouped())
									return null
								if (cell.getIsPlaceholder() && !isSummaryRow)
									return getGroupedCell(cell, virtualCell)
								const groupBorders = getCellGroupBorders({
									table,
									rowIndex: getSubRowIndex({ row }) ?? rowIndex,
									colIndex: index,
									isGroupedColumn: false,
									isFirstOfGroup: !!groupingProps,
								})

								if (collapsedColumnIndex !== undefined && !isSummaryRow) {
									if (cell.column.columnDef.GroupedCellCollapsedContent) {
										return (
											<td
												key={cell.id}
												style={{ position: 'relative', ...groupBorders }}
											>
												{cell.column.columnDef.GroupedCellCollapsedContent({
													table,
													row,
													cell,
												})}
											</td>
										)
									}

									return <EmptyCell key={cell.id} groupBorders={groupBorders} />
								}

								const props = {
									cell,
									enableHover: tableRowProps?.hover !== false,
									key: cell.id,
									measureElement: !enableTableHead
										? columnVirtualizer?.measureElement
										: undefined,
									numRows,
									row,
									rowIndex,
									rowNumber,
									rowRef,
									table,
									virtualCell,
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
						</ColumnVirtualizerWrapper>
					</MuiTableRow>
				)}
			</EditingRowActionButtons>
			{renderDetailPanel &&
				(collapsedColumnIndex === undefined ? (
					<TableDetailPanel ref={panelRef} row={row} table={table} />
				) : (
					<tr />
				))}
			{enableCreateNewRow && <CreateNewRow {...props} />}
		</>
	)
}

export const Memo_TableBodyRow = memo(
	TableBodyRow,
	(prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex
)
