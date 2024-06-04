import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'

import { getTestAttributes } from '../utils/getTestAttributes'
import { Table_Column, TableData, TableInstance, utilColumns } from '../'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

type QuickGroupingMenuItemsProps<TData extends TableData = {}> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	setVisible(visible: boolean): void
} & Partial<MenuItemProps>
export const QuickGroupingMenuItems = <TData extends TableData = {}>({
	column,
	table,
	setVisible,
	...rest
}: QuickGroupingMenuItemsProps<TData>) => {
	const {
		setColumnOrder,
		options: {
			enableGrouping,
			icons: { GroupingIcon },
			localization,
			e2eLabels,
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
						{...getTestAttributes(e2eLabels, 'columnMenuGroup')}
						{...rest}
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
