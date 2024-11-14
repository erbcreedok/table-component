import { Divider, MenuList, Typography } from '@mui/material'
import Box from '@mui/material/Box'

import {
	Colors,
	Menu,
	TableData,
	type TableInstance,
	TextColor,
} from '../../../../'

import { CustomPreset } from './components/CustomPreset'
import { PresetInput } from './components/PresetInput'
import { PresetsFooter } from './components/PresetsFooter'
import { SuggestedPreset } from './components/SuggestedPreset'
import { usePresetMenu } from './usePresetMenu'

interface PresetMenuProps<TData = TableData> {
	table: TableInstance<TData>
	anchorEl: HTMLElement
	open: boolean
	handleClose(): void
}

export const PresetMenu = <TData,>({
	table,
	anchorEl,
	open,
	handleClose,
}: PresetMenuProps<TData>) => {
	const {
		editingPresetId,
		setEditingPresetId,
		handleSelectPreset,
		handleDeletePreset,
		handleSavePresetWithNewName,
		handleCreateNewPreset,
		handleUpdateCurrent,
	} = usePresetMenu({
		table,
		onClose: handleClose,
	})

	const currentPreset = table.getCurrentPreset()
	const isStateTheSame = table.getIsPresetStateSame()

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
						color: `${TextColor.Primary}`,
						padding: '9px 0 3px 12px',
					}}
				>
					Suggested View
				</Typography>
				<MenuList dense sx={{ p: 0 }}>
					{table.getSuggestedPresets().map(({ id, name }) => (
						<SuggestedPreset
							key={id}
							id={id}
							name={name}
							checkedPresetId={currentPreset?.id}
							onSelectPreset={handleSelectPreset}
						/>
					))}
				</MenuList>
			</Box>
			{(!!table.getCustomPresets().length || editingPresetId === 'new') && [
				<Divider key="divider" sx={{ borderColor: `${Colors.Gray20}` }} />,
				<Box key="box" sx={{ py: '6px' }}>
					<Typography
						variant="subtitle2"
						sx={{
							boxSizing: 'border-box',
							height: '30px',
							color: `${TextColor.Primary}`,
							padding: '9px 0 3px 12px',
						}}
					>
						My presets
					</Typography>
					<MenuList dense sx={{ p: 0 }}>
						{table.getCustomPresets().map(({ id, name }) => (
							<CustomPreset
								key={id}
								id={id}
								name={name}
								checkedPresetId={currentPreset?.id}
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
				</Box>,
			]}
			<Divider sx={{ borderColor: `${Colors.Gray20}` }} />
			<PresetsFooter
				onSaveAsNew={() => setEditingPresetId('new')}
				onUpdateCurrent={handleUpdateCurrent}
				isSaveAsNewEnabled={!editingPresetId && !isStateTheSame}
				isUpdateCurrentEnabled={
					!editingPresetId &&
					!isStateTheSame &&
					table
						.getCustomPresets()
						?.some((preset) => preset.id === currentPreset?.id)
				}
				table={table}
			/>
		</Menu>
	)
}
