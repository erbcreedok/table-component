import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import { FC } from 'react'

import { SelectedChevron } from '../components/SelectedChevron'
import { Table_Column, TableInstance } from '../TableComponent'
import { getPascalCase } from '../utils/getPascalCase'
import { getSortingIcon, getSortingText } from '../utils/getSortingInfo'
import { getTestAttributes } from '../utils/getTestAttributes'
import { withNativeEvent } from '../utils/withNativeEvent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

type Props = {
	column: Table_Column
	table: TableInstance
	setVisible: (visible: boolean) => void
}
export const QuickSortMenuItemOptions: FC<Props> = ({
	column,
	table,
	setVisible,
}) => {
	const {
		options: { enableSorting, enableMultiSort, e2eLabels },
	} = table

	const handleSortAsc = () => {
		column.toggleSorting(false, enableMultiSort)
		setVisible(false)
	}

	const handleSortDesc = () => {
		column.toggleSorting(true, enableMultiSort)
		setVisible(false)
	}

	if (!enableSorting || !column.getCanSort()) {
		return null
	}

	const ascText = getSortingText({
		column,
		table,
		isAsc: true,
	})
	const descText = getSortingText({
		table,
		column,
		isAsc: false,
	})
	const ascIcon = getSortingIcon({
		table,
		column,
		isAsc: true,
	})
	const descIcon = getSortingIcon({
		table,
		column,
		isAsc: false,
	})

	return (
		<>
			<MenuItem
				key={1}
				onClick={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_${getPascalCase(ascText)}`,
						type: 'click',
					},
					table
				)(handleSortAsc)}
				sx={commonMenuItemStyles}
				{...getTestAttributes(e2eLabels, 'columnMenuSortAsc')}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>{ascIcon}</ListItemIcon>
					{ascText}
					{column.getIsSorted() === 'asc' && <SelectedChevron table={table} />}
				</Box>
			</MenuItem>

			<MenuItem
				key={2}
				divider
				onClick={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_${getPascalCase(descText)}`,
						type: 'click',
					},
					table
				)(handleSortDesc)}
				sx={commonMenuItemStyles}
				{...getTestAttributes(e2eLabels, 'columnMenuSortDesc')}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>{descIcon}</ListItemIcon>
					{descText}
					{column.getIsSorted() === 'desc' && <SelectedChevron table={table} />}
				</Box>
			</MenuItem>
		</>
	)
}
