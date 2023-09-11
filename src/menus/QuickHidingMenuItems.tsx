import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickHidingMenuItems = ({ column, table, setVisible }) => {
	const {
		options: {
			enableHiding,
			icons: { EyeIcon },
			localization,
		},
	} = table

	const handleHideColumn = () => {
		column.toggleVisibility(false)
		if (column.getIsGrouped()) {
			column.toggleGrouping()
		}
		column.clearSorting()
		setVisible(false)
	}

	if (!enableHiding) return null

	return (
		<MenuItem
			disabled={!column.getCanHide()}
			key={0}
			onClick={withNativeEvent(
				{
					el: `ColumnHeaderMenu_${getPascalCase(
						column.columnDef.header
					)}_HideInViewButton`,
					type: 'click',
				},
				table
			)(handleHideColumn)}
			sx={commonMenuItemStyles}
		>
			<Box sx={commonListItemStyles}>
				<ListItemIcon>
					<EyeIcon />
				</ListItemIcon>
				{localization.hideInView}
			</Box>
		</MenuItem>
	)
}
