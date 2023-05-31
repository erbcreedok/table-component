import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const ToggleIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 22 22"
			sx={{ width: 22, height: 22, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.875 7.625C13.011 7.625 11.5 9.13604 11.5 11C11.5 12.864 13.011 14.375 14.875 14.375C16.739 14.375 18.25 12.864 18.25 11C18.25 9.13604 16.739 7.625 14.875 7.625ZM13 11C13 9.96447 13.8395 9.125 14.875 9.125C15.9105 9.125 16.75 9.96447 16.75 11C16.75 12.0355 15.9105 12.875 14.875 12.875C13.8395 12.875 13 12.0355 13 11Z"
				fill={props.fill ?? 'currentColor'}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7 5C3.68629 5 1 7.68629 1 11C1 14.3137 3.68629 17 7 17H14.875C18.1887 17 20.875 14.3137 20.875 11C20.875 7.68629 18.1887 5 14.875 5H7ZM2.5 11C2.5 8.51472 4.51472 6.5 7 6.5H14.875C17.3603 6.5 19.375 8.51472 19.375 11C19.375 13.4853 17.3603 15.5 14.875 15.5H7C4.51472 15.5 2.5 13.4853 2.5 11Z"
				fill={props.fill ?? 'currentColor'}
			/>
		</SvgIcon>
	)
}
