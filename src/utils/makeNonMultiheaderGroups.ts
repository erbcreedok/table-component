export const makeNonMultiheaderGroups = (columns, allMultirowColumns) => {
	return {
		text: '',
		columns: columns.filter(
			(column) => !allMultirowColumns?.includes(column.id)
		),
	}
}
