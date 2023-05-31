import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickGroupingMenuItems = ({ column, table, setVisible }) => {
	const {
		setColumnOrder,
		options: {
			enableGrouping,
			icons: { GroupingIcon },
			localization,
		},
	} = table

	const handleGroupByColumn = () => {
		column.toggleGrouping()
		setColumnOrder((old: any) => ['mrt-row-expand', ...old])
		setVisible(false)
	}

	return (
		<>
			{enableGrouping &&
				column.getCanGroup() && [
					<MenuItem
						key={0}
						onClick={handleGroupByColumn}
						sx={commonMenuItemStyles}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<GroupingIcon />
							</ListItemIcon>
							{localization[column.getIsGrouped() ? 'ungroup' : 'groupBy']}
						</Box>
					</MenuItem>,
				]}
		</>
	)
}
