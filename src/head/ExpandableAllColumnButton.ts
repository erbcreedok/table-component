import { styled } from '@mui/material'

import { ExpandAllButton } from '../buttons/ExpandAllButton'
import { getShouldForwardProps } from '../utils/getShouldForwardProps'

export const ExpandableAllColumnButton = styled(
	ExpandAllButton,
	getShouldForwardProps('position')
)<{ position?: 'left' | 'right' }>`
	position: absolute;
	width: 24px;
	height: 24px;
	top: 0;
	bottom: 0;
	margin: ${({ position }) =>
		position === 'right' ? 'auto -30px auto auto' : 'auto auto auto -30px'};
`
