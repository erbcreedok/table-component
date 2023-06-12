import IconButton from '@mui/material/IconButton'
import { useState, KeyboardEvent } from 'react'
import {
	Box,
	ClickAwayListener,
	InputAdornment,
	inputBaseClasses,
	OutlinedInput,
	outlinedInputClasses,
} from '@mui/material'

import { Colors } from '../../../../../components/styles'
import { useTableContext } from '../../../../../context/useTableContext'

interface PresetInputProps {
	id?: number
	name?: string
	onSavePreset(value: string, id?: number): void
	onClose(): void
}

export const PresetInput = ({
	id,
	name = '',
	onSavePreset,
	onClose,
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
		onClose()
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
			<Box sx={{ py: '3px', px: '6px' }}>
				<OutlinedInput
					placeholder="Enter name"
					fullWidth
					autoFocus
					sx={{
						pr: '6px',
						[`& .${inputBaseClasses.input}`]: {
							fontSize: '14px',
							p: '6px',
							height: '18px',
						},
						[`&.${outlinedInputClasses.focused} .${outlinedInputClasses.notchedOutline}`]:
							{
								borderWidth: '1px',
								boxShadow: `0 0 0 3px ${Colors.LightestBlue}`,
							},
					}}
					endAdornment={
						<InputAdornment position="end" sx={{}}>
							{value.length > 0 && (
								<Box sx={{ display: 'flex', gap: '6px' }}>
									<IconButton onClick={handleSave} disableRipple sx={{ p: 0 }}>
										<CheckIcon style={{ width: 18, height: 18 }} />
									</IconButton>
									<IconButton
										onClick={handleResetValue}
										disableRipple
										sx={{ p: 0 }}
									>
										<CloseIcon style={{ width: 18, height: 18 }} />
									</IconButton>
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
