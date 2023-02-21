import { Colors } from './constants'

export const getTeamsCellBackgroundSet = (): Record<string, Record<string, string>> => ({
	impact: {
		'Critical': Colors.red1,
		'High': Colors.red2,
	},
	riskOfLeaving: {
		'Leaver': Colors.red1,
		'High': Colors.red2,
	}
})
