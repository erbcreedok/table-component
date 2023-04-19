import { MouseEventHandler, useCallback, useState } from 'react'
import { Box, ListItemIcon, MenuItem, Typography } from '@mui/material'

import { Colors } from '../../../../../components/styles'
import { useTableContext } from '../../../../../context/useTableContext'

import { PresetInput } from './PresetInput'

interface CustomPresetProps {
	id: number
	name: string
	checkedPresetId?: number
	onDeletePreset(id: number): MouseEventHandler<HTMLDivElement>
	onSaveWithNewName(value: string, id: number): void
	onSelectPreset(id: number): () => void
}

export const CustomPreset = ({
	id,
	name,
	checkedPresetId,
	onDeletePreset,
	onSaveWithNewName,
	onSelectPreset,
}: CustomPresetProps) => {
	const {
		table: {
			options: {
				icons: { CheckIcon, PencilIcon, TrashIcon },
			},
		},
	} = useTableContext()

	const [isEditMode, setEditMode] = useState(false)

	const handleOpenEditMode = useCallback((event) => {
		event.stopPropagation()

		setEditMode(true)
	}, [])

	return (
		<div>
			{isEditMode ? (
				<PresetInput
					id={id}
					name={name}
					onSavePreset={onSaveWithNewName}
					setEditMode={setEditMode}
				/>
			) : (
				<MenuItem
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						p: '8px 16px',
						'& .MuiListItemIcon-root': {
							minWidth: '18px',
						},
					}}
					onClick={onSelectPreset(id)}
				>
					<Typography variant="body2" noWrap>
						{name}
					</Typography>
					<Box sx={{ display: 'flex', gap: '8px' }}>
						<ListItemIcon onClick={onDeletePreset(id)}>
							<TrashIcon />
						</ListItemIcon>
						<ListItemIcon onClick={handleOpenEditMode}>
							<PencilIcon />
						</ListItemIcon>
						{checkedPresetId === id && (
							<ListItemIcon
								sx={{
									color: `${Colors.LightBlue}`,
								}}
							>
								<CheckIcon />
							</ListItemIcon>
						)}
					</Box>
				</MenuItem>
			)}
		</div>
	)
}
