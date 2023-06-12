import { Divider, MenuList, Typography } from '@mui/material'
import Box from '@mui/material/Box'

import { Menu } from '../../../../components/Menu'
import type { TableInstance } from '../../../../index'
import { Colors, Text } from '../../../../components/styles'
import { Preset, PresetState } from '../../buttons/PresetButton'

import { CustomPreset } from './components/CustomPreset'
import { PresetInput } from './components/PresetInput'
import { SuggestedPreset } from './components/SuggestedPreset'
import { PresetsFooter } from './components/PresetsFooter'
import { usePresetMenu } from './usePresetMenu'

interface PresetMenuProps<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
	anchorEl: HTMLElement
	presets: Preset[]
	checkedPreset?: Preset
	isStateTheSame: boolean
	open: boolean
	setCheckedPreset(preset: Preset): void
	setPresets(value: Preset[]): void
	handleClose(): void
	handleApplyPresetState(state: PresetState): void
}

export const PresetMenu = <TData extends Record<string, any> = {}>({
	table,
	anchorEl,
	presets,
	checkedPreset,
	isStateTheSame,
	open,
	setCheckedPreset,
	setPresets,
	handleClose,
	handleApplyPresetState,
}: PresetMenuProps<TData>) => {
	const {
		editingPresetId,
		setEditingPresetId,
		suggestedPresets,
		customPresets,
		handleSelectPreset,
		handleDeletePreset,
		handleSavePresetWithNewName,
		handleCreateNewPreset,
		handleUpdateCurrent,
	} = usePresetMenu({
		checkedPreset,
		presets,
		table,
		onApplyPresetState: handleApplyPresetState,
		onClose: handleClose,
		setCheckedPreset,
		setPresets,
	})

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			PaperProps={{
				sx: {
					width: '260px',
					mt: '6px',
				},
			}}
			MenuListProps={{
				sx: {
					p: 0,
				},
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			<Box sx={{ py: '6px' }}>
				<Typography
					variant="subtitle2"
					sx={{
						boxSizing: 'border-box',
						height: '30px',
						color: `${Text.Primary}`,
						padding: '9px 0 3px 12px',
					}}
				>
					Suggested View
				</Typography>
				<MenuList dense sx={{ p: 0 }}>
					{suggestedPresets.map(({ id, name }) => (
						<SuggestedPreset
							key={id}
							id={id}
							name={name}
							checkedPresetId={checkedPreset?.id}
							onSelectPreset={handleSelectPreset}
						/>
					))}
				</MenuList>
			</Box>
			{(!!customPresets.length || editingPresetId === 'new') && (
				<>
					<Divider sx={{ borderColor: `${Colors.Gray20}` }} />
					<Box sx={{ py: '6px' }}>
						<Typography
							variant="subtitle2"
							sx={{
								boxSizing: 'border-box',
								height: '30px',
								color: `${Text.Primary}`,
								padding: '9px 0 3px 12px',
							}}
						>
							My presets
						</Typography>
						<MenuList dense sx={{ p: 0 }}>
							{customPresets.map(({ id, name }) => (
								<CustomPreset
									key={id}
									id={id}
									name={name}
									checkedPresetId={checkedPreset?.id}
									onDeletePreset={handleDeletePreset}
									onSelectPreset={handleSelectPreset}
									onSaveWithNewName={handleSavePresetWithNewName}
									editingPresetId={editingPresetId}
									setEditingPresetId={setEditingPresetId}
								/>
							))}
						</MenuList>
						{editingPresetId === 'new' && (
							<PresetInput
								onSavePreset={handleCreateNewPreset}
								onClose={() => setEditingPresetId(null)}
							/>
						)}
					</Box>
				</>
			)}
			<Divider sx={{ borderColor: `${Colors.Gray20}` }} />
			<PresetsFooter
				onSaveAsNew={() => setEditingPresetId('new')}
				onUpdateCurrent={handleUpdateCurrent}
				isSaveAsNewEnabled={!editingPresetId}
				isUpdateCurrentEnabled={
					!editingPresetId &&
					!isStateTheSame &&
					customPresets?.some((preset) => preset.id === checkedPreset?.id)
				}
				table={table}
			/>
		</Menu>
	)
}
