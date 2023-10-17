import React, { useRef, useEffect } from 'react'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import type { VirtualItem } from '@tanstack/react-virtual'

import type { Table_Row, TableInstance, MultirowHeader } from '..'
import type { StickyElement } from '../hooks/useMultiSticky'
import { Colors, TextColor } from '../components/styles'
import { Table_DisplayColumnIdsArray } from '../column.utils'

type Props = {
	multirowHeader: MultirowHeader
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
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
	virtualPaddingLeft,
	virtualPaddingRight,
	sx,
	isScrolled,
	multirowHeader,
	registerSticky,
	stickyElements,
	...rest
}: Props) => {
	const rowsRef = useRef<HTMLTableRowElement[]>([])
	const {
		options: { layoutMode, muiTableHeadRowProps, columns },
		getAllColumns,
		getState,
	} = table
	const { columnOrder, grouping } = getState()

	useEffect(() => {
		rowsRef.current = rowsRef.current.slice(0, multirowHeader.length)
	}, [multirowHeader])

	useEffect(() => {
		rowsRef.current.forEach((el, i) => {
			registerSticky(el, el.id, i)
		})
	}, [rowsRef.current, registerSticky])

	const utilColumnsCount = columns.filter((col) => {
		return Table_DisplayColumnIdsArray.includes(col.id as any)
	}).length
	const visibleColumnsIds = getAllColumns()
		.filter((column) => column.getIsVisible())
		.map((column) => column.id)

	const isGroupingActive = !!grouping.length

	const getTableCellsPropsArray = (
		multiHeaderRow,
		columnOrder,
		isGroupingColumns = false
	) => {
		const columnIdsText = multiHeaderRow.columns.reduce((result, current) => {
			const obj = result
			current.columnIds.forEach((id) => {
				obj[id] = current.shorthandText ?? current.text
			})

			return obj
		}, {})
		const filteredColumnOrder = columnOrder.filter(
			(column) =>
				!Table_DisplayColumnIdsArray.includes(column) &&
				visibleColumnsIds.includes(column)
		)
		const orderedColumnsText = filteredColumnOrder.map(
			(column) => columnIdsText[column]
		)

		const res = orderedColumnsText.reduce((result, current, index) => {
			if (!result.length) {
				result.push({
					text: current,
					colSpan: 1 + (isGroupingColumns ? 0 : utilColumnsCount),
				})

				return result
			}

			if (current === orderedColumnsText[index - 1]) {
				result[result.length - 1].colSpan += 1
			} else {
				result.push({
					text: current,
					colSpan: 1,
				})
			}

			return result
		}, [])

		return res
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

	const cellStyles = {
		borderStyle: 'solid',
		borderWidth: '1px',
		borderColor: Colors.Gray,
		borderCollapse: 'collapse',
		background: Colors.Gray10,
		height: '36px',
		padding: '0 12px',
		color: TextColor.Dark,
		fontWeight: 600,
		fontSize: '12px',
		lineHeight: '18px',
		textAlign: 'center',
	}

	return (
		<>
			{[...multirowHeader]
				.sort((a, b) => a.depth - b.depth)
				.map((row, i) => {
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
								{virtualPaddingLeft ? (
									<th
										aria-label="virtual-padding-left"
										style={{ display: 'flex', width: virtualPaddingLeft }}
									/>
								) : null}
								{isGroupingActive &&
									getTableCellsPropsArray(row, grouping, true).map((cell) => (
										<TableCell
											key={`${cell.text}-${cell.colSpan}`}
											sx={cellStyles}
											colSpan={cell.colSpan}
										>
											{cell.text}
										</TableCell>
									))}
								{getTableCellsPropsArray(
									row,
									columnOrder.filter((el) => !grouping.includes(el))
								).map((cell) => (
									<TableCell
										key={`${cell.text}-${cell.colSpan}`}
										sx={cellStyles}
										colSpan={cell.colSpan}
									>
										{cell.text}
									</TableCell>
								))}
								{virtualPaddingRight ? (
									<th
										aria-label="virtual-padding-right"
										style={{ display: 'flex', width: virtualPaddingRight }}
									/>
								) : null}
							</TableRow>
							{row.additionalRowContent ? (
								<TableRow
									key={row.depth}
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
									{virtualPaddingLeft ? (
										<th
											aria-label="virtual-padding-left"
											style={{ display: 'flex', width: virtualPaddingLeft }}
										/>
									) : null}
									{row.additionalRowContent(
										table,
										getTableCellsPropsArray(
											row,
											columnOrder.filter((el) => !grouping.includes(el))
										),
										isGroupingActive &&
											getTableCellsPropsArray(row, grouping, true)
									)}
									{virtualPaddingRight ? (
										<th
											aria-label="virtual-padding-right"
											style={{ display: 'flex', width: virtualPaddingRight }}
										/>
									) : null}
								</TableRow>
							) : null}
						</>
					)
				})}
		</>
	)
}
