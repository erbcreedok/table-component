import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const DescIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon width={18} height={18} {...props} viewBox="0 0 24 24">
			<path
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.75 3.7998C12.75 3.38559 12.4142 3.0498 12 3.0498C11.5858 3.0498 11.25 3.38559 11.25 3.7998V18.4393L5.78033 12.9697C5.48744 12.6768 5.01256 12.6768 4.71967 12.9697C4.42678 13.2626 4.42678 13.7374 4.71967 14.0303L11.399 20.7096C11.7309 21.0416 12.2691 21.0416 12.601 20.7096L19.2803 14.0303C19.5732 13.7374 19.5732 13.2626 19.2803 12.9697C18.9874 12.6768 18.5126 12.6768 18.2197 12.9697L12.75 18.4393V3.7998Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
