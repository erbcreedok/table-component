import styled from '@emotion/styled'
import { Button } from '@mui/material'

import { DEFAULT_FONT_FAMILY, Text, Colors } from './styles'

export const ToolbarButton = styled(Button)`
	color: ${Text.Primary};
	border-color: #acafbf;
	border-radius: 3px;
	position: relative;
	padding: 5px 6px;
	&:hover {
		background-color: ${Colors.Lightgray};
		border-color: #acafbf;
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
		text-transform: capitalize;
	}
`
