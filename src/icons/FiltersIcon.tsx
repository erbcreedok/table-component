import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const FiltersIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 24 24" sx={{ width: 24, height: 24 }}>
			<path
				d="M2 7.75C2 7.33579 2.33579 7 2.75 7H22.25C22.6642 7 23 7.33579 23 7.75C23 8.16421 22.6642 8.5 22.25 8.5H2.75C2.33579 8.5 2 8.16421 2 7.75Z"
				fill={props.htmlColor}
			/>
			<path
				d="M5.75 12.25C5.75 11.8358 6.08579 11.5 6.5 11.5H18.5C18.9142 11.5 19.25 11.8358 19.25 12.25C19.25 12.6642 18.9142 13 18.5 13H6.5C6.08579 13 5.75 12.6642 5.75 12.25Z"
				fill={props.htmlColor}
			/>
			<path
				d="M10.25 16C9.83579 16 9.5 16.3358 9.5 16.75C9.5 17.1642 9.83579 17.5 10.25 17.5H14.75C15.1642 17.5 15.5 17.1642 15.5 16.75C15.5 16.3358 15.1642 16 14.75 16H10.25Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
