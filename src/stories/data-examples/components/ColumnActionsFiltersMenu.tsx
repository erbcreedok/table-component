import { Box, Checkbox, Typography } from '@mui/material'
import React from 'react'
import { Table_ColumnActionsFiltersMenuProps } from '../../../TableComponent'

interface SubFilterItemProps {
	value: string
	isChecked: boolean
	onClick: () => void
}
const SubFilterItem = (props: SubFilterItemProps) => {
	const { value, isChecked, onClick } = props

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				marginTop: '15px',
			}}
		>
			<Checkbox
				onClick={onClick}
				checked={isChecked}
				sx={{ padding: 0, marginRight: '2px' }}
			/>
			<Typography variant="body2" color="#303240">
				{value}
			</Typography>
		</Box>
	)
}
export const ColumnActionsFiltersMenu = (props: Table_ColumnActionsFiltersMenuProps) => {
	const {
		selectedFilters,
		filterOptions,
		onCheckFilter,
	} = props

	return (
		<div style={{ minWidth: 245, padding: '0 15px' }}>
			<Typography
				variant="body2"
				color="#303240"
				style={{ fontWeight: 600 }}
			>
				Custom Filters
			</Typography>

			<Box>
				{filterOptions.map(({ value, label }) => {
					return (
						<SubFilterItem
							key={value}
							isChecked={selectedFilters.includes(value)}
							onClick={() => onCheckFilter(value)}
							value={label}
						/>
					)
				})}
			</Box>
		</div>
	)
}
