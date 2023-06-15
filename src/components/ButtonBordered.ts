import { styled } from '@mui/material'
import Button from '@mui/material/Button'

import { Colors } from './styles'

export const ButtonBordered = styled(Button)`
	color: ${Colors.LightBlue};
	font-size: 14px;
	line-height: 18px;
	font-weight: 600;
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
