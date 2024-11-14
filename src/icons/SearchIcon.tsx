import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const SearchIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 18 18"
			sx={{ width: 18, height: 18, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.90625 2.625C4.9895 2.625 2.625 4.9895 2.625 7.90625C2.625 10.823 4.9895 13.1875 7.90625 13.1875C10.823 13.1875 13.1875 10.823 13.1875 7.90625C13.1875 4.9895 10.823 2.625 7.90625 2.625ZM1.375 7.90625C1.375 4.29914 4.29914 1.375 7.90625 1.375C11.5134 1.375 14.4375 4.29914 14.4375 7.90625C14.4375 11.5134 11.5134 14.4375 7.90625 14.4375C4.29914 14.4375 1.375 11.5134 1.375 7.90625Z"
				fill={props.htmlColor}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.6411 11.6411C11.8851 11.397 12.2809 11.397 12.525 11.6411L15.9421 15.0583C16.1862 15.3023 16.1862 15.6981 15.9421 15.9421C15.6981 16.1862 15.3023 16.1862 15.0583 15.9421L11.6411 12.525C11.397 12.2809 11.397 11.8851 11.6411 11.6411Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
