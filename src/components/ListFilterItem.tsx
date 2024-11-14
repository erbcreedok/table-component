import { BoxProps, CircularProgress, Typography } from '@mui/material'
import React, { FC } from 'react'

import { useTableContext } from '../context/useTableContext'
import { FilterItemBoxStyled } from '../TableStatusBar/FilterChip/FilterChip.styles'

import { TextColor } from './styles'

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

export const ListFilterLoadingItem = ({
	loadingText,
}: {
	loadingText: string
}) => (
	<FilterItemBoxStyled component="div">
		<Typography
			variant="body2"
			style={{ color: TextColor.Disabled, fontSize: 14 }}
		>
			{loadingText}
			<CircularProgress size={12} sx={{ ml: 1 }} />
		</Typography>
	</FilterItemBoxStyled>
)
