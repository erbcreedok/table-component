import { Table_Column, TableData, TableInstance } from '../TableComponent'

export const getFilterTypeLabel = <TData extends TableData>(
	table: TableInstance<TData>,
	column: Table_Column<TData>
): string => {
	const {
		options: { localization },
	} = table
	if (column.columnDef.filterTypeLabel) {
		return column.columnDef.filterTypeLabel
	}

	const filterFnName = column.getFilterFn()?.name

	// TODO: get proper localization for no filter name
	if (!filterFnName) {
		return localization.isAnyOf
	}

	if (
		['fuzzy', 'includesString', 'includesStringSensitive', 'contains'].includes(
			filterFnName
		)
	) {
		return 'contains'
	}

	if (['equals', 'equalsString', 'weakEquals'].includes(filterFnName)) {
		return 'equals'
	}

	if (['lessThan', 'lessThanOrEqualTo'].includes(filterFnName)) {
		return 'is less than'
	}

	if (['greaterThan', 'greaterThanOrEqualTo'].includes(filterFnName)) {
		return 'is greater than'
	}

	if (['between', 'betweenInclusive'].includes(filterFnName)) {
		return 'is between'
	}

	return localization.isAnyOf
}
