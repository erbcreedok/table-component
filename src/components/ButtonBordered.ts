import { styled } from '@mui/material'
import Button from '@mui/material/Button'

import { DEFAULT_FONT_FAMILY, Colors } from './styles'

export const ButtonBordered = styled(Button)`
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${Colors.LightBlue};
	font-size: 14px;
	line-height: 18px;
	font-weight: 400;
	border-color: ${Colors.Gray};
	border-radius: 6px;
	text-transform: initial;
	padding: 9px 15px;
	&:hover {
		background-color: ${Colors.Gray20};
		border-color: ${Colors.Gray};
	}
	&:active {
		background-color: ${Colors.Gray};
	}
`
