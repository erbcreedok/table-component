import { MenuList, Popper } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import zIndex from '@mui/material/styles/zIndex'
import { FC, useRef } from 'react'

import { ExpandMoreMenuChevron, MenuPaper } from '../components'
import { useHoverEffects } from '../hooks/useHoverEffects'
import { Table_Column, TableInstance } from '../TableComponent'
import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'
import { getTestAttributes } from '../utils/getTestAttributes'

import { QuickColumnPinningMenuItemOptions } from './QuickColumnPinningMenuItemOptions'
import { commonListItemStyles, commonMenuItemStyles } from './constants'

type Props = {
	column: Table_Column
	table: TableInstance
	setVisible: (visible: boolean) => void
} & Partial<MenuItemProps>
export const QuickColumnPinningMenuItems: FC<Props> = ({
	column,
	table,
	setVisible,
	...rest
}) => {
	const anchorRef = useRef(null)
	const { hovered, hoverProps } = useHoverEffects(300)
	const {
		options: {
			enablePinning,
			icons: { ClearIcon, FreezeIcon },
			localization,
			e2eLabels,
		},
	} = table

	const handleClearPinning = () => {
		const isPinned = column.getIsPinned()
		if (!isPinned) return
		table.setColumnPinning((old) => ({
			...old,
			[isPinned]: [],
		}))
		setVisible(false)
	}

	if (!enablePinning || !column.getCanPin()) {
		return null
	}

	return (
		<>
			<MenuItem
				ref={anchorRef}
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
						)}_FreezeButton`,
						type: 'hover',
					},
					table
				)(hoverProps.onMouseEnter)}
				{...getTestAttributes(e2eLabels, 'columnMenuFreeze')}
				{...rest}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>
						<FreezeIcon />
					</ListItemIcon>
					{localization.freeze}
					<ExpandMoreMenuChevron />
				</Box>
			</MenuItem>
			<Popper
				open={hovered}
				anchorEl={anchorRef.current}
				sx={{ zIndex: zIndex.tooltip, width: 260 }}
				placement="right-start"
			>
				<MenuPaper sx={{ mx: '6px' }} {...hoverProps}>
					<MenuList {...getTestAttributes(e2eLabels, 'columnMenuFreezeMenu')}>
						<QuickColumnPinningMenuItemOptions
							column={column}
							table={table}
							setVisible={setVisible}
							direction="left"
						/>
						<QuickColumnPinningMenuItemOptions
							column={column}
							table={table}
							setVisible={setVisible}
							direction="right"
						/>
						<MenuItem
							key={0}
							onClick={withNativeEvent(
								{
									el: `ColumnHeaderMenu_${getPascalCase(
										column.columnDef.header
									)}_ClearFreezingButton`,
									type: 'click',
								},
								table
							)(handleClearPinning)}
							sx={commonMenuItemStyles}
							disabled={!column.getIsPinned()}
							{...getTestAttributes(e2eLabels, 'columnMenuFreezingClear')}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<ClearIcon />
								</ListItemIcon>
								{localization.clearFreezing}
							</Box>
						</MenuItem>
					</MenuList>
				</MenuPaper>
			</Popper>
		</>
	)
}
