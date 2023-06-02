import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const SearchIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 18, height: 18, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.5 2C5.80558 2 2 5.80558 2 10.5C2 15.1944 5.80558 19 10.5 19C12.6223 19 14.5629 18.2222 16.0524 16.9361L20.1832 21.0669C20.4272 21.311 20.823 21.311 21.067 21.0669C21.3111 20.8228 21.3111 20.4271 21.067 20.183L16.9362 16.0522C18.2223 14.5628 19 12.6222 19 10.5C19 5.80558 15.1944 2 10.5 2ZM3.25 10.5C3.25 6.49594 6.49594 3.25 10.5 3.25C14.5041 3.25 17.75 6.49594 17.75 10.5C17.75 14.5041 14.5041 17.75 10.5 17.75C6.49594 17.75 3.25 14.5041 3.25 10.5Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
