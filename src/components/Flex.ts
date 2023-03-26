import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box } from '@mui/material'

import { getShouldForwardProps } from '../utils/getShouldForwardProps'

export const Flex = styled(
	Box,
	getShouldForwardProps('column', 'center', 'gap')
)<{
	column?: boolean
	center?: boolean | 'x' | 'y'
	gap?: string
}>`
	display: flex;
	${({ column, center, gap }) => css`
		flex-direction: ${column && 'column'};
		align-items: ${(center === 'y' || center === true) && 'center'};
		justify-content: ${(center === 'x' || center === true) && 'center'};
		gap: ${gap};
	`}
`
