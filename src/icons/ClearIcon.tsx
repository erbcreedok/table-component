import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const ClearIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 24, height: 24, ...props.sx }}
		>
			<path
				d="M8.03754 15.4622C7.74465 15.1693 7.74465 14.6944 8.03754 14.4015L10.6892 11.7499L8.03762 9.09836C7.74473 8.80547 7.74473 8.33059 8.03762 8.0377C8.33051 7.74481 8.80539 7.74481 9.09828 8.0377L11.7498 10.6892L14.4015 8.03754C14.6944 7.74465 15.1693 7.74465 15.4622 8.03754C15.7551 8.33043 15.7551 8.80531 15.4622 9.0982L12.8105 11.7499L15.4622 14.4017C15.7551 14.6946 15.7551 15.1694 15.4622 15.4623C15.1693 15.7552 14.6945 15.7552 14.4016 15.4623L11.7498 12.8106L9.0982 15.4622C8.80531 15.7551 8.33043 15.7551 8.03754 15.4622Z"
				fill={props.htmlColor}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.75 2C6.36522 2 2 6.36522 2 11.75C2 17.1348 6.36522 21.5 11.75 21.5C17.1348 21.5 21.5 17.1348 21.5 11.75C21.5 6.36522 17.1348 2 11.75 2ZM3.5 11.75C3.5 7.19365 7.19365 3.5 11.75 3.5C16.3063 3.5 20 7.19365 20 11.75C20 16.3063 16.3063 20 11.75 20C7.19365 20 3.5 16.3063 3.5 11.75Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
