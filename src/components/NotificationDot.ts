import styled from '@emotion/styled'

import { DEFAULT_FONT_FAMILY, Colors } from './styles'

export const NotificationDot = styled('span')`
	font-family: ${DEFAULT_FONT_FAMILY};
	width: 6px;
	height: 6px;
	background-color: ${Colors.red};
	position: absolute;
	right: 23px;
	top: 5px;
	box-shadow: 0px 1px 6px #fa4b4b;
	border-radius: 50%;
`
