import { tableRowClasses } from '@mui/material'
import { FC, memo, useCallback, useMemo, useRef, useEffect } from 'react'
import MuiTableRow from '@mui/material/TableRow'
import { lighten } from '@mui/material/styles'
import type { VirtualItem, Virtualizer } from '@tanstack/react-virtual'
import { useResizeDetector } from 'react-resize-detector'

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
import { mapVirtualItems } from '../utils/virtual'
import { setHoveredRow } from '../utils/setHoveredRow'

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

export const TableBodyRow: FC<TableBodyRowProps> = ({
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
}) => {
	const {
		getIsSomeColumnsPinned,
		getState,
		options: {
			enableTableHead,
			editingMode,
			enableRowDragging,
			layoutMode,
			memoMode,
			muiTableBodyRowProps,
			renderDetailPanel,
		},
		refs: { rowDragEnterTimeoutRef },
	} = table
	const {
		draggingColumn,
		draggingRows,
		editingCell,
		editingRow,
		columnVisibility,
		openedDetailedPanels,
	} = getState()
	const isEditingRow = !!editingRow && editingRow?.id === row.id
	const isMockRow = getIsMockRow(row)

	const tableRowProps =
		muiTableBodyRowProps instanceof Function
			? muiTableBodyRowProps({ row, table })
			: muiTableBodyRowProps ?? {}

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
			if (isMockRow) {
				setHoveredRow(table)(null)

				return
			}
			if (enableRowDragging && draggingRows.length > 0) {
				setHoveredRow(table)({ ...currentHoveredRow, rowRef })
			}
		}, 500)
	}

	const rowRef = useRef<HTMLTableRowElement | null>(null)
	const panelRef = useRef<HTMLTableRowElement | null>(null)

	const isDraggingRow = useMemo(
		() => draggingRows.some((dRow) => dRow?.id === row.id),
		[draggingRows, row.id]
	)

	const { collapsedColumnIndex } = row
	const getGroupedCell = useCallback(
		(cell: Table_Cell, virtualCell?: VirtualItem) => {
			const groupIndex = (groupingProps ?? []).findIndex(
				(group) => group?.columnId === getColumnId(cell.column)
			)
			const group = groupingProps?.[groupIndex]
			if (!group || !groupingProps) return null
			// There is an extra row for the detail panel, so multiply rowspan by 2
			const rowSpan = group.count * (renderDetailPanel ? 2 : 1)
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
			numRows,
			renderDetailPanel,
			row,
			rowIndex,
			rowNumber,
			table,
		]
	)

	const cells = mapVirtualItems(
		getCellsFilteredByDisplay(row?.getVisibleCells()),
		virtualColumns
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

		if (row.getIsExpanded()) {
			if (isRowCellHidden()) {
				const filteredClickedCells = { ...openedDetailedPanels }
				delete filteredClickedCells[row.id]
				table.setOpenedDetailedPanels(filteredClickedCells)
				row.toggleExpanded(false)
			}
		}
	}, [columnVisibility])

	return (
		<EditingRowActionButtons
			open={isEditingRow && editingMode === 'row'}
			table={table}
			row={row}
		>
			{({ ref }) => (
				<>
					<MuiTableRow
						data-index={virtualRow?.index}
						hover
						onDragEnter={handleDragEnter}
						selected={row.getIsSelected()}
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
								if (cell.getIsPlaceholder() && !isSummaryRow)
									return getGroupedCell(cell, virtualCell)
								const groupBorders = getCellGroupBorders({
									table,
									rowIndex: getSubRowIndex({ row }) ?? rowIndex,
									colIndex: index,
									isGroupedColumn: false,
									isFirstOfGroup: !!groupingProps,
								})
								if (collapsedColumnIndex !== undefined && !isSummaryRow)
									return <EmptyCell key={cell.id} groupBorders={groupBorders} />
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
					{renderDetailPanel &&
						(collapsedColumnIndex === undefined ? (
							<TableDetailPanel ref={panelRef} row={row} table={table} />
						) : (
							<tr />
						))}
				</>
			)}
		</EditingRowActionButtons>
	)
}

export const Memo_TableBodyRow = memo(
	TableBodyRow,
	(prev, next) => prev.row === next.row && prev.rowIndex === next.rowIndex
)
