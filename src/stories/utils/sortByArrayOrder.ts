export const sortByArrayOrder = (array: unknown[]) => (a: unknown, b: unknown) => {
	const indexA = array.indexOf(a)
	const indexB = array.indexOf(b)

	if (indexA === -1) return 1
	if (indexB === -1) return -1

	return indexA - indexB
}
