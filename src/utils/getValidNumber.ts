export const getValidNumber =
	(min = -Infinity, max = Infinity) =>
	(value: any) => {
		if (value === '' || value === null || value === undefined) return value
		const numberValue = Number(value)
		if (Number.isNaN(numberValue)) return value

		if (numberValue < min) return min
		if (numberValue > max) return max

		return numberValue
	}
