import { EMPTY_STATE, TableData, TableInstance } from '../../'
import { getValidColumnOrder } from '../../utils/getValidColumnOrder'

import { PresetState } from './presetTypes'

const getIsArraySame = (firstState, secondState) =>
	JSON.stringify(firstState) === JSON.stringify(secondState)

const getIsSortingSame = (presetSorting, tableSorting) => {
	if (presetSorting.length === tableSorting.length) {
		if (presetSorting.length === 0) {
			return true
		}

		if (presetSorting[0]?.id !== tableSorting[0]?.id) {
			return false
		}

		return presetSorting[0].desc === tableSorting[0].desc
	}

	return false
}

const getIsFiltersSame = (presetFilters, tableFilters) => {
	if (presetFilters.length === tableFilters.length) {
		if (presetFilters.length === 0) {
			return true
		}

		let isFiltersTheSame = true
		presetFilters.forEach((presetFilter) => {
			const foundedFilter = tableFilters.find(
				(tableFilter) => tableFilter.id === presetFilter.id
			)

			if (
				!foundedFilter ||
				!getIsArraySame(presetFilter.value, foundedFilter.value)
			) {
				isFiltersTheSame = false
			}
		})

		return isFiltersTheSame
	}

	return false
}

const getHiddenColumns = (visibility) =>
	Object.keys(visibility)
		.filter((key) => !visibility[key])
		.sort()

const getIsVisibilitySame = (presetVisibility, tableVisibility) => {
	const hiddenPresetColumns = getHiddenColumns(presetVisibility)
	const hiddenTableColumns = getHiddenColumns(tableVisibility)

	return getIsArraySame(hiddenPresetColumns, hiddenTableColumns)
}

export const getIsPresetStateSame = <TData extends TableData = TableData>(
	table: TableInstance<TData>,
	tableState: PresetState,
	presetState: PresetState = EMPTY_STATE
) => {
	const {
		columnOrder: presetColumnOrder,
		grouping: presetGrouping,
		sorting: presetSorting,
		columnFilters: presetColumnFilters,
		columnVisibility: presetColumnVisibility,
	} = presetState

	const {
		columnOrder: tableColumnOrder,
		grouping: tableGrouping,
		sorting: tableSorting,
		columnFilters: tableColumnFilters,
		columnVisibility: tableColumnVisibility,
	} = tableState

	const isOrderTheSame = getIsArraySame(
		getValidColumnOrder(table.options, presetColumnOrder),
		getValidColumnOrder(table.options, tableColumnOrder)
	)
	// grouping is working not properly, because after ungroup -> group by,
	// new column("mrt-row-expand") is pushed to the beggining of the columnOrder array
	const isGroupingTheSame = getIsArraySame(
		presetGrouping ?? [],
		tableGrouping ?? []
	)
	const isSortingTheSame = getIsSortingSame(
		presetSorting ?? [],
		tableSorting ?? []
	)
	const isFiltersTheSame = getIsFiltersSame(
		presetColumnFilters ?? [],
		tableColumnFilters ?? []
	)
	const isVisibilityTheSame = getIsVisibilitySame(
		presetColumnVisibility ?? {},
		tableColumnVisibility ?? {}
	)

	return (
		isOrderTheSame &&
		isGroupingTheSame &&
		isSortingTheSame &&
		isFiltersTheSame &&
		isVisibilityTheSame
	)
}

export const isPresetStateEmpty = (presetState: PresetState) => {
	// check if state in preset has no order, grouping, sorting, filters and visibility
	return (
		!presetState.columnOrder &&
		!presetState.grouping &&
		!presetState.sorting &&
		!presetState.columnFilters &&
		!presetState.columnVisibility
	)
}
