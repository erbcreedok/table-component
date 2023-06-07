import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export type IconGeneralProps = SvgIconProps & {
	size?: number
}
export const IconGeneral = ({ size = 24, sx, ...props }: IconGeneralProps) => {
	return (
		<SvgIcon
			{...props}
			sx={(theme) => ({
				width: size,
				height: size,
				...(sx instanceof Function ? sx(theme) : (sx as any)),
			})}
		/>
	)
}
