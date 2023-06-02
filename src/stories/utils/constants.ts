export const Colors = {
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
}

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
