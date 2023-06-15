export const sortByStringArray = <T>(
	values: T[],
	array: string[],
	getValue: (option: T) => string = (a) => a?.toString() ?? ''
) => {
	return [...values].sort((a, b) => {
		return array.indexOf(getValue(a)) - array.indexOf(getValue(b))
	})
}
