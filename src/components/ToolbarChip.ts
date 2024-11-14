import { Chip, styled } from '@mui/material'

import { Colors, DEFAULT_FONT_FAMILY } from './styles'

export const ToolbarChip = styled(Chip)`
	font-family: ${DEFAULT_FONT_FAMILY};
	width: 18px;
	height: 18px;
	background-color: ${Colors.LightBlue};
	color: #fff;
	position: absolute;
	right: -6px;
	top: -3px;
	& > span {
		font-size: 12px;
		padding: 0;
	}
`
