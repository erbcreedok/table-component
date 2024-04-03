import { Preset, PresetState } from '../../TableToolbar/components/buttons/PresetButton'
import { DEFAULT_PRESETS } from '../../TableToolbar/components/buttons/presetContants'

const getDefaultPreset = (state: Partial<PresetState>, defaultPreset?: Preset[]) => {
	if (defaultPreset) {
		return defaultPreset
	}

	return DEFAULT_PRESETS.map((preset) => ({
		...preset,
		state: { ...preset.state, ...state }
	}))
}

export const getTablePresetProps = (
	presetStorageName,
	defaultPreset?: Preset[]
) => ({
	onSavePresets: (presets) => {
		global.localStorage.setItem(presetStorageName, JSON.stringify(presets))
	},
	onGetPresets: () => {
		try {
			return JSON.parse(global.localStorage.getItem(presetStorageName) as string)
		} catch (e) {
			return defaultPreset ?? DEFAULT_PRESETS
		}
	},
	onGetDefaultPresets: (state) => getDefaultPreset(state, defaultPreset),
})
