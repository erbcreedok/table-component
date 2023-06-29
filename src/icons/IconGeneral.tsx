import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export type IconGeneralProps = SvgIconProps & {
	size?: number
	sxWidth?: number
	sxHeight?: number
}
export const IconGeneral = ({
	size = 24,
	sx,
	sxWidth,
	sxHeight,
	...props
}: IconGeneralProps) => {
	return (
		<SvgIcon
			{...props}
			sx={(theme) => ({
				width: sxWidth ?? size,
				height: sxHeight ?? size,
				...(sx instanceof Function ? sx(theme) : (sx as any)),
			})}
		/>
	)
}
