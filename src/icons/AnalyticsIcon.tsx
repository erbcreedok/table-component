import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const AnalyticsIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 14 14"
			sx={{ width: 14, height: 14, ...props.sx }}
		>
			<path
				d="M12.25 0.25H1.75C0.925 0.25 0.25 0.925 0.25 1.75V12.25C0.25 13.075 0.925 13.75 1.75 13.75H12.25C13.075 13.75 13.75 13.075 13.75 12.25V1.75C13.75 0.925 13.075 0.25 12.25 0.25ZM4.75 10.75H3.25V7H4.75V10.75ZM7.75 10.75H6.25V8.5H7.75V10.75ZM7.75 7H6.25V5.5H7.75V7ZM10.75 10.75H9.25V3.25H10.75V10.75Z"
				fill={props.fill || '#6C6F80'}
			/>
		</SvgIcon>
	)
}
