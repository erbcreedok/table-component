import { Box, Button, Checkbox, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Table_ColumnActionsFiltersMenuProps, TableData } from "../../../TableComponent";

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
export const ColumnActionsFiltersMenu = <TData extends TableData>(props: Table_ColumnActionsFiltersMenuProps<TData>) => {
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
