import { SelectOption } from '..'

export const getFilterValueText = (
	filterValue: unknown,
	filterOptions: undefined | (string | SelectOption)[]
): string | string[] => {
	const findOptionLabelRelatedToFilterValue = (
		filterVal: string,
		allOptions: (string | SelectOption)[]
	) => {
		const option = allOptions?.find(
			(opt: string | SelectOption) =>
				typeof opt !== 'string' && opt.value === filterVal
		)

		return !option || typeof option === 'string' ? filterVal : option.label
	}
	const filterOptionsDefined =
		filterOptions &&
		filterOptions.length > 0 &&
		typeof filterOptions[0] !== 'string'

	if (Array.isArray(filterValue)) {
		if (filterOptionsDefined) {
			const mappedFilterValueByOptionLabel = (
				filterValue as [string, string]
			).map((filterVal) => {
				return findOptionLabelRelatedToFilterValue(filterVal, filterOptions)
			})

			return mappedFilterValueByOptionLabel
		}

		return filterValue as [string, string]
	}
	const filterVal = filterValue as string
	if (filterOptionsDefined) {
		return findOptionLabelRelatedToFilterValue(filterVal, filterOptions)
	}

	return filterValue as string
}
