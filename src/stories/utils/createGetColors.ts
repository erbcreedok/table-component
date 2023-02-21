import { Colors } from './constants'
import { getRandomFromArray } from './getRandomFromArray'

const defaultColors = [
	Colors.danger,
	Colors.orange,
	Colors.purple,
	Colors.ocean,
	Colors.leaf,
	Colors.brick,
]
const getKey = (value: unknown) => {
	if (typeof value === 'string') return value

	return `${value}`
}
export const createGetColors = (colorsSet: Record<string, Record<string, string>>, colors = defaultColors) => (columnId: string, value: unknown) => {
	const key = getKey(value)
	if (value === undefined || value === null) return Colors.lightestGrey
	if (colorsSet[columnId]) {
		if (colorsSet[columnId][key]) {
			return colorsSet[columnId][key]
		}
		const color = getRandomFromArray(colors)
		colorsSet[columnId][key] = color
		return color
	}
	colorsSet[columnId] = {}
	const color = getRandomFromArray(colors)
	colorsSet[columnId][key] = color
	return color
}
