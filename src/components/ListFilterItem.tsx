import React, { FC } from 'react'
import { BoxProps, Typography } from '@mui/material'

import { useTableContext } from '../context/useTableContext'
import { FilterItemBoxStyled } from '../TableStatusBar/FilterChip/FilterChip.styles'

type ListItemProps = {
	isChecked?: boolean
	title: string
} & BoxProps

export const ListFilterItem: FC<ListItemProps> = ({
	isChecked,
	title,
	...rest
}) => {
	const {
		table: {
			options: {
				icons: { CheckIcon },
			},
		},
	} = useTableContext()

	return (
		<FilterItemBoxStyled component="div" {...rest}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{title}
			</Typography>

			{isChecked && <CheckIcon style={{ fill: '#009ECC', fontSize: '16px' }} />}
		</FilterItemBoxStyled>
	)
}
