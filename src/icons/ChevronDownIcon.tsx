import React from 'react'
import { SvgIconProps } from '@mui/material'

import { IconGeneral } from './IconGeneral'

export const ChevronDownIcon = (props: SvgIconProps) => {
	return (
		<IconGeneral size={18} {...props} viewBox="0 0 18 18">
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M4.16475 6.16475C3.94508 6.38442 3.94508 6.74058 4.16475 6.96025L8.85225 11.6477C9.07192 11.8674 9.42808 11.8674 9.64775 11.6477L14.3352 6.96025C14.5549 6.74058 14.5549 6.38442 14.3352 6.16475C14.1156 5.94508 13.7594 5.94508 13.5398 6.16475L9.25 10.4545L4.96025 6.16475C4.74058 5.94508 4.38442 5.94508 4.16475 6.16475Z"
				fill="currentColor"
			/>
		</IconGeneral>
	)
}
