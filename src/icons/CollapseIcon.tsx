import React from 'react'
import { SvgIconProps } from '@mui/material'

import { IconGeneral } from './IconGeneral'

export const CollapseIcon = (props: SvgIconProps) => {
	return (
		<IconGeneral {...props} viewBox="0 0 18 18" size={18}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14.8 9C14.8 12.2033 12.2033 14.8 9 14.8C5.79675 14.8 3.2 12.2033 3.2 9C3.2 5.79675 5.79675 3.2 9 3.2C12.2033 3.2 14.8 5.79675 14.8 9ZM16 9C16 12.866 12.866 16 9 16C5.13401 16 2 12.866 2 9C2 5.13401 5.13401 2 9 2C12.866 2 16 5.13401 16 9ZM5.2 9.00001C5.2 9.44184 5.55817 9.80001 6 9.80001L12 9.8C12.4418 9.8 12.8 9.44183 12.8 9C12.8 8.55817 12.4418 8.2 12 8.2L6 8.20001C5.55817 8.20001 5.2 8.55819 5.2 9.00001Z"
				fill="currentColor"
			/>
		</IconGeneral>
	)
}
