import React, { useRef } from 'react'
import TableRow, { TableRowProps } from '@mui/material/TableRow'
import type { VirtualItem } from '@tanstack/react-virtual'

import type {
	Table_Header,
	Table_HeaderGroup,
	Table_Row,
	TableInstance,
} from '..'
import { Colors } from '../components/styles'
import { getHeaderGroupBorders } from '../utils/getGroupBorders'

import { TableHeadCell } from './TableHeadCell'

type Props = {
	stickyHeader?: boolean
	headerGroup: Table_HeaderGroup
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
	parentRow?: Table_Row
	cellBackgroundColor?: string
	cellBackgroundColorHover?: string
	isScrolled?: boolean
} & TableRowProps

export const TableHeadRow = ({
	headerGroup,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	parentRow,
	sx,
	cellBackgroundColor,
	cellBackgroundColorHover,
	stickyHeader,
	isScrolled,
	...rest
}: Props) => {
	const ref = useRef<HTMLTableRowElement | null>(null)
	const {
		options: { layoutMode, muiTableHeadRowProps, enableRowDragging },
		setHoveredRow,
		getState,
	} = table
	const { draggingRows } = getState()

	const tableRowProps =
		muiTableHeadRowProps instanceof Function
			? muiTableHeadRowProps({ headerGroup, table })
			: muiTableHeadRowProps

	const handleDragEnter = () => {
		if (enableRowDragging && draggingRows.length > 0) {
			let row
			if (!parentRow) {
				row = table.getPaginationRowModel().flatRows[0]
			} else if (parentRow.subRows) {
				row = parentRow.subRows[0]
			}
			if (row) {
				setHoveredRow({
					row,
					position: 'top',
					rowRef: ref,
				})
			} else {
				setHoveredRow(null)
			}
		}
	}

	return (
		<TableRow
			ref={ref}
			{...tableRowProps}
			onDragEnter={handleDragEnter}
			{...rest}
			sx={(theme) => ({
				position: stickyHeader ? 'sticky' : 'relative',
				backgroundColor: Colors.LightestGray,
				display: layoutMode === 'grid' ? 'flex' : 'table-row',
				top: 0,
				boxShadow:
					stickyHeader && isScrolled
						? '0px 4px 4px 0px rgba(0, 0, 0, 0.10)'
						: undefined,
				...(tableRowProps?.sx instanceof Function
					? tableRowProps?.sx(theme)
					: (tableRowProps?.sx as any)),
				...(sx instanceof Function ? sx(theme) : (sx as any)),
			})}
		>
			{virtualPaddingLeft ? (
				<th
					aria-label="virtual-padding-left"
					style={{ display: 'flex', width: virtualPaddingLeft }}
				/>
			) : null}
			{(virtualColumns ?? headerGroup.headers).map((headerOrVirtualHeader) => {
				const header = virtualColumns
					? headerGroup.headers[headerOrVirtualHeader.index]
					: (headerOrVirtualHeader as Table_Header)
				const groupBorders = getHeaderGroupBorders({ header, table })

				return (
					<TableHeadCell
						parentRow={parentRow}
						header={header}
						key={header.id}
						table={table}
						groupBorders={groupBorders}
						backgroundColor={cellBackgroundColor}
						backgroundColorHover={cellBackgroundColorHover}
					/>
				)
			})}
			{virtualPaddingRight ? (
				<th
					aria-label="virtual-padding-right"
					style={{ display: 'flex', width: virtualPaddingRight }}
				/>
			) : null}
		</TableRow>
	)
}
