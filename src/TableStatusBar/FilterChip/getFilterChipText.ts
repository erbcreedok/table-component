export const getFilterChipText = (filterValue: unknown) => {
	if (filterValue === undefined) return 'N/A'
	if (filterValue === null) return 'N/A'
	if (filterValue === '') return 'N/A'
	if (Array.isArray(filterValue)) return filterValue.join(', ')

	return filterValue.toString()
}
