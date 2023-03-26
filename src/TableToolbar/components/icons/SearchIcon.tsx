import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const SearchIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 18 18" sx={{ width: 18, height: 18 }}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.5 1.3125C4.08274 1.3125 1.3125 4.08274 1.3125 7.5C1.3125 10.9173 4.08274 13.6875 7.5 13.6875C9.00609 13.6875 10.3865 13.1494 11.4595 12.255L15.7273 16.5227C15.9469 16.7424 16.3031 16.7424 16.5227 16.5227C16.7424 16.3031 16.7424 15.9469 16.5227 15.7273L12.255 11.4595C13.1494 10.3865 13.6875 9.00609 13.6875 7.5C13.6875 4.08274 10.9173 1.3125 7.5 1.3125ZM2.4375 7.5C2.4375 4.70406 4.70406 2.4375 7.5 2.4375C10.2959 2.4375 12.5625 4.70406 12.5625 7.5C12.5625 10.2959 10.2959 12.5625 7.5 12.5625C4.70406 12.5625 2.4375 10.2959 2.4375 7.5Z"
				fill="#6C6F80"
			/>
		</SvgIcon>
	)
}
