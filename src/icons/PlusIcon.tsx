import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const PlusIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 18 18"
			sx={{ width: 18, height: 18, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9.625 2.8125C9.625 2.46732 9.34518 2.1875 9 2.1875C8.65482 2.1875 8.375 2.46732 8.375 2.8125V8.375H2.8125C2.46732 8.375 2.1875 8.65482 2.1875 9C2.1875 9.34518 2.46732 9.625 2.8125 9.625H8.375V15.1875C8.375 15.5327 8.65482 15.8125 9 15.8125C9.34518 15.8125 9.625 15.5327 9.625 15.1875V9.625H15.1875C15.5327 9.625 15.8125 9.34518 15.8125 9C15.8125 8.65482 15.5327 8.375 15.1875 8.375H9.625V2.8125Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
