import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const LockIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 18 18"
			sx={{ width: 18, height: 18, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5 7V5C5 2.79086 6.79086 1 9 1C11.2091 1 13 2.79086 13 5V7C14.1046 7 15 7.89543 15 9V15C15 16.1046 14.1046 17 13 17H5C3.89543 17 3 16.1046 3 15V9C3 7.89543 3.89543 7 5 7ZM7 7H11V5C11 3.89543 10.1046 3 9 3C7.89543 3 7 3.89543 7 5V7ZM9 14C10.1046 14 11 13.1046 11 12C11 10.8954 10.1046 10 9 10C7.89543 10 7 10.8954 7 12C7 13.1046 7.89543 14 9 14Z"
				fill="#6C6F80"
			/>
		</SvgIcon>
	)
}
