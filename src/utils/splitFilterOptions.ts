// function takes all options of a filter and returns an object with array of all selected values and not selected values
import { FilterOption } from '../TableComponent'

import { sortByStringArray } from './sortByStringArray'

export const splitFilterOptions = (
	options: FilterOption[],
	values: string[]
) => {
	if (!values) return { selectedOptions: [], notSelectedOptions: options }

	const selectedOptions: FilterOption[] = []
	const notSelectedOptions: FilterOption[] = []

	options.forEach((option) => {
		if (values.includes(option.value)) {
			selectedOptions.push(option)
		} else {
			notSelectedOptions.push(option)
		}
	})

	return {
		selectedOptions: sortByStringArray(selectedOptions, values, (a) => a.value),
		notSelectedOptions,
	}
}
