import { Colors } from './constants'

export const getTeamsBorderColorSet = (): Record<string, Record<string, string>> => ({
	impact: {
		'Critical': Colors.purple,
		'High': Colors.danger,
		'Medium': Colors.orange,
		'Low': Colors.leaf,
	},
	performance: {
		'Often exceeds': Colors.purple,
		'Sometimes exceeds': Colors.ocean,
		'Meets': Colors.leaf,
	},
	riskOfLeaving: {
		'Leaver': Colors.brick,
		'High': Colors.danger,
		'Medium': Colors.orange,
		'Low': Colors.leaf,
	}
})
