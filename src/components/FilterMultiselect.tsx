import React, { useState, useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'

import {
	FilterOption,
	Table_Column,
	TableData,
	TableInstance,
} from '../TableComponent'
import { getColumnFilterOptions } from '../utils/getColumnFilterOptions'
import { splitFilterOptions } from '../utils/splitFilterOptions'

export const FilterMultiselect = <TData extends TableData>({
	column,
	table,
	onChange,
	value = [],
	autoFocus,
}: {
	column: Table_Column<TData>
	table: TableInstance<TData>
	onChange: (value: FilterOption[]) => void
	value: string[]
	autoFocus?: boolean
}) => {
	const [isOpen, setIsOpen] = useState(autoFocus)
	const {
		options: { localization },
	} = table
	const options = useMemo(
		() => getColumnFilterOptions(column, table),
		[column, table]
	)
	const { selectedOptions, notSelectedOptions } = useMemo(
		() => splitFilterOptions(options, value),
		[options, value]
	)

	const handleChange = (event: any, newValue: FilterOption[]) => {
		onChange(newValue.map((option) => option.value))
	}

	return (
		<ClickAwayListener onClickAway={() => setIsOpen(false)}>
			<Autocomplete
				sx={{
					width: '100%',
					px: '12px',
					boxSizing: 'border-box',
					'& input': {
						visibility:
							isOpen || !selectedOptions.length ? 'visible' : 'hidden',
					},
					'& button': {
						visibility:
							isOpen || !selectedOptions.length ? 'visible' : 'hidden',
					},
					'&:hover': {
						'& > div': {
							background:
								!isOpen && selectedOptions.length ? '#EBEDF5' : '#fff',
						},
						'& > div > div:hover fieldset': {
							border: 'solid 1px #CED0DB',
						},
						'& input': {
							visibility: 'visible',
							background:
								!isOpen && selectedOptions.length ? '#EBEDF5' : '#fff',
						},
						'& button': {
							visibility: 'visible',
						},
						'& fieldset': {
							border: 'solid 1px #CED0DB',
						},
					},
				}}
				multiple
				value={selectedOptions}
				open={isOpen}
				onChange={handleChange}
				disableCloseOnSelect
				options={notSelectedOptions}
				onOpen={() => setIsOpen(true)}
				renderInput={(params) => (
					<TextField
						{...params}
						variant="outlined"
						placeholder="Choose a value"
						hiddenLabel
						autoFocus={autoFocus}
						sx={{ border: 'none' }}
					/>
				)}
				renderOption={(props, option: FilterOption) => (
					<li {...props} style={{ padding: 0, margin: 0 }}>
						<Box
							sx={{
								color: '#303240',
								cursor: 'pointer',
								mx: '9px',
								px: '16px',
								py: '9px',
								fontWeight: 400,
								fontSize: '14px',
								width: '100%',
								boxSizing: 'border-box',
								'&:hover': {
									backgroundColor: '#F5F6FA',
								},
							}}
						>
							<Typography>{option.label}</Typography>
						</Box>
					</li>
				)}
				PaperComponent={({ children }) => (
					<Paper sx={{ backgroundColor: '#fff' }}>
						<>
							{notSelectedOptions.length ? (
								<>
									<Box
										sx={{
											color: '#303240',
											cursor: 'pointer',
											mx: 0,
											my: '9px',
											px: '25px',
											py: '9px',
											fontWeight: 400,
											fontSize: '14px',
											width: '100%',
											boxSizing: 'border-box',
											'&:hover': {
												backgroundColor: '#F5F6FA',
											},
										}}
										onClick={() => {
											onChange(options.map((option) => option.value))
											setIsOpen(false)
										}}
									>
										<Typography>{localization.selectAll}</Typography>
									</Box>
									<Divider sx={{ width: '100%' }} />
								</>
							) : null}
							{children}
						</>
					</Paper>
				)}
			/>
		</ClickAwayListener>
	)
}
