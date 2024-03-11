export const sortArrayBy = <P = unknown, V = unknown>(
	array: P[],
	getSortingItem: (item: P) => V,
	getCompareValue: (sortingItem: V) => number
) => {
	const orderedArray = [...array]
	orderedArray.sort((a, b) => {
		return (
			getCompareValue(getSortingItem(a)) - getCompareValue(getSortingItem(b))
		)
	})

	return orderedArray
}
