import {
	Colors,
	IconsColor,
	DEFAULT_FONT_FAMILY,
} from '../../../components/styles'

export const EMPTY_STATE = {
	columnOrder: [],
	grouping: [],
	sorting: [],
	columnFilters: [],
	columnVisibility: {},
}

export const DEFAULT_PRESETS = [
	{
		id: 0,
		name: 'Default Preset',
		checked: true,
		suggested: true,
		state: EMPTY_STATE,
	},
]

export const PRESET_THEME = {
	palette: {
		success: {
			main: `${Colors.LightGreen}`,
			contrastText: '#fff',
		},
		primary: {
			main: `${Colors.LightBlue}`,
		},
		secondary: {
			main: `${IconsColor.disabled}`,
		},
	},
	typography: {
		fontFamily: `${DEFAULT_FONT_FAMILY}`,
		subtitle1: {
			fontSize: 12,
			fontWeight: 600,
			height: '12px',
			lineHeight: '12px',
		},
		subtitle2: {
			fontSize: 12,
		},
		h6: {
			fontSize: 14,
			fontWeight: 600,
		},
	},
}
