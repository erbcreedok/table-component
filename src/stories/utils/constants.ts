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

export const muiTableHeadCellFilterLabelProps = {
	control: { type: 'select' },
	defaultValue: 'None',
	options: [
		'None',
		'Hide filter icon',
		'Custom tooltip text',
		'Custom tooltip text with value context',
		'Prevent TableHeadMenu open on click',
	],
	mapping: {
		'None': undefined,
		'Hide filter icon': {
			boxProps: { sx: { display: 'none' }}
		},
		'Custom tooltip text': {
			tooltipProps: { title: 'Custom tooltip text' }
		},
		'Custom tooltip text with value context': ({ column }) => {
			const columnTitle = column.columnDef.header
			const filterValue = column.getFilterValue()?.toString() ?? ''
			return {
				tooltipProps: { title: `${columnTitle}: ${filterValue}` }
			}
		},
		'Prevent TableHeadMenu open on click': {
			buttonProps: { onClick: (e) => { e.stopPropagation() }}
		},
	},
}


export const muiSidebarProps = {
	control: { type: 'select' },
	defaultValue: 'None',
	options: [
		'None',
		'Full Width',
		'Dark background',
	],
	mapping: {
		'None': undefined,
		'Full Width': { PaperProps: { sx: { width: '100%' }}},
		'Dark background': {
			PaperProps: { sx: { backgroundColor: Colors.lightGrey }}
		},
	},
	description: 'Props for sidebars in Table Component, overrides default values',
}

export const muiMenuProps = {
	control: { type: 'select' },
	defaultValue: 'None',
	options: [
		'None',
		'Width: 360px',
		'LightGray background',
	],
	mapping: {
		'None': undefined,
		'Width: 360px': {
			// `minWidth: 0` is needed to override default `minWidth: 660`
			sidebarProps: { PaperProps: { sx: { width: 360, minWidth: 0 }}}
		},
		'LightGray background': {
			sidebarProps: { PaperProps: { sx: { backgroundColor: Colors.lightestGrey }}}
		},
	},
	description: 'Props for the menu sidebar, overrides default values and also muiSidebarProps',
}


export const muiColumnsMenuProps = muiMenuProps
export const muiGroupingMenuProps = muiMenuProps
export const muiFiltersMenuProps = muiMenuProps
export const muiSortingMenuProps = muiMenuProps

export const enableEditingHighlighting = {
	control: 'boolean',
	defaultValue: true,
	description:
		'Highlight cells that have been edited. This is useful for showing users which cells have been changed.',
}
export const muiTableStatusClearAllButtonProps = {
	control: { type: 'select' },
	defaultValue: 'None',
	options: ['None', 'Reset to Default Preset'],
	mapping: {
		None: undefined,
		'Reset to Default Preset': ({ table }) => ({
			onClick: () => {
				const defaultPreset = table.getPresets()[0]
				table.setCurrentPreset(defaultPreset.id)
			},
		}),
	},
	description: 'Props for the "Clear All" button in Table Status Bar',
}
