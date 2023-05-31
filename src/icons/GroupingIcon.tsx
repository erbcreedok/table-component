import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const GroupingIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 24, height: 24, ...props.sx }}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M2 5.75C2 4.7835 2.7835 4 3.75 4H7C7.9665 4 8.75 4.7835 8.75 5.75V18.75C8.75 19.7165 7.9665 20.5 7 20.5H3.75C2.7835 20.5 2 19.7165 2 18.75V5.75ZM3.75 5.5C3.61193 5.5 3.5 5.61193 3.5 5.75V6.93508L4.93508 5.5H3.75ZM3.5 10.9351V9.0564L7.05116 5.50524C7.16469 5.52885 7.25 5.62946 7.25 5.75V7.18508L3.5 10.9351ZM7.25 9.3064V11.1852L3.5 14.9352V13.0564L7.25 9.3064ZM7.25 13.3065V15.1852L3.5438 18.8914C3.51617 18.8512 3.5 18.8025 3.5 18.75V17.0565L7.25 13.3065ZM5.55651 19L7.25 17.3065V18.75C7.25 18.8881 7.13807 19 7 19H5.55651Z"
				fill={props.htmlColor}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.75 4C11.7835 4 11 4.7835 11 5.75V18.75C11 19.7165 11.7835 20.5 12.75 20.5H19.75C20.7165 20.5 21.5 19.7165 21.5 18.75V5.75C21.5 4.7835 20.7165 4 19.75 4H12.75ZM12.5 5.75C12.5 5.61193 12.6119 5.5 12.75 5.5H19.75C19.8881 5.5 20 5.61193 20 5.75V18.75C20 18.8881 19.8881 19 19.75 19H12.75C12.6119 19 12.5 18.8881 12.5 18.75V5.75Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
