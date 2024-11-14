import { SvgIcon, SvgIconProps } from '@mui/material'
import React from 'react'

export const DragIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 8 12" sx={{ width: 8, height: 12 }}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M7.00001 12C7.55229 12 8.00001 11.5523 8.00001 11C8.00001 10.4477 7.55229 10 7.00001 10C6.44772 10 6.00001 10.4477 6.00001 11C6.00001 11.5523 6.44772 12 7.00001 12ZM8.00001 6C8.00001 6.55229 7.55229 7 7.00001 7C6.44772 7 6.00001 6.55228 6.00001 6C6.00001 5.44772 6.44772 5 7.00001 5C7.55229 5 8.00001 5.44772 8.00001 6ZM1.00001 12C1.55229 12 2.00001 11.5523 2.00001 11C2.00001 10.4477 1.55229 10 1.00001 10C0.447724 10 8.38865e-06 10.4477 8.36451e-06 11C8.34037e-06 11.5523 0.447724 12 1.00001 12ZM1.00001 7C1.55229 7 2.00001 6.55229 2.00001 6C2.00001 5.44772 1.55229 5 1.00001 5C0.447723 5 7.65354e-06 5.44772 7.62939e-06 6C7.60525e-06 6.55229 0.447723 7 1.00001 7ZM8.00001 1C8.00001 1.55229 7.55229 2 7.00001 2C6.44772 2 6.00001 1.55229 6.00001 1C6.00001 0.447716 6.44772 2.38127e-07 7.00001 2.62268e-07C7.55229 2.86409e-07 8.00001 0.447716 8.00001 1ZM1.00001 2C1.55229 2 2.00001 1.55228 2.00001 1C2.00001 0.447716 1.55229 2.41411e-08 1.00001 0C0.447724 -2.41411e-08 7.87209e-06 0.447716 7.84795e-06 1C7.82381e-06 1.55229 0.447724 2 1.00001 2Z"
				fill="currentColor"
			/>
		</SvgIcon>
	)
}
