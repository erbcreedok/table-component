import styled from '@emotion/styled'
import { IconButton } from '@mui/material'

import { DEFAULT_FONT_FAMILY, Text, Colors } from './styles'

export const ToolbarIconButton = styled(IconButton)`
	color: ${Text.Primary};
	padding: 6px 9px;
	border-radius: 3px;
	height: 30px;
	margin-right: 12px;
	position: relative;
	&:hover {
		background-color: ${Colors.Lightgray};
	}
	&:active {
		background-color: ${Colors.gray};
	}
	& > p {
		font-family: ${DEFAULT_FONT_FAMILY};
		font-size: 14px;
		line-height: 18px;
		margin-left: 6px;
		font-weight: 600;
	}
`
