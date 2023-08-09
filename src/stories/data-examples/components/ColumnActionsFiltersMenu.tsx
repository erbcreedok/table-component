import { Box, Button, Checkbox, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { Table_ColumnActionsFiltersMenuProps } from "../../../TableComponent";

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
		onCheckAllFilters,
		onApplyFilters,

		toggleSubMenu,
	} = props

	useEffect(() => {
		return () => {
			toggleSubMenu()
		}
	}, [])

	return (
		<div style={{ minWidth: 245, padding: '0 15px' }}>
			<Typography
				variant="body2"
				color="#303240"
				style={{ fontWeight: 600 }}
			>
				Filters
			</Typography>

			<Box>
				<Box
					sx={{
						borderBottom: '1px solid #E1E3EB',
						paddingBottom: '15px',
					}}
				>
					<SubFilterItem
						value="Select All"
						onClick={onCheckAllFilters}
						isChecked={selectedFilters.length === filterOptions.length}
					/>
				</Box>

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

			<Box
				sx={{
					borderTop: '1px solid #E1E3EB',
					display: 'flex',
					justifyContent: 'flex-end',
					paddingTop: '10px',
					marginTop: '15px',
				}}
			>
				<Button
					type="button"
					variant="contained"
					color="primary"
					onClick={onApplyFilters}
					sx={{ backgroundColor: '#009ECC', color: '#FFFFFF' }}
				>
					Apply
				</Button>
			</Box>
		</div>
	)
}
