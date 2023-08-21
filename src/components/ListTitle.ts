import { styled, Typography } from '@mui/material'

import { DEFAULT_FONT_FAMILY, TextColor } from './styles'

export const ListTitle = styled(Typography)`
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${TextColor.Primary};
	font-size: 14px;
	line-height: 18px;
	font-weight: 600;
`
