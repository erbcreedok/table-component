import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'

import { Table_Column, TableData, TableInstance } from '../TableComponent'
import { defaultOrganizeColumnsMenu } from '../TableToolbar/components/menus/ColumnsMenu/ColumnsMenu'
import { getMultirowDepthMatchingColumns } from '../utils/getMultirowDepthMatchingColumns'
import { getPascalCase } from '../utils/getPascalCase'
import { getTestAttributes } from '../utils/getTestAttributes'
import { makeMultiheaderGroups } from '../utils/makeMultiheaderGroups'
import { makeNonMultiheaderGroups } from '../utils/makeNonMultiheaderGroups'
import { withNativeEvent } from '../utils/withNativeEvent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

type QuickHidingMenuItemsProps<TData = TableData> = {
	column: Table_Column<TData>
	table: TableInstance<TData>
	setVisible(open?: boolean): void
}
export const QuickHidingMenuItems = ({
	column,
	table,
	setVisible,
}: QuickHidingMenuItemsProps) => {
	const {
		getAllLeafColumns,
		options: {
			e2eLabels,
			enableHiding,
			icons: { EyeCrossedIcon },
			localization,
			multirowHeader,
			multirowColumnsDisplayDepth,
			organizeColumnsMenu = defaultOrganizeColumnsMenu,
		},
	} = table

	const allColumns = organizeColumnsMenu(getAllLeafColumns(), table)
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
		if (column.getIsPinned()) {
			column.pin(false)
		}
		column.clearSorting()
		setVisible(false)
	}

	const isDisabled =
		!column.getCanHide() ||
		(!nonMultiheaderGroup.columns.filter((col) => col.id === column.id)
			.length &&
			(multirowColumnsDisplayDepth ?? 0) <= (multirowHeader ?? []).length)

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
			{...getTestAttributes(e2eLabels, 'columnMenuHide')}
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
