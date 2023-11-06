import { MenuList, Popper } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import zIndex from '@mui/material/styles/zIndex'
import { FC, MutableRefObject } from 'react'

import { MenuPaper } from '../components/Menu'
import { useHoverEffects } from '../hooks/useHoverEffects'
import { Table_Column, TableInstance } from '../TableComponent'
import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'
import { getTestAttributes } from '../utils/getTestAttributes'

import { QuickSortMenuItemOptions } from './QuickSortMenuItemOptions'
import { commonListItemStyles, commonMenuItemStyles } from './constants'

type Props = {
	column: Table_Column
	table: TableInstance
	setVisible: (visible: boolean) => void
	menuRef?: MutableRefObject<HTMLElement | null>
}
export const QuickSortMenuItems: FC<Props> = ({
	column,
	table,
	setVisible,
	menuRef,
}) => {
	const { hovered, hoverProps } = useHoverEffects(300)
	const {
		options: {
			enableSorting,
			icons: { ClearIcon, ArrowsIcon, ExpandMoreIcon },
			localization,
			e2eLabels,
		},
	} = table

	const handleClearSort = () => {
		column.clearSorting()
		setVisible(false)
	}

	if (!enableSorting || !column.getCanSort()) {
		return null
	}

	return (
		<>
			<MenuItem
				key={0}
				sx={(theme) => ({
					...commonMenuItemStyles,
					background: hovered ? theme.palette.action.hover : undefined,
				})}
				{...hoverProps}
				onMouseEnter={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_SortButton`,
						type: 'hover',
					},
					table
				)(hoverProps.onMouseEnter)}
				{...getTestAttributes(e2eLabels, 'columnMenuSort')}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>
						<ArrowsIcon />
					</ListItemIcon>
					{localization.addSorting}
					<Box
						sx={(theme) => ({
							height: 24,
							ml: 'auto',
							transform: 'rotate(-90deg)',
							color: theme.palette.action.active,
						})}
					>
						<ExpandMoreIcon />
					</Box>
				</Box>
			</MenuItem>
			<Popper
				open={hovered}
				anchorEl={menuRef?.current}
				sx={{ zIndex: zIndex.tooltip, width: 260 }}
				placement="right-start"
			>
				<MenuPaper sx={{ mx: '6px' }} {...hoverProps}>
					<MenuList {...getTestAttributes(e2eLabels, 'columnMenuSortMenu')}>
						<QuickSortMenuItemOptions
							column={column}
							table={table}
							setVisible={setVisible}
						/>
						<MenuItem
							key={0}
							onClick={withNativeEvent(
								{
									el: `ColumnHeaderMenu_${getPascalCase(
										column.columnDef.header
									)}_ClearSortButton`,
									type: 'click',
								},
								table
							)(handleClearSort)}
							sx={commonMenuItemStyles}
							disabled={!column.getIsSorted()}
							{...getTestAttributes(e2eLabels, 'columnMenuSortMenuClear')}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<ClearIcon />
								</ListItemIcon>
								{localization.clearSort}
							</Box>
						</MenuItem>
					</MenuList>
				</MenuPaper>
			</Popper>
		</>
	)
}
