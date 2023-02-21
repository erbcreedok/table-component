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

type Options = {
	colors?: string[]
	fallback?: string
	useRandom?: boolean
}
export const createGetColors = (colorsSet: Record<string, Record<string, string>>, options?: Options) => (columnId: string, value: unknown) => {
	const { colors = defaultColors, fallback = 'inherit', useRandom } = options || {}
	const key = getKey(value)
	if (value === undefined || value === null) return fallback
	const newColor = useRandom ? getRandomFromArray(colors) : fallback
	if (colorsSet[columnId]) {
		if (colorsSet[columnId][key]) {
			return colorsSet[columnId][key]
		}
		colorsSet[columnId][key] = newColor
		return newColor
	}
	colorsSet[columnId] = {}
	colorsSet[columnId][key] = newColor
	return newColor
}
