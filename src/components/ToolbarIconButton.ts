import { styled, IconButton, css } from '@mui/material'

import { getColorAlpha } from '../utils/getColorAlpha'
import { makeShouldForwardProp } from '../utils/makeShouldForwardProp'

import { Text, Colors } from './styles'

export const ToolbarIconButton = styled(
	IconButton,
	makeShouldForwardProp(['toggled', 'enableCaption'])
)<{
	toggled?: boolean
	enableCaption?: boolean
}>`
	color: ${Text.Primary};
	padding: ${({ enableCaption }) => (enableCaption ? '6px 9px' : '4.5px')};
	border-radius: 3px;
	height: 30px;
	position: relative;
	max-width: 160px;
	&:hover {
		background-color: ${Colors.Gray20};
	}
	&:active {
		background-color: ${Colors.Gray};
	}
	${({ toggled }) =>
		toggled &&
		css`
			background-color: ${Colors.Dark};
			color: ${getColorAlpha(Colors.White, 0.8)};
			&:hover {
				background-color: ${Colors.Dark};
			}
			&:active {
				background-color: ${Colors.Dark};
			}
		`};
	& > svg {
		width: 21px;
		height: 21px;
	}
	& > p {
		font-size: 14px;
		line-height: 18px;
		margin-left: 6px;
		font-weight: 600;
	}
`
