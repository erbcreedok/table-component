export const isLessThan = (value: any, min = -Infinity) => {
	const numberValue = Number(value)
	if (Number.isNaN(numberValue)) return false

	return numberValue < min
}
