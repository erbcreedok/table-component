import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { TableInstance } from '../TableComponent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickFilterMenuItems = ({ table, toggleSubMenu }) => {
	const {
		options: {
			enableColumnFilters,
			enableColumnFiltersSelection,
			ColumnActionsFiltersMenu,
			icons: { FiltersIcon },
			localization,
		},
	} = table as TableInstance

	if (
		!(
			enableColumnFilters &&
			enableColumnFiltersSelection &&
			ColumnActionsFiltersMenu
		)
	) {
		return null
	}

	return (
		<MenuItem key={0} onClick={toggleSubMenu} sx={commonMenuItemStyles}>
			<Box sx={commonListItemStyles}>
				<ListItemIcon>
					<FiltersIcon />
				</ListItemIcon>
				{localization.addToFilter}
			</Box>
		</MenuItem>
	)
}
