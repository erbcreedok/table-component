import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'
import { TableInstance } from '../TableComponent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickFilterMenuItems = ({ table, toggleSubMenu, column }) => {
	const {
		options: {
			enableColumnFilters,
			icons: { FiltersIcon },
			localization,
		},
	} = table as TableInstance

	if (!enableColumnFilters) {
		return null
	}

	const handleClick = () => {
		toggleSubMenu()
	}

	return (
		<MenuItem
			key={0}
			onClick={withNativeEvent(
				{
					el: `ColumnHeaderMenu_${getPascalCase(
						column.columnDef.header
					)}_AddToFilterButton`,
					type: 'click',
				},
				table
			)(handleClick)}
			sx={commonMenuItemStyles}
		>
			<Box sx={commonListItemStyles}>
				<ListItemIcon>
					<FiltersIcon />
				</ListItemIcon>
				{localization.addToFilter}
			</Box>
		</MenuItem>
	)
}
