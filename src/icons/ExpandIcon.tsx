import { SvgIconProps } from '@mui/material'
import React from 'react'

import { IconGeneral } from './IconGeneral'

export const ExpandIcon = (props: SvgIconProps) => {
	return (
		<IconGeneral {...props} viewBox="0 0 18 18" size={18}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M9 14.8C12.2033 14.8 14.8 12.2033 14.8 9C14.8 5.79675 12.2033 3.2 9 3.2C5.79675 3.2 3.2 5.79675 3.2 9C3.2 12.2033 5.79675 14.8 9 14.8ZM9 16C12.866 16 16 12.866 16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16ZM6 9.80001C5.55817 9.80001 5.2 9.44184 5.2 9.00001C5.2 8.55819 5.55817 8.20001 6 8.20001L8.2 8.20001V6C8.2 5.55817 8.55817 5.2 9 5.2C9.44183 5.2 9.8 5.55817 9.8 6V8.2L12 8.2C12.4418 8.2 12.8 8.55817 12.8 9C12.8 9.44183 12.4418 9.8 12 9.8L9.8 9.8V12C9.8 12.4418 9.44183 12.8 9 12.8C8.55817 12.8 8.2 12.4418 8.2 12V9.80001L6 9.80001Z"
				fill="currentColor"
			/>
		</IconGeneral>
	)
}
