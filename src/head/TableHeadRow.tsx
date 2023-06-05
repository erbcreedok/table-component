import React, { FC } from 'react'
import TableRow from '@mui/material/TableRow'
import { alpha } from '@mui/material/styles'
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
}

export const TableHeadRow: FC<Props> = ({
	headerGroup,
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	parentRow,
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
				boxShadow: `4px 0 8px ${alpha(theme.palette.common.black, 0.1)}`,
				display: layoutMode === 'grid' ? 'flex' : 'table-row',
				top: 0,
				...(tableRowProps?.sx instanceof Function
					? tableRowProps?.sx(theme)
					: (tableRowProps?.sx as any)),
			})}
		>
			{virtualPaddingLeft ? (
				// eslint-disable-next-line jsx-a11y/control-has-associated-label
				<th style={{ display: 'flex', width: virtualPaddingLeft }} />
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
					/>
				)
			})}
			{virtualPaddingRight ? (
				// eslint-disable-next-line jsx-a11y/control-has-associated-label
				<th style={{ display: 'flex', width: virtualPaddingRight }} />
			) : null}
		</TableRow>
	)
}
