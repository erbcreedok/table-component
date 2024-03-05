import { Colors } from './constants'

export const getTeamsBorderColorSet = (): Record<
	string,
	Record<string, string>
> => ({
	impact: {
		Critical: Colors.purple,
		High: Colors.danger,
		Medium: Colors.orange,
		Low: Colors.leaf,
	},
	performance: {
		Fails: Colors.red1,
		Below: Colors.orange,
		Meet: Colors.white,
		Exceed: Colors.leaf,
		'Exceed++': Colors.leaf,
	},
	riskOfLeaving: {
		Leaver: Colors.brick,
		High: Colors.danger,
		Medium: Colors.orange,
		Low: Colors.leaf,
	},
})
