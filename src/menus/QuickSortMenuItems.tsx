import { MenuList, Popper } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import zIndex from '@mui/material/styles/zIndex'
import React, { FC, MutableRefObject } from 'react'

import { MenuPaper } from '../components/Menu'
import { Colors } from '../components/styles'
import { useHoverEffects } from '../hooks/useHoverEffects'
import { Table_Column, TableInstance } from '../TableComponent'

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
			enableMultiSort,
			icons: {
				AscIcon,
				DescIcon,
				CheckIcon,
				ClearIcon,
				ArrowsIcon,
				ExpandMoreIcon,
			},
			localization,
		},
	} = table

	const handleClearSort = () => {
		column.clearSorting()
		setVisible(false)
	}

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

	const selectedChevron = (
		<Box sx={{ ml: 'auto', color: Colors.LightBlue, height: '24px' }}>
			<CheckIcon />
		</Box>
	)

	return (
		<>
			<MenuItem
				key={0}
				sx={(theme) => ({
					...commonMenuItemStyles,
					background: hovered ? theme.palette.action.hover : undefined,
				})}
				{...hoverProps}
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
					<MenuList>
						<MenuItem key={1} onClick={handleSortAsc} sx={commonMenuItemStyles}>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<AscIcon />
								</ListItemIcon>
								{localization.sortAsc}
								{column.getIsSorted() === 'asc' && selectedChevron}
							</Box>
						</MenuItem>

						<MenuItem
							key={2}
							divider
							onClick={handleSortDesc}
							sx={commonMenuItemStyles}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<DescIcon />
								</ListItemIcon>
								{localization.sortDesc}
								{column.getIsSorted() === 'desc' && selectedChevron}
							</Box>
						</MenuItem>
						<MenuItem
							key={0}
							onClick={handleClearSort}
							sx={commonMenuItemStyles}
							disabled={!column.getIsSorted()}
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
