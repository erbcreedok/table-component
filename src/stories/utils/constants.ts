import { utilColumns } from '../../'

export const Colors = {
	bg: '#f5f6fa',
	danger: '#FA4B4B',
	orange: '#F67E00',
	lightestGrey: '#E1E3EB',
	lightGrey: '#EBEDF5',
	purple: '#7833FF',
	ocean: '#009ECC',
	leaf: '#6DBE72',
	brick: '#B32424',
	red1: '#FDE1E1',
	red2: '#FFF6F6',
	white: '#FFFFFF',
}

export const MOCK_STATE_1 = {
	columnOrder: [],
	grouping: [],
	sorting: [],
	columnFilters: [],
	columnVisibility: {},
}

export const MOCK_STATE_2 = {
	columnOrder: [
		utilColumns.actions,
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
		utilColumns.actions,
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

export const DEFAULT_TEAMS_PRESETS = [
	{
		id: 0,
		name: 'Default',
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

export const performanceValues = [
	'Fails',
	'Below',
	'Meet',
	'Exceed',
	'Exceed++',
]
