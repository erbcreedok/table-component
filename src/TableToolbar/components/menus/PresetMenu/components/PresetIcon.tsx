import { menuItemClasses, styled } from '@mui/material'
import Box from '@mui/material/Box'

import { IconsColor } from '../../../../../components/styles'

export const PresetIcon = styled(Box)<{ selected?: boolean }>`
	color: ${({ theme, selected }) =>
		selected ? theme.palette.primary.main : IconsColor.default};
	display: ${({ selected }) => (!selected ? 'none' : 'inline-flex')};

	& svg {
		width: 18px;
		height: 18px;
	}

	.${menuItemClasses.root}:hover & {
		display: inline-flex;
	}

	.${menuItemClasses.root} & {
		min-width: 18px;
	}
`
