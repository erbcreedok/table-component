import { Preset } from '../../TableToolbar/components/buttons/PresetButton'

const DEFAULT_PRESETS: Preset[] = [
	{
		id: 0,
		name: 'Default',
		checked: true,
		suggested: true,
		state: {
			columnOrder: undefined,
			grouping: undefined,
			sorting: undefined,
			columnFilters: undefined,
			columnVisibility: undefined,
		},
	}
]
export const getTablePresetProps = (
	presetStorageName,
	defaultPreset: Preset[] = DEFAULT_PRESETS
) => ({
	onSavePresets: (presets) => {
		localStorage.setItem(presetStorageName, JSON.stringify(presets))
	},
	onGetPresets: () => {
		try {
			return JSON.parse(localStorage.getItem(presetStorageName) as string)
		} catch (e) {
			return defaultPreset
		}
	},
	onGetDefaultPresets: () => defaultPreset,
})
