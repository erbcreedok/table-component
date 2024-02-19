import React, { useRef, useEffect } from 'react'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'

import { ColumnVirtualizerWrapper, getColumnsFilteredByDisplay } from '..'
import type { Table_Row, TableInstance, MultirowHeader, Table_Column } from '..'
import type { StickyElement } from '../hooks/useMultiSticky'
import { Colors, TextColor } from '../components/styles'
import { mapVirtualItems } from '../utils/virtual'
import { makeMultirowColumns } from '../utils/makeMultirowColumns'

import { TableHeadMultiRowCell } from './TableHeadMultiRowCell'

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
		options: { layoutMode, muiTableHeadRowProps, multirowColumnsDisplayDepth },
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
		const columns: Table_Column[] = mapVirtualItems(
			getColumnsFilteredByDisplay([
				...table.getLeftVisibleLeafColumns(),
				...table.getCenterVisibleLeafColumns(),
				...table.getRightVisibleLeafColumns(),
			]),
			virtualColumns
		).map(([col]) => col)

		const multirowColumns = makeMultirowColumns(columns, multiHeaderRow, table)

		return multirowColumns
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
										<TableHeadMultiRowCell
											key={cell.id}
											cell={cell}
											cellStyles={cellStyles}
											table={table}
											multirowColumnsDisplayDepth={
												multirowColumnsDisplayDepth ?? 1
											}
										/>
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
