import Box from '@mui/material/Box'
import { BoxProps } from '@mui/material'
import { forwardRef } from 'react'

type Props = BoxProps & {
	condition?: boolean
}
export const ConditionalBox = forwardRef<HTMLDivElement, Props>(
	({ condition, ...rest }, ref) =>
		condition ? <Box ref={ref} {...rest} /> : <>{rest.children}</>
)
