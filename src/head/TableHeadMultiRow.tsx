import React, { useRef, useEffect } from 'react'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import type { VirtualItem } from '@tanstack/react-virtual'

import { ColumnVirtualizerWrapper, getColumnsFilteredByDisplay } from '..'
import type {
	Table_Row,
	TableInstance,
	MultirowHeader,
	Table_Column,
	MultirowColumn,
} from '..'
import type { StickyElement } from '../hooks/useMultiSticky'
import { Colors, TextColor } from '../components/styles'
import { getColumnId, getTotalRight } from '../column.utils'
import { mapVirtualItems } from '../utils/mapVirtualItems'

const sharedCellStyles = {
	background: Colors.Gray10,
}
const cellStyles = {
	...sharedCellStyles,
	borderColor: Colors.Gray,
	borderCollapse: 'collapse',
	borderStyle: 'solid',
	borderWidth: '1px',
	height: '36px',
	padding: '0 12px',
	color: TextColor.Dark,
	fontWeight: 600,
	fontSize: '12px',
	lineHeight: '18px',
	textAlign: 'center',
}

type Props = {
	multirowHeader: MultirowHeader
	table: TableInstance
	virtualColumns?: VirtualItem[]
	parentRow?: Table_Row
	cellBackgroundColor?: string
	cellBackgroundColorHover?: string
	isScrolled?: boolean
	registerSticky: (
		el: HTMLTableRowElement,
		id: string,
		order: number | string
	) => void
	stickyElements: StickyElement[]
} & TableRowProps

export const TableHeadMultiRow = ({
	table,
	sx,
	isScrolled,
	multirowHeader,
	registerSticky,
	stickyElements,
	virtualColumns,
	...rest
}: Props) => {
	const rowsRef = useRef<HTMLTableRowElement[]>([])
	const {
		options: { layoutMode, muiTableHeadRowProps },
	} = table

	useEffect(() => {
		rowsRef.current = rowsRef.current.slice(0, multirowHeader.length)
	}, [multirowHeader])

	useEffect(() => {
		rowsRef.current.forEach((el, i) => {
			registerSticky(el, el.id, i)
		})
	}, [rowsRef.current, registerSticky])

	const getMultirowColumns = (multiHeaderRow) => {
		const columnIdsText = multiHeaderRow.columns.reduce((result, current) => {
			const obj = result
			current.columnIds.forEach((id) => {
				obj[id] = current.shorthandText ?? current.text
			})

			return obj
		}, {})
		const columns: Table_Column[] = mapVirtualItems(
			getColumnsFilteredByDisplay([
				...table.getLeftVisibleLeafColumns(),
				...table.getCenterVisibleLeafColumns(),
				...table.getRightVisibleLeafColumns(),
			]),
			virtualColumns
		).map(([col]) => col)
		const multirowColumns = columns.reduce((result, column) => {
			const isGrouped = column.getIsGrouped()
			const isPinned = column.getIsPinned()
			const text = columnIdsText[getColumnId(column)]
			let id = text ?? 'none'
			let leftPinnedPosition: number | undefined
			let rightPinnedPosition: number | undefined
			if (isGrouped) {
				id = `${id}-grouped`
			}
			if (isPinned) {
				id = `${id}-pinned:${isPinned}`
				if (isPinned === 'left') {
					leftPinnedPosition = column.getStart('left')
				}
				if (isPinned === 'right') {
					rightPinnedPosition = getTotalRight(table, column)
				}
			}
			const current = {
				id,
				text,
				isGrouped,
				isPinned,
				leftPinnedPosition,
				rightPinnedPosition,
				colSpan: 1,
			}
			if (!result.length) {
				result.push(current)

				return result
			}
			const prev = result[result.length - 1]

			if (id === prev.id) {
				prev.colSpan += 1
				if (prev.isPinned === 'right' && prev.rightPinnedPosition) {
					prev.rightPinnedPosition = getTotalRight(table, column)
				}
			} else {
				result.push(current)
			}

			return result
		}, [] as MultirowColumn[])

		const uniqueIdsCount = {}

		// handle duplicate ids
		return multirowColumns.map((multirowColumn) => {
			if (!uniqueIdsCount[multirowColumn.id]) {
				uniqueIdsCount[multirowColumn.id] = 0
			}
			uniqueIdsCount[multirowColumn.id] += 1
			if (uniqueIdsCount[multirowColumn.id] > 1) {
				multirowColumn.id = `${multirowColumn.id}-${
					uniqueIdsCount[multirowColumn.id]
				}`
			}

			return multirowColumn
		})
	}

	const getRowStyles = (theme, row, stickyId) => {
		return {
			position: row.pin ? 'sticky' : 'relative',
			backgroundColor: Colors.LightestGray,
			display: layoutMode === 'grid' ? 'flex' : 'table-row',
			top:
				row.pin && stickyElements.length
					? stickyElements.find((sticky) => sticky.id === stickyId)?.top
					: 0,
			boxShadow:
				row.pin && isScrolled
					? '0px 4px 4px 0px rgba(0, 0, 0, 0.10)'
					: undefined,
			...(!row.pin && {
				zIndex: -1,
			}),
			...(sx instanceof Function ? sx(theme) : (sx as any)),
		}
	}

	return (
		<>
			{[...multirowHeader]
				.sort((a, b) => a.depth - b.depth)
				.map((row, i) => {
					const multirowColumns = getMultirowColumns(row)

					return (
						<>
							<TableRow
								key={row.depth}
								ref={(ref: HTMLTableRowElement) => {
									if (row.pin) {
										rowsRef.current[i * 2] = ref
									}
								}}
								{...muiTableHeadRowProps}
								{...rest}
								id={`${i}`}
								sx={(theme) => getRowStyles(theme, row, i.toString())}
							>
								<ColumnVirtualizerWrapper sx={sharedCellStyles}>
									{multirowColumns.map((cell) => (
										<TableCell
											key={cell.id}
											sx={{
												...cellStyles,
												...(cell.isPinned
													? {
															position: 'sticky',
															left: cell.leftPinnedPosition,
															right: cell.rightPinnedPosition,
															zIndex: 3,
													  }
													: {}),
											}}
											colSpan={cell.colSpan}
										>
											{cell.text}
										</TableCell>
									))}
								</ColumnVirtualizerWrapper>
							</TableRow>
							{row.additionalRowContent ? (
								<TableRow
									key={`${row.depth}-sub`}
									ref={(ref: HTMLTableRowElement) => {
										if (row.pin) {
											rowsRef.current[i * 2 + 1] = ref
										}
									}}
									{...muiTableHeadRowProps}
									{...rest}
									id={`${i}-sub`}
									sx={(theme) => getRowStyles(theme, row, `${i}-sub`)}
								>
									<ColumnVirtualizerWrapper sx={sharedCellStyles}>
										{row.additionalRowContent(table, multirowColumns)}
									</ColumnVirtualizerWrapper>
								</TableRow>
							) : null}
						</>
					)
				})}
		</>
	)
}
