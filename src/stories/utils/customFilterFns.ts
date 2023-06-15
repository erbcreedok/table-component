import { FilterFn } from '@tanstack/react-table'
import { subtractMonth } from './subtractMonth'

export const anyOfDateRange: FilterFn<any> = (row, columnId, filterValues) => {
	const value = row.getValue(columnId)
	const date = new Date(value as Date)
	const checkValue = (filterValue: string) => {
		if (Number.isNaN(date.getDate())) {
			return filterValue === 'N/A'
		}
		if (date > subtractMonth(1)) {
			return filterValue === 'Less than 1 months'
		}
		if (date < subtractMonth(3)) {
			return filterValue === 'More than 3 months'
		}
		return filterValue === 'Between 1 and 3 months'
	}
	return filterValues.some(checkValue)
}
anyOfDateRange.autoRemove = (val) => !val || !val.length
