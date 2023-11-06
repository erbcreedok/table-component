import React, { FC } from 'react'
import MuiTableFooter from '@mui/material/TableFooter'
import type { VirtualItem } from '@tanstack/react-virtual'

import type { TableInstance } from '..'

import { TableFooterRow } from './TableFooterRow'

interface Props {
	table: TableInstance
	virtualColumns?: VirtualItem[]
}

export const TableFooter: FC<Props> = ({ table, virtualColumns }) => {
	const {
		getFooterGroups,
		getState,
		options: { enableStickyFooter, layoutMode, muiTableFooterProps },
	} = table
	const { isFullScreen } = getState()

	const tableFooterProps =
		muiTableFooterProps instanceof Function
			? muiTableFooterProps({ table })
			: muiTableFooterProps

	const stickFooter =
		(isFullScreen || enableStickyFooter) && enableStickyFooter !== false

	return (
		<MuiTableFooter
			{...tableFooterProps}
			sx={(theme) => ({
				bottom: stickFooter ? 0 : undefined,
				display: layoutMode === 'grid' ? 'grid' : 'table-row-group',
				opacity: stickFooter ? 0.97 : undefined,
				outline: stickFooter
					? theme.palette.mode === 'light'
						? `1px solid ${theme.palette.grey[300]}`
						: `1px solid ${theme.palette.grey[700]}`
					: undefined,
				position: stickFooter ? 'sticky' : undefined,
				zIndex: stickFooter ? 1 : undefined,
				...(tableFooterProps?.sx instanceof Function
					? tableFooterProps?.sx(theme)
					: (tableFooterProps?.sx as any)),
			})}
		>
			{getFooterGroups().map((footerGroup) => (
				<TableFooterRow
					footerGroup={footerGroup as any}
					key={footerGroup.id}
					table={table}
					virtualColumns={virtualColumns}
				/>
			))}
		</MuiTableFooter>
	)
}
