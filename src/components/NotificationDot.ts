import { styled } from '@mui/material'

import { DEFAULT_FONT_FAMILY } from './styles'

export const NotificationDot = styled('span')`
	font-family: ${DEFAULT_FONT_FAMILY};
	width: 6px;
	height: 6px;
	background-color: ${({ theme }) => theme.palette.error.main};
	position: absolute;
	right: 0;
	top: 0;
	box-shadow: 0 1px 6px ${({ theme }) => theme.palette.error.main};
	border-radius: 50%;
`
