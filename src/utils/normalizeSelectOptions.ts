export const normalizeSelectOptions = (
	selectOptions: (string | { label: string; value: any })[]
) => {
	return selectOptions.map((option) => {
		if (typeof option === 'string') {
			return {
				label: option,
				value: option,
			}
		}

		return option
	})
}
