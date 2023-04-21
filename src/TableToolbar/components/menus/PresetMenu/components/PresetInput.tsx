import { useState, KeyboardEvent } from 'react'
import {
	Box,
	Button,
	ClickAwayListener,
	InputAdornment,
	OutlinedInput,
} from '@mui/material'

import { useTableContext } from '../../../../../context/useTableContext'

interface PresetInputProps {
	id?: number
	name?: string
	onSavePreset(value: string, id?: number): void
	setEditMode(value: boolean): void
}

export const PresetInput = ({
	id,
	name = '',
	onSavePreset,
	setEditMode,
}: PresetInputProps) => {
	const {
		table: {
			options: {
				icons: { CheckIcon, CloseIcon },
			},
		},
	} = useTableContext()

	const handleCloseEditMode = (newName: string = name) => {
		setValue(newName)
		setEditMode(false)
	}

	const [value, setValue] = useState(name)

	const handleInputChange = (e) => {
		e.preventDefault()
		setValue(e.target.value)
	}

	const handleSave = () => {
		onSavePreset(value, id)
		handleCloseEditMode(value)
	}

	const handleResetValue = () => {
		handleCloseEditMode()
	}

	const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && value.length > 0) {
			handleSave()
		}
	}

	return (
		<ClickAwayListener mouseEvent="onMouseDown" onClickAway={handleResetValue}>
			<Box sx={{ m: '4px', mb: '8px' }}>
				<OutlinedInput
					placeholder="Enter name"
					fullWidth
					autoFocus
					sx={{
						pr: '3px',
						'& .MuiInputBase-input': {
							fontSize: '14px',
							p: '8px 12px',
						},
					}}
					endAdornment={
						<InputAdornment position="end" sx={{}}>
							{value.length > 0 && (
								<Box sx={{ display: 'flex', gap: '2px' }}>
									<Button
										variant="contained"
										color="success"
										onClick={handleSave}
										disableRipple
										sx={{
											minWidth: 'auto',
											width: '30px',
											height: '30px',
											boxShadow: 'none',
										}}
									>
										<CheckIcon style={{ width: 18, height: 18 }} />
									</Button>
									<Button
										variant="outlined"
										color="secondary"
										onClick={handleResetValue}
										disableRipple
										sx={{
											minWidth: 'auto',
											width: '30px',
											height: '30px',
										}}
									>
										<CloseIcon style={{ width: 18, height: 18 }} />
									</Button>
								</Box>
							)}
						</InputAdornment>
					}
					value={value}
					onChange={handleInputChange}
					onKeyDown={handleEnterKeyDown}
				/>
			</Box>
		</ClickAwayListener>
	)
}
