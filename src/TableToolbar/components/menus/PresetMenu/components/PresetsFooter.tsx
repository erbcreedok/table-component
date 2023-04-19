import { useCallback, useState } from 'react'
import { Box, Button, Typography } from '@mui/material'

import { Preset } from '../../../buttons/PresetButton'

import { PresetInput } from './PresetInput'

interface PresetsFooterProps {
	checkedPresetId?: number
	customPresets: Preset[]
	onCreateNewPreset(value: string): void
	onSaveInCurrent(): void
}

export const PresetsFooter = ({
	checkedPresetId,
	customPresets,
	onCreateNewPreset,
	onSaveInCurrent,
}: PresetsFooterProps) => {
	const [isEditMode, setIsEditMode] = useState(false)

	const handleOpenEditMode = useCallback((event) => {
		event.stopPropagation()

		setIsEditMode(true)
	}, [])

	return (
		<div>
			{isEditMode ? (
				<PresetInput
					onSavePreset={onCreateNewPreset}
					setEditMode={setIsEditMode}
				/>
			) : (
				<Box sx={{ display: 'flex', m: '10px 0 2px 16px', gap: '8px' }}>
					<Button
						variant="contained"
						color="success"
						sx={{
							textTransform: 'none',
							height: '24px',
							p: '6px',
						}}
						onClick={handleOpenEditMode}
					>
						<Typography variant="subtitle1" sx={{ flex: 'none' }} noWrap>
							Save as new
						</Typography>
					</Button>
					{customPresets.some(({ id }) => checkedPresetId === id) && (
						<Button
							variant="outlined"
							color="success"
							sx={{
								textTransform: 'none',
								height: '26px',
								p: '6px',
							}}
							onClick={onSaveInCurrent}
						>
							<Typography
								variant="subtitle1"
								sx={{
									flex: 'none',
								}}
								noWrap
							>
								Save in current
							</Typography>
						</Button>
					)}
				</Box>
			)}
		</div>
	)
}
