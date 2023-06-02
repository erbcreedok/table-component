import React, { MouseEvent } from 'react'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'

import type { Table_Row, TableInstance } from '..'
import { Menu } from '../components/Menu'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	handleEdit: (event: MouseEvent) => void
	row: Table_Row<TData>
	open: boolean
	setOpen: (open: boolean) => void
	table: TableInstance<TData>
}

export const RowActionMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	handleEdit,
	row,
	open,
	setOpen,
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
			open={open}
			onClose={() => setOpen(false)}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			PaperProps={{
				sx: {
					margin: '0 12px',
					overflow: 'visible',
					'&:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						width: 8,
						height: 8,
						backgroundColor: 'white',
						transform: 'translate(-3px, 7px) rotate(45deg)',
						zIndex: 0,
					},
				},
			}}
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
				closeMenu: () => setOpen(false),
			})}
		</Menu>
	)
}
