import CheckIcon from '@mui/icons-material/Check'
import React, { FC } from 'react'
import { Typography } from '@mui/material'

import { FilterItemBoxStyled } from '../FilterChip.styles'

interface ListItemProps {
	isChecked: boolean
	title: string
	onCheck: any
}

export const ListFilterItem: FC<ListItemProps> = ({
	isChecked,
	title,
	onCheck,
}) => {
	return (
		<FilterItemBoxStyled component="div" onClick={onCheck}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{title}
			</Typography>

			{isChecked && <CheckIcon style={{ fill: '#009ECC', fontSize: '16px' }} />}
		</FilterItemBoxStyled>
	)
}
