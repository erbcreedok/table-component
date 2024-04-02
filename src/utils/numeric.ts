export const sanitizeNumeric = (value: string) => {
	if (value === '' || value === null || value === undefined) return value

	value = value.replace(/[^0-9,.-]/g, '')
	value = value.replace(',', '.')

	return value
}

export const isNumeric = (str: any) => {
	switch (typeof str) {
		case 'number':
			return true
		case 'string':
			break
		default:
			return false
	}

	return (
		!Number.isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		!Number.isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
	)
}

export const roundDecimalPlaces = (decimalPlaces: number, value: number) =>
	(Math.round(value * 100) / 100).toFixed(decimalPlaces)
