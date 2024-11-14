import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { Table_Column, TableInstance } from '../TableComponent'
import { getPascalCase } from '../utils/getPascalCase'
import { getTestAttributes } from '../utils/getTestAttributes'
import { withNativeEvent } from '../utils/withNativeEvent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickFilterMenuItems = ({
	table,
	toggleSubMenu,
	column,
	...rest
}: {
	column: Table_Column
	table: TableInstance
	toggleSubMenu(): void
} & Partial<MenuItemProps>) => {
	const {
		options: {
			enableColumnFilters,
			icons: { FiltersIcon },
			localization,
			e2eLabels,
		},
	} = table
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
			{...getTestAttributes(e2eLabels, 'columnMenuFilter')}
			{...rest}
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
