import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const ArrowDownIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 24, height: 24, ...props.sx }}
		>
			<path
				d="M12.25 4.75C12.25 4.33579 11.9142 4 11.5 4C11.0858 4 10.75 4.33579 10.75 4.75V19.3895L5.28033 13.9199C4.98744 13.627 4.51256 13.627 4.21967 13.9199C3.92678 14.2128 3.92678 14.6876 4.21967 14.9805L10.899 21.6598C11.2309 21.9918 11.7691 21.9918 12.101 21.6598L18.7803 14.9805C19.0732 14.6876 19.0732 14.2128 18.7803 13.9199C18.4874 13.627 18.0126 13.627 17.7197 13.9199L12.25 19.3895V4.75Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
