import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const AscIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 24, height: 24, ...props.sx }}
		>
			<path
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M12.5627 3.25416C12.4253 3.09831 12.2241 3 12 3C11.7759 3 11.5747 3.09831 11.4373 3.25416C11.4242 3.26571 11.4114 3.27773 11.399 3.29022L4.71967 9.9695C4.42678 10.2624 4.42678 10.7373 4.71967 11.0302C5.01256 11.3231 5.48744 11.3231 5.78033 11.0302L11.25 5.5605V20.25C11.25 20.6642 11.5858 21 12 21C12.4142 21 12.75 20.6642 12.75 20.25V5.5605L18.2197 11.0302C18.5126 11.3231 18.9874 11.3231 19.2803 11.0302C19.5732 10.7373 19.5732 10.2624 19.2803 9.9695L12.601 3.29022C12.5886 3.27773 12.5758 3.26571 12.5627 3.25416Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}
