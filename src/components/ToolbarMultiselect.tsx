import React, { useState, useEffect } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Divider from '@mui/material/Divider'

export const ToolbarMultiselect = ({
	options,
	table,
	onChangeFilter,
	appliedValues,
}) => {
	const [isOpen, setIsOpen] = useState(!appliedValues.length)
	const [value, setValue] = useState(appliedValues || [])
	const {
		options: { localization },
	} = table

	useEffect(() => {
		onChangeFilter(value)
	}, [value])

	const getDisplayedOptions = (allOptions, appliedOptions) => {
		return allOptions.filter((option) =>
			appliedOptions.every((applied) => applied.value !== option.value)
		)
	}

	return (
		<ClickAwayListener onClickAway={() => setIsOpen(false)}>
			<Autocomplete
				sx={{
					width: '100%',
					px: '25px',
					py: '9px',
					boxSizing: 'border-box',
					'& fieldset': {
						border: isOpen
							? 'solid 2px #1976d2 !important'
							: !value.length
							? 'solid 1px #CED0DB'
							: 'none',
					},
					'& input': {
						visibility: isOpen || !value.length ? 'visible' : 'hidden',
					},
					'& button': {
						visibility: isOpen || !value.length ? 'visible' : 'hidden',
					},
					'&:hover': {
						'& > div': {
							background: !isOpen && value.length ? '#EBEDF5' : '#fff',
						},
						'& > div > div:hover fieldset': {
							border: 'solid 1px #CED0DB',
						},
						'& input': {
							visibility: 'visible',
							background: !isOpen && value.length ? '#EBEDF5' : '#fff',
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
				open={isOpen}
				value={value}
				onChange={(event: any, newValue: any) => {
					event.preventDefault()
					event.stopPropagation()
					setValue(newValue)
				}}
				disableCloseOnSelect
				options={getDisplayedOptions(options, value)}
				onOpen={() => setIsOpen(true)}
				renderInput={(params) => (
					<TextField
						{...params}
						variant="outlined"
						placeholder="Choose a value"
						hiddenLabel
						autoFocus
						sx={{ border: 'none' }}
					/>
				)}
				renderOption={(props, option) => (
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
							{getDisplayedOptions(options, value).length ? (
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
										onClick={(e) => {
											setValue(options)
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
