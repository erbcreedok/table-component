import {
	Colors,
	IconsColor,
	DEFAULT_FONT_FAMILY,
} from '../../../components/styles'

export const MOCK_STATE_1 = {
	columnOrder: [
		'teamMember',
		'impact',
		'performance',
		'riskOfLeaving',
		'successionStatus',
		'location',
	],
	grouping: ['impact', 'performance'],
	sorting: [],
	columnFilters: [],
	columnVisibility: {
		location: false,
	},
}

export const MOCK_STATE_2 = {
	columnOrder: [
		'teamMember',
		'impact',
		'performance',
		'riskOfLeaving',
		'successionStatus',
		'location',
	],
	grouping: ['performance', 'impact'],
	sorting: [],
	columnFilters: [
		{
			id: 'impact',
			value: ['Low'],
		},
		{
			id: 'performance',
			value: ['Meets'],
		},
	],
	columnVisibility: {
		location: false,
		successionStatus: false,
		riskOfLeaving: false,
		performance: true,
	},
}

export const MOCK_STATE_3 = {
	columnOrder: [
		'teamMember',
		'performance',
		'successionStatus',
		'riskOfLeaving',
		'impact',
		'location',
	],
	grouping: ['performance'],
	sorting: [
		{
			id: 'performance',
			desc: true,
		},
	],
	columnFilters: [],
	columnVisibility: {
		location: false,
		impact: false,
		riskOfLeaving: false,
	},
}

export const DEFAULT_PRESETS = [
	{
		id: 0,
		name: 'Default Preset',
		checked: true,
		suggested: true,
		state: MOCK_STATE_1,
	},
	{
		id: 1,
		name: 'Perfomance',
		checked: false,
		suggested: true,
		state: MOCK_STATE_2,
	},
	{
		id: 2,
		name: 'Attrition',
		checked: false,
		suggested: true,
		state: MOCK_STATE_3,
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
