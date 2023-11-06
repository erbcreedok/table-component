import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'

import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'
import { getMultirowDepthMatchingColumns } from '../utils/getMultirowDepthMatchingColumns'
import { makeMultiheaderGroups } from '../utils/makeMultiheaderGroups'
import { makeNonMultiheaderGroups } from '../utils/makeNonMultiheaderGroups'
import { defaultOrganizeColumnsMenu } from '../TableToolbar/components/menus/ColumnsMenu/ColumnsMenu'
import { getTestAttributes } from '../utils/getTestAttributes'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

export const QuickHidingMenuItems = ({ column, table, setVisible }) => {
	const {
		getAllLeafColumns,
		options: {
			enableHiding,
			icons: { EyeCrossedIcon },
			localization,
			multirowHeader,
			multirowColumnsDisplayDepth,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
			test,
		},
	} = table

	const allColumns = organizeColumnsMenu(getAllLeafColumns())
	const multirowDepthMatchingColumns = getMultirowDepthMatchingColumns(
		multirowHeader,
		multirowColumnsDisplayDepth
	)
	const { allMultirowColumns } = makeMultiheaderGroups(
		allColumns,
		multirowDepthMatchingColumns,
		multirowColumnsDisplayDepth
	)
	const nonMultiheaderGroup = makeNonMultiheaderGroups(
		allColumns,
		allMultirowColumns
	)

	const handleHideColumn = () => {
		column.toggleVisibility(false)
		if (column.getIsGrouped()) {
			column.toggleGrouping()
		}
		column.clearSorting()
		setVisible(false)
	}

	const isDisabled =
		!column.getCanHide() ||
		!nonMultiheaderGroup.columns.filter((col) => col.id === column.id).length

	if (!enableHiding) return null

	return (
		<MenuItem
			disabled={isDisabled}
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
			{...getTestAttributes(test, 'columnMenuHide')}
		>
			<Box sx={commonListItemStyles}>
				<ListItemIcon>
					<EyeCrossedIcon />
				</ListItemIcon>
				{localization.hideInView}
			</Box>
		</MenuItem>
	)
}
