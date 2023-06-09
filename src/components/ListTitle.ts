import { styled, Typography } from '@mui/material'

import { DEFAULT_FONT_FAMILY, Text } from './styles'

export const ListTitle = styled(Typography)`
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${Text.Primary};
	font-size: 14px;
	line-height: 18px;
	font-weight: 600;
`
