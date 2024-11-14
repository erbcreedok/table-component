import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'
import { forwardRef } from 'react'

type Props = BoxProps & {
	condition?: boolean
}
export const ConditionalBox = forwardRef<HTMLDivElement, Props>(
	({ condition, ...rest }, ref) =>
		condition ? <Box ref={ref} {...rest} /> : <>{rest.children}</>
)
