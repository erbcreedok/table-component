import { SvgIconProps } from '@mui/material'
import React from 'react'

import { IconGeneral } from './IconGeneral'

export const ExpandFilledIcon = (props: SvgIconProps) => {
	return (
		<IconGeneral {...props} viewBox="-1 -1 17 17" size={18}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.625 8C0.625 3.9269 3.9269 0.625 8 0.625C12.0731 0.625 15.375 3.9269 15.375 8C15.375 12.0731 12.0731 15.375 8 15.375C3.9269 15.375 0.625 12.0731 0.625 8ZM7.99982 12C7.65464 12 7.37482 11.7202 7.37482 11.375V8.625H4.625C4.27982 8.625 4 8.34518 4 8C4 7.65482 4.27982 7.375 4.625 7.375H7.37482V4.625C7.37482 4.27982 7.65464 4 7.99982 4C8.345 4 8.62482 4.27982 8.62482 4.625V7.375H11.375C11.7202 7.375 12 7.65482 12 8C12 8.34518 11.7202 8.625 11.375 8.625H8.62482V11.375C8.62482 11.7202 8.345 12 7.99982 12Z"
				fill="currentColor"
			/>
		</IconGeneral>
	)
}
