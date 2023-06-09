import { styled, Typography } from '@mui/material'

import { DEFAULT_FONT_FAMILY, Text } from './styles'

export const ContentTitle = styled(Typography)`
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${Text.Dark};
	font-size: 16px;
	line-height: 24px;
	font-weight: 600;
`
