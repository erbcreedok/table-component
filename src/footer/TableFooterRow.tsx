import { lighten } from '@mui/material/styles'
import TableRow from '@mui/material/TableRow'
import { VirtualItem } from '@tanstack/react-virtual'
import React, { FC } from 'react'

import type { Table_Header, Table_HeaderGroup, TableInstance } from '..'

import { TableFooterCell } from './TableFooterCell'

interface Props {
	footerGroup: Table_HeaderGroup
	table: TableInstance
	virtualColumns?: VirtualItem[]
}

export const TableFooterRow: FC<Props> = ({
	footerGroup,
	table,
	virtualColumns,
}) => {
	const {
		options: { layoutMode, muiTableFooterRowProps },
	} = table

	// if no content in row, skip row
	if (
		!footerGroup.headers?.some(
			(header) =>
				(typeof header.column.columnDef.footer === 'string' &&
					!!header.column.columnDef.footer) ||
				header.column.columnDef.Footer
		)
	)
		return null

	const tableRowProps =
		muiTableFooterRowProps instanceof Function
			? muiTableFooterRowProps({ footerGroup, table })
			: muiTableFooterRowProps

	return (
		<TableRow
			{...tableRowProps}
			sx={(theme) => ({
				backgroundColor: lighten(theme.palette.background.default, 0.04),
				display: layoutMode === 'grid' ? 'flex' : 'table-row',
				width: '100%',
				...(tableRowProps?.sx instanceof Function
					? tableRowProps?.sx(theme)
					: (tableRowProps?.sx as any)),
			})}
		>
			{(virtualColumns ?? footerGroup.headers).map((footerOrVirtualFooter) => {
				const footer = virtualColumns
					? footerGroup.headers[footerOrVirtualFooter.index]
					: (footerOrVirtualFooter as Table_Header)

				return <TableFooterCell footer={footer} key={footer.id} table={table} />
			})}
		</TableRow>
	)
}
