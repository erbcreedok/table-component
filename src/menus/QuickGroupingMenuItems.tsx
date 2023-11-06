import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'

import { getTestAttributes } from '../utils/getTestAttributes'
import { utilColumns } from '../'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickGroupingMenuItems = ({ column, table, setVisible }) => {
	const {
		setColumnOrder,
		options: {
			enableGrouping,
			icons: { GroupingIcon },
			localization,
			test,
		},
	} = table

	const handleGroupByColumn = () => {
		column.toggleGrouping()
		setColumnOrder((old: any) => [utilColumns.expand, ...old])
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
						{...getTestAttributes(test, 'columnMenuGroup')}
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
