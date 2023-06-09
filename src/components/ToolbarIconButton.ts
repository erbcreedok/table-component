import { styled, IconButton } from '@mui/material'

import { DEFAULT_FONT_FAMILY, Text, Colors } from './styles'

export const ToolbarIconButton = styled(IconButton)`
	color: ${Text.Primary};
	padding: 6px 9px;
	border-radius: 3px;
	height: 30px;
	position: relative;
	&:hover {
		background-color: ${Colors.Gray20};
	}
	&:active {
		background-color: ${Colors.Gray};
	}
	& > p {
		font-family: ${DEFAULT_FONT_FAMILY};
		font-size: 14px;
		line-height: 18px;
		margin-left: 6px;
		font-weight: 600;
	}
`
