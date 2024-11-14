import { SvgIconProps } from '@mui/material'
import React from 'react'

import { IconGeneral } from './IconGeneral'

export const CollapseFilledIcon = (props: SvgIconProps) => {
	return (
		<IconGeneral {...props} viewBox="0 0 18 18" size={18}>
			<path
				d="M2.125 9C2.125 5.20304 5.20304 2.125 9 2.125C12.797 2.125 15.875 5.20304 15.875 9C15.875 12.797 12.797 15.875 9 15.875C5.20304 15.875 2.125 12.797 2.125 9ZM6.1875 7.875C5.56618 7.875 5.0625 8.37868 5.0625 9C5.0625 9.62132 5.56618 10.125 6.1875 10.125H11.8125C12.4338 10.125 12.9375 9.62132 12.9375 9C12.9375 8.37868 12.4338 7.875 11.8125 7.875H6.1875Z"
				fill="currentColor"
			/>
		</IconGeneral>
	)
}
