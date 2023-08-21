import React from 'react'
import { SvgIconProps } from '@mui/material'

import { IconGeneral } from './IconGeneral'

export const ChevronNumberDownIcon = (props: SvgIconProps) => {
	return (
		<IconGeneral sxWidth={24} sxHeight={12} {...props} viewBox="0 0 24 12">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.01972 3.81977C7.72683 4.11266 7.72683 4.58753 8.01972 4.88043L11.4413 8.302C11.7342 8.59489 12.2091 8.59489 12.502 8.302L15.9235 4.88043C16.2164 4.58753 16.2164 4.11266 15.9235 3.81977C15.6306 3.52687 15.1558 3.52687 14.8629 3.81977L11.9716 6.71101L9.08038 3.81977C8.78749 3.52687 8.31261 3.52687 8.01972 3.81977Z"
				fill="currentColor"
			/>
		</IconGeneral>
	)
}
