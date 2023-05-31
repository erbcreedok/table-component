import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const ToggleIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 24, height: 24, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15.875 8.625C14.011 8.625 12.5 10.136 12.5 12C12.5 13.864 14.011 15.375 15.875 15.375C17.739 15.375 19.25 13.864 19.25 12C19.25 10.136 17.739 8.625 15.875 8.625ZM14 12C14 10.9645 14.8395 10.125 15.875 10.125C16.9105 10.125 17.75 10.9645 17.75 12C17.75 13.0355 16.9105 13.875 15.875 13.875C14.8395 13.875 14 13.0355 14 12Z"
				fill={props.htmlColor}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8 6C4.68629 6 2 8.68629 2 12C2 15.3137 4.68629 18 8 18H15.875C19.1887 18 21.875 15.3137 21.875 12C21.875 8.68629 19.1887 6 15.875 6H8ZM3.5 12C3.5 9.51472 5.51472 7.5 8 7.5H15.875C18.3603 7.5 20.375 9.51472 20.375 12C20.375 14.4853 18.3603 16.5 15.875 16.5H8C5.51472 16.5 3.5 14.4853 3.5 12Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
