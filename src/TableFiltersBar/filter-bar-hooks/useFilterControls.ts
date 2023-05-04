import { useMemo } from 'react'

import { Table_Column } from 'src'

export const useFilterControls = (table: any, filterId?: string) => {
	const { getState, getAllColumns } = table

	const { columnFilters } = getState()

	const columns = getAllColumns()
	const columnsIdToHeaderMap = useMemo(
		() =>
			columns.reduce((acc, column) => {
				const {
					id,
					columnDef: { header },
				} = column

				return {
					...acc,
					[id]: { header, column },
				}
			}, {}),
		[columns, columnFilters]
	)

	const nonFilteringList = useMemo(
		() => columns.filter((col) => !col.getIsFiltered()),
		[columns, columnFilters]
	)

	const filtedList = useMemo(
		() => columns.filter((col) => col.getIsFiltered()),
		[columns, columnFilters]
	)

	const getColumnFilterOptions: (
		column: Table_Column<any>
	) => { label: string; value: string }[] = (column) => {
		return Array.from(column.getFacetedUniqueValues().keys())
			.sort()
			.filter((el) => el)
			.map((el) => ({
				label: el,
				value: el,
			}))
	}

	const getCurrentFilterValues = (filterId?: string) => {
		if (!filterId) {
			return []
		}

		const filter = columnFilters.find((filter) => filter.id === filterId)

		return filter?.value || []
	}

	const getCurrentFilterHeader = (filterId?: string) => {
		if (!filterId) {
			return []
		}

		const column = columns.find((column) => column.id === filterId)

		return column.columnDef.header || ''
	}

	return {
		columns,
		columnFilters,
		columnsIdToHeaderMap,
		filtedList,
		nonFilteringList,

		currentFilterValues: getCurrentFilterValues(filterId),
		currentFilterHeader: getCurrentFilterHeader(filterId),
		currentFilterColumn: columnsIdToHeaderMap?.[filterId || '']?.column || {},
		filterOptions:
			filterId &&
			columnsIdToHeaderMap[filterId] &&
			getColumnFilterOptions(columnsIdToHeaderMap[filterId].column),
	}
}
