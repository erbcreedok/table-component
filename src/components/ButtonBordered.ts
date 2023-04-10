import styled from '@emotion/styled'
import Button from '@mui/material/Button'

import { DEFAULT_FONT_FAMILY, Colors } from './styles'

export const ButtonBordered = styled(Button)`
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${Colors.LightBlue};
	font-size: 14px;
	line-height: 18px;
	font-weight: 400;
	border-color: ${Colors.gray};
	border-radius: 6px;
	text-transform: initial;
	padding: 9px 15px;
	&:hover {
		background-color: ${Colors.Lightgray};
		border-color: ${Colors.gray};
	}
	&:active {
		background-color: ${Colors.gray};
	}
`
