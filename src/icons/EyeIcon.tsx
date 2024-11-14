import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const EyeIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			fill="none"
			sx={{
				width: 24,
				height: 24,
				fill: 'none',
				stroke: 'currentColor',
				...props.sx,
			}}
		>
			<path
				d="M12.5 5C5 5 2 11.75 2 11.75C2 11.75 5 18.5 12.5 18.5C20 18.5 23 11.75 23 11.75C23 11.75 20 5 12.5 5Z"
				stroke={props.htmlColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M12.5 15.5C14.5711 15.5 16.25 13.8211 16.25 11.75C16.25 9.67893 14.5711 8 12.5 8C10.4289 8 8.75 9.67893 8.75 11.75C8.75 13.8211 10.4289 15.5 12.5 15.5Z"
				stroke={props.htmlColor}
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</SvgIcon>
	)
}
