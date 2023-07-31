import { BoxProps } from '@mui/material'
import { rankings, rankItem } from '@tanstack/match-sorter-utils'
import React, { useState, useMemo, FC, useRef } from 'react'
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

import { Colors } from './styles'

const Option: FC<BoxProps> = ({ children, sx, ...rest }) => (
	<Box
		sx={{
			color: Colors.Dark,
			cursor: 'pointer',
			mx: '9px',
			px: '16px',
			py: '9px',
			fontWeight: 400,
			fontSize: '14px',
			width: '100%',
			boxSizing: 'border-box',
			'&:hover': {
				backgroundColor: Colors.Gray10,
			},
			...sx,
		}}
		{...rest}
	>
		<Typography>{children}</Typography>
	</Box>
)

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
	const [inputValue, setInputValue] = useState('')
	const filteredOptions = useRef(notSelectedOptions)

	const handleChange = (event: any, newValue: FilterOption[]) => {
		setInputValue('')
		onChange(newValue.map((option) => option.value))
	}

	const handleFilterOptions = (options, { inputValue, getOptionLabel }) => {
		const filtered = options.filter(
			(option) =>
				rankItem(getOptionLabel(option), inputValue, {
					threshold: rankings.MATCHES,
				}).passed
		)
		filteredOptions.current = filtered

		return filtered
	}
	const handleSelectAll = (e) => {
		e.preventDefault()
		handleChange(e, [...selectedOptions, ...filteredOptions.current])
		setIsOpen(false)
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
				filterOptions={handleFilterOptions}
				clearOnBlur={false}
				inputValue={inputValue}
				onInputChange={(event, newInputValue) => {
					setInputValue(newInputValue)
				}}
				onOpen={() => setIsOpen(true)}
				noOptionsText={<Typography>{localization.noOptions}</Typography>}
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
						<Option>{option.label}</Option>
					</li>
				)}
				PaperComponent={({ children }) => (
					<Paper sx={{ backgroundColor: '#fff' }}>
						<>
							{filteredOptions.current.length ? (
								<>
									<Option
										sx={{ m: '9px 0', px: '25px' }}
										onClick={handleSelectAll}
									>
										{localization.selectAll}
									</Option>
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
