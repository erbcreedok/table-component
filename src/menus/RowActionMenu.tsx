import React, { MouseEvent } from 'react'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import type { Table_Row, TableInstance } from '..'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	handleEdit: (event: MouseEvent) => void
	row: Table_Row<TData>
	setAnchorEl: (anchorEl: HTMLElement | null) => void
	table: TableInstance<TData>
}

export const RowActionMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	handleEdit,
	row,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		options: {
			icons: { EditIcon },
			enableEditing,
			localization,
			renderRowActionMenuItems,
		},
	} = table

	return (
		<Menu
			anchorEl={anchorEl}
			open={!!anchorEl}
			onClose={() => setAnchorEl(null)}
		>
			{enableEditing && (
				<MenuItem onClick={handleEdit} sx={commonMenuItemStyles}>
					<Box sx={commonListItemStyles}>
						<ListItemIcon>
							<EditIcon />
						</ListItemIcon>
						{localization.edit}
					</Box>
				</MenuItem>
			)}
			{renderRowActionMenuItems?.({
				row,
				table,
				closeMenu: () => setAnchorEl(null),
			})}
		</Menu>
	)
}
