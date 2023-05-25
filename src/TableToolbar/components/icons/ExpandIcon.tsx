import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const ExpandIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 18 18" sx={{ width: 18, height: 18 }}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12 1.625C11.6548 1.625 11.375 1.90482 11.375 2.25C11.375 2.59518 11.6548 2.875 12 2.875H14.2411L9.68306 7.43306C9.43898 7.67714 9.43898 8.07286 9.68306 8.31694C9.92714 8.56102 10.3229 8.56102 10.5669 8.31694L15.125 3.75888V6C15.125 6.34518 15.4048 6.625 15.75 6.625C16.0952 6.625 16.375 6.34518 16.375 6V2.35C16.375 1.94959 16.0504 1.625 15.65 1.625H12ZM2.25 11.375C2.59518 11.375 2.875 11.6548 2.875 12V14.2411L7.43306 9.68306C7.67714 9.43898 8.07286 9.43898 8.31694 9.68306C8.56102 9.92714 8.56102 10.3229 8.31694 10.5669L3.75888 15.125H6C6.34518 15.125 6.625 15.4048 6.625 15.75C6.625 16.0952 6.34518 16.375 6 16.375H2.35C1.94959 16.375 1.625 16.0504 1.625 15.65V12C1.625 11.6548 1.90482 11.375 2.25 11.375Z"
				fill={props.fill ?? '#6C6F80'}
			/>
		</SvgIcon>
	)
}
