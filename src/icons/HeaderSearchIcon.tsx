import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const HeaderSearchIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 18 18" sx={{ width: 18, height: 18 }}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.5 15C4.91015 15 2 12.0899 2 8.5C2 4.91015 4.91015 2 8.5 2C12.0899 2 15 4.91015 15 8.5C15 9.9341 14.5356 11.2597 13.7489 12.3347L16.4142 15L15 16.4142L12.3347 13.7489C11.2597 14.5356 9.9341 15 8.5 15ZM8.5 13C10.9853 13 13 10.9853 13 8.5C13 6.01472 10.9853 4 8.5 4C6.01472 4 4 6.01472 4 8.5C4 10.9853 6.01472 13 8.5 13Z"
			/>
		</SvgIcon>
	)
}
