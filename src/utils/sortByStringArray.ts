// puts unspecified values in front
export const sortByStringArray = <T>(
	values: readonly T[],
	array: readonly string[],
	getValue: (option: T) => string = (a) => a?.toString() ?? ''
) => {
	return [...values].sort((a, b) => {
		return array.indexOf(getValue(a)) - array.indexOf(getValue(b))
	})
}

// puts unspecified values at the end
export const sortByStringArrayEnd = <T>(
	values: readonly T[],
	array: readonly string[],
	getValue: (option: T) => string = (a) => a?.toString() ?? ''
) => {
	return [...values].sort((a, b) => {
		const indexOfA = array.indexOf(getValue(a))
		const indexOfB = array.indexOf(getValue(b))

		if (indexOfA === -1) return 1
		if (indexOfB === -1) return -1

		return indexOfA - indexOfB
	})
}
