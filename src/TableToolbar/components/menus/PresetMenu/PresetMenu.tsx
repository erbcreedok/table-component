import { Divider, Menu, MenuList, Typography } from '@mui/material'

import type { TableInstance } from '../../../../index'
import { Colors, Text } from '../../../../components/styles'
import { Preset, PresetState } from '../../buttons/PresetButton'

import { CustomPreset } from './components/CustomPreset'
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
		suggestedPresets,
		customPresets,
		handleSelectPreset,
		handleDeletePreset,
		handleSavePresetWithNewName,
		handleCreateNewPreset,
		handleSaveInCurrent,
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
					boxShadow:
						'0px 2px 10px rgba(29, 30, 38, 0.1), 0px 1px 2px rgba(29, 30, 38, 0.1)',
					mt: 1.5,
				},
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			<div>
				<Typography
					variant="subtitle2"
					sx={{
						marginLeft: '16px',
						color: `${Text.Primary}`,
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
			</div>
			{(!isStateTheSame || !!customPresets.length) && (
				<Divider sx={{ borderColor: `${Colors.Lightgray}` }} />
			)}
			{!!customPresets.length && (
				<div>
					<Typography
						variant="subtitle2"
						sx={{
							paddingTop: '8px',
							marginLeft: '16px',
							color: `${Text.Primary}`,
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
							/>
						))}
					</MenuList>
				</div>
			)}
			{!isStateTheSame && (
				<PresetsFooter
					checkedPresetId={checkedPreset?.id}
					customPresets={customPresets}
					onCreateNewPreset={handleCreateNewPreset}
					onSaveInCurrent={handleSaveInCurrent}
				/>
			)}
		</Menu>
	)
}
