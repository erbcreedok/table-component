import { DECIMAL_PLACES } from './constants'

export const getValidNumber =
	({ decimalPlaces = DECIMAL_PLACES, min = -Infinity, max = Infinity }) =>
	(value: string) => {
		if (value === '' || value === null || value === undefined) return value

		const cleanedValue = value.replace(/[^0-9,.-]/g, '')

		// Replace comma with dot for proper conversion to number
		const sanitizedValue = cleanedValue.replace(',', '.')

		const numberValue = Number(sanitizedValue)
		if (Number.isNaN(numberValue)) return false

		if (numberValue < min) return min
		if (numberValue > max) return max

		// restrict decimal places
		if (decimalPlaces !== undefined) {
			const start = value.indexOf('.')
			const end = value.length - 1

			if (start >= 0 && start < end && end - start > decimalPlaces) return false
		}

		return sanitizedValue
	}
