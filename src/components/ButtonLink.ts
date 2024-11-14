import { styled } from '@mui/material'

import { Colors, DEFAULT_FONT_FAMILY } from './styles'

export const ButtonLink = styled('span')`
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${Colors.LightBlue};
	font-size: 14px;
	line-height: 18px;
	font-weight: 400;
	cursor: pointer;
`
