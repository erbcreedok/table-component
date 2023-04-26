import { PresetState } from '../PresetButton'

const getIsArrayTheSame = (firstState, secondState) =>
	JSON.stringify(firstState) === JSON.stringify(secondState)

const getIsSortingTheSame = (presetSorting, tableSorting) => {
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

const getIsFiltersTheSame = (presetFilters, tableFilters) => {
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
				!getIsArrayTheSame(presetFilter.value, foundedFilter.value)
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

const getIsVisibilityTheSame = (presetVisibility, tableVisibility) => {
	const hiddenPresetColumns = getHiddenColumns(presetVisibility)
	const hiddenTableColumns = getHiddenColumns(tableVisibility)

	return getIsArrayTheSame(hiddenPresetColumns, hiddenTableColumns)
}

export const getIsStateTheSame = (
	presetState: PresetState,
	tableState: PresetState
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

	const isOrderTheSame = getIsArrayTheSame(
		presetColumnOrder ?? [],
		tableColumnOrder ?? []
	)
	// grouping is working not properly, because after ungroup -> group by,
	// new column("mrt-row-expand") is pushed to the beggining of the columnOrder array
	const isGroupingTheSame = getIsArrayTheSame(
		presetGrouping ?? [],
		tableGrouping ?? []
	)
	const isSortingTheSame = getIsSortingTheSame(
		presetSorting ?? [],
		tableSorting ?? []
	)
	const isFiltersTheSame = getIsFiltersTheSame(
		presetColumnFilters ?? [],
		tableColumnFilters ?? []
	)
	const isVisibilityTheSame = getIsVisibilityTheSame(
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
