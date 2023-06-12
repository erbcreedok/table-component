import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'

import { getColorAlpha } from '../utils/getColorAlpha'

import { Colors } from './styles'

export const ModalPaper = styled(Paper)`
	filter: drop-shadow(0 4px 22px ${getColorAlpha(Colors.Gray90, 0.15)});
	box-shadow: none;
	border-radius: 6px;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
`
