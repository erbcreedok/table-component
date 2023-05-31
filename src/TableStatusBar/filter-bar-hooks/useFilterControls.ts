import { useMemo } from 'react'

import { Table_Column, TableInstance } from 'src'

export const useFilterControls = <TData extends Record<string, any>>(
	table: TableInstance<TData>,
	filterId?: string
) => {
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

	const filteredList = useMemo(
		() => columns.filter((col) => col.getIsFiltered()),
		[columns, columnFilters]
	)

	const getColumnFilterOptions: (
		column: Table_Column
	) => { label: string; value: string }[] = (column) => {
		try {
			return Array.from(column.getFacetedUniqueValues().keys())
				.sort()
				.filter((el) => el)
				.map((el) => ({
					label: el,
					value: el,
				}))
		} catch {
			return []
		}
	}

	const getCurrentFilterValues = (filterId?: string) => {
		if (!filterId) {
			return []
		}

		const filter = columnFilters.find((filter) => filter.id === filterId)

		return (filter?.value as unknown[]) || []
	}

	const getCurrentFilterHeader = (filterId?: string) => {
		if (!filterId) {
			return []
		}

		const column = columns.find((column) => column.id === filterId)

		return column?.columnDef.header || ''
	}

	return {
		columns,
		columnFilters,
		columnsIdToHeaderMap,
		filteredList,
		nonFilteringList,

		currentFilterValues: getCurrentFilterValues(filterId),
		currentFilterHeader: getCurrentFilterHeader(filterId),
		currentFilterColumn: columnsIdToHeaderMap?.[filterId || '']?.column || {},
		filterOptions:
			filterId &&
			columnsIdToHeaderMap[filterId] &&
			getColumnFilterOptions(columnsIdToHeaderMap[filterId].column),

		getColumnFilterOptions,
	}
}
