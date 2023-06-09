import React, { FC } from 'react'
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

interface Props {
	headerGroup: Table_HeaderGroup
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
	parentRow?: Table_Row
	sx?: TableRowProps['sx']
	cellBackgroundColor?: string
	cellBackgroundColorHover?: string
}

export const TableHeadRow: FC<Props> = ({
	headerGroup,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	parentRow,
	sx,
	cellBackgroundColor,
	cellBackgroundColorHover,
}) => {
	const {
		options: { layoutMode, muiTableHeadRowProps },
	} = table

	const tableRowProps =
		muiTableHeadRowProps instanceof Function
			? muiTableHeadRowProps({ headerGroup, table })
			: muiTableHeadRowProps

	return (
		<TableRow
			{...tableRowProps}
			sx={(theme) => ({
				backgroundColor: Colors.LightestGray,
				display: layoutMode === 'grid' ? 'flex' : 'table-row',
				top: 0,
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
