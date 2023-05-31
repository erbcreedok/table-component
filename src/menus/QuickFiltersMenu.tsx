import React, { ComponentProps, FC, useEffect, useState } from 'react'

import { Menu } from '../components/Menu'
import { Table_Column, TableInstance } from '../TableComponent'
import { useFilterControls } from '../TableStatusBar/filter-bar-hooks/useFilterControls'

type Props = ComponentProps<typeof Menu> & {
	table: TableInstance
	column: Table_Column
	toggleSubMenu: () => void
}
export const QuickFiltersMenu: FC<Props> = ({
	table,
	column,
	toggleSubMenu,
	...rest
}) => {
	const {
		options: { ColumnActionsFiltersMenu },
	} = table
	const { columnFilters, currentFilterColumn } = useFilterControls(
		table,
		column.id
	)

	const [selectedFilters, setSelectedFilters] = useState<unknown[]>([])
	const [filterValues, setFilterValues] = useState<string[]>([])

	// TODO: fix .length issue in getFacetedUniqueValues
	useEffect(() => {
		const { value: appliedValues } =
			columnFilters.find(({ id }) => id === column.id) || {}

		try {
			setFilterValues(
				Array.from(table.getColumn(column.id).getFacetedUniqueValues().keys())
			)
		} catch (error) {
			//
		}

		if (Array.isArray(appliedValues)) {
			setSelectedFilters(appliedValues)
		}
	}, [columnFilters])

	const handleApplyFilters = () => {
		currentFilterColumn.setFilterValue([...selectedFilters])

		toggleSubMenu()
	}

	const handleCheckFilter = (value: string) => {
		if (selectedFilters.includes(value)) {
			const updatedFilters = selectedFilters.filter(
				(filter) => filter !== value
			)

			setSelectedFilters(updatedFilters)

			return
		}

		setSelectedFilters([...selectedFilters, value])
	}

	const handleCheckAllFilters = () => {
		if (selectedFilters.length === filterValues.length) {
			setSelectedFilters([])

			return
		}

		setSelectedFilters([...filterValues])
	}

	if (!ColumnActionsFiltersMenu) {
		return null
	}

	return (
		<Menu {...rest}>
			<ColumnActionsFiltersMenu
				table={table}
				column={column}
				selectedFilters={selectedFilters}
				filterValues={filterValues}
				onCheckFilter={handleCheckFilter}
				onCheckAllFilters={handleCheckAllFilters}
				onApplyFilters={handleApplyFilters}
			/>
		</Menu>
	)
}
