import { styled, Button } from '@mui/material'

import { DEFAULT_FONT_FAMILY, Text, Colors } from './styles'

export const ToolbarButton = styled(Button)`
	display: flex;
	justify-content: space-between;
	min-width: 63px;
	max-width: 180px;
	color: ${Text.Primary};
	border-color: #acafbf;
	border-radius: 3px;
	position: relative;
	padding: 4px 6px;
	&:hover {
		background-color: ${Colors.Gray20};
		border-color: #acafbf;
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
		text-transform: capitalize;
	}
`
