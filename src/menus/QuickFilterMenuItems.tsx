import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'
import { Table_Column, TableInstance } from '../TableComponent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickFilterMenuItems = ({
	table,
	toggleSubMenu,
	column,
}: {
	column: Table_Column
	table: TableInstance
	toggleSubMenu(): void
}) => {
	const {
		options: {
			enableColumnFilters,
			icons: { FiltersIcon },
			localization,
		},
	} = table as TableInstance
	const enableFiltering = column.getCanFilter()

	if (!enableFiltering || !enableColumnFilters) {
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
