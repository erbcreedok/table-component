import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import React, { MouseEventHandler, useCallback, useState } from 'react'
import { Box, MenuItem, Modal, ThemeProvider, Typography } from '@mui/material'

import { ModalPaper } from '../../../../../components/Modal'
import { Colors, IconsColor } from '../../../../../components/styles'
import { useTableContext } from '../../../../../context/useTableContext'
import { modalTheme } from '../../../../../theme/modalTheme'

import { PresetIcon } from './PresetIcon'
import { PresetInput } from './PresetInput'

interface CustomPresetProps {
	id: number
	name: string
	checkedPresetId?: number
	editingPresetId: number | null | string
	setEditingPresetId: (value: number | null) => void
	onDeletePreset(id: number): MouseEventHandler<HTMLButtonElement>
	onSaveWithNewName(value: string, id: number): void
	onSelectPreset(id: number): () => void
}

export const CustomPreset = ({
	id,
	name,
	checkedPresetId,
	editingPresetId,
	setEditingPresetId,
	onDeletePreset,
	onSaveWithNewName,
	onSelectPreset,
}: CustomPresetProps) => {
	const {
		table: {
			options: {
				icons: { CheckIcon, PencilIcon, TrashIcon, CloseIcon },
				localization,
			},
		},
	} = useTableContext()
	const [isDeleting, setIsDeleting] = useState(false)

	const handleOpenEditMode = useCallback(
		(event) => {
			event.stopPropagation()

			setEditingPresetId(id)
		},
		[id, setEditingPresetId]
	)

	return (
		<>
			{editingPresetId === id ? (
				<PresetInput
					id={id}
					name={name}
					onSavePreset={onSaveWithNewName}
					onClose={() => setEditingPresetId(null)}
				/>
			) : (
				<MenuItem
					sx={{
						display: 'flex',
						alignItems: 'center',
						p: '9px 12px',
						'&:hover': {
							backgroundColor: Colors.Gray20,
						},
					}}
					onClick={onSelectPreset(id)}
				>
					<Typography
						variant="body2"
						sx={{ mr: 'auto', lineHeight: '18px' }}
						noWrap
					>
						{name}
					</Typography>
					<Box
						sx={{
							display: 'flex',
							gap: '6px',
							flexShrink: 1,
							alignItems: 'center',
						}}
					>
						<PresetIcon
							onClick={(e) => {
								e.stopPropagation()
								setIsDeleting(true)
							}}
						>
							<TrashIcon />
						</PresetIcon>
						<PresetIcon onClick={handleOpenEditMode}>
							<PencilIcon />
						</PresetIcon>
						<PresetIcon selected={checkedPresetId === id}>
							<CheckIcon />
						</PresetIcon>
					</Box>
				</MenuItem>
			)}
			<ThemeProvider theme={modalTheme}>
				<Modal open={isDeleting} onClose={() => setIsDeleting(false)}>
					<ModalPaper sx={{ width: '400px' }}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								p: '15px 21px 15px 23.5px',
							}}
						>
							<Typography
								sx={{ fontWeight: '600', fontSize: '18px', lineHeight: '30px' }}
							>
								{localization.confirmDeletion}
							</Typography>
							<IconButton
								sx={{ ml: 'auto', p: '3px', color: IconsColor.default }}
								onClick={() => setIsDeleting(false)}
							>
								<CloseIcon />
							</IconButton>
						</Box>
						<Typography
							sx={{
								lineHeight: '24px',
								p: '6px 24px 18px',
								fontSize: '14px',
							}}
							dangerouslySetInnerHTML={{
								__html: localization.confirmPresetDeletionMessage.replace(
									'{presetName}',
									'<strong>"preset"</strong>'
								),
							}}
						/>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'flex-end',
								gap: '12px',
								p: '12px 24px',
							}}
						>
							<Button
								variant="outlined"
								color="secondary"
								onClick={() => setIsDeleting(false)}
							>
								Cancel
							</Button>
							<Button
								variant="contained"
								color="error"
								onClick={onDeletePreset(id)}
							>
								Delete
							</Button>
						</Box>
					</ModalPaper>
				</Modal>
			</ThemeProvider>
		</>
	)
}
