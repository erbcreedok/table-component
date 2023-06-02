import { listItemIconClasses } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MuiMenu, { menuClasses } from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import React, { ComponentProps, forwardRef, ReactElement } from 'react'

import { commonListItemStyles, commonMenuItemStyles } from '../menus/constants'
import { getColorAlpha } from '../utils/getColorAlpha'

import { Colors } from './styles'

export const MenuPaper = styled(Paper)`
	filter: drop-shadow(0 4px 22px ${getColorAlpha(Colors.Gray, 0.15)});
	box-shadow: none;
	border-radius: 6px;
`
export const Menu = styled(MuiMenu, {
	shouldForwardProp: (prop) => !['minWidth', 'margin'].includes(prop as string),
})<{ minWidth?: number; margin?: string }>`
	& .${menuClasses.paper} {
		min-width: ${({ minWidth }) => minWidth ?? 16}px;
		filter: drop-shadow(0 4px 22px ${getColorAlpha(Colors.Gray, 0.15)});
		box-shadow: none;
		border-radius: 6px;
	}
`

type MenuItemBaseProps = ComponentProps<typeof MenuItem> & {
	icon?: ReactElement
	size?: 'small' | 'medium' | 'large'
}
export const MenuItemBase = forwardRef<HTMLLIElement, MenuItemBaseProps>(
	({ children, icon, size, ...props }, ref) => {
		return (
			<MenuItem
				ref={ref}
				{...props}
				sx={{
					...commonMenuItemStyles,
					fontSize: size === 'small' ? 14 : size === 'medium' ? 16 : 18,
					lineHeight:
						size === 'small' ? '18px' : size === 'medium' ? '21px' : '24px',
					...props.sx,
					[`& .${listItemIconClasses.root}`]: {
						minWidth: size === 'small' ? 30 : size === 'medium' ? 36 : 42,
						'& > svg': {
							width: size === 'small' ? 18 : size === 'medium' ? 24 : 30,
							height: size === 'small' ? 18 : size === 'medium' ? 24 : 30,
						},
					},
				}}
			>
				<Box sx={commonListItemStyles}>
					{icon && <ListItemIcon>{icon}</ListItemIcon>}
					{children}
				</Box>
			</MenuItem>
		)
	}
)
