import MuiMenu, { menuClasses } from '@mui/material/Menu'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

import { getColorAlpha } from '../utils/getColorAlpha'

import { Colors } from './styles'

export const MenuPaper = styled(Paper)`
	box-shadow: 0 4px 22px ${getColorAlpha(Colors.Gray, 0.15)};
	border-radius: 6px;
`
export const Menu = styled(MuiMenu, {
	shouldForwardProp: (prop) => prop !== 'minWidth',
})<{ minWidth?: number }>`
	& .${menuClasses.paper} {
		min-width: ${({ minWidth }) => minWidth ?? 16}px;
		margin: 6px 0;
		box-shadow: 0 4px 22px ${getColorAlpha(Colors.Gray, 0.15)};
		border-radius: 6px;
	}
`
