export const getValidNumber =
	(min = -Infinity, max = Infinity) =>
	(value: any) => {
		if (value === '' || value === null || value === undefined) return value

		const cleanedValue = value.replace(/[^0-9,.]/g, '')

		// Replace comma with dot for proper conversion to number
		const sanitizedValue = cleanedValue.replace(',', '.')

		const numberValue = Number(sanitizedValue)
		if (Number.isNaN(numberValue)) return false

		if (numberValue < min) return min
		if (numberValue > max) return max

		return sanitizedValue
	}
