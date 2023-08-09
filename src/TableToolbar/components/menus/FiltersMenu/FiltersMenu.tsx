import React, { useState, useMemo, useCallback } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { Typography } from '@mui/material'

import { ButtonBordered } from '../../../../components/ButtonBordered'
import { TableData } from '../../../../index'
import type { Table_Column, TableInstance } from '../../../../index'
import { getColumnId } from '../../../../column.utils'
import { SidebarSearchComponent } from '../../../../components/SidebarSearch'
import { Sidebar } from '../../../../components/Sidebar'
import { splitFilterColumns } from '../../../../utils/splitFilterColumns'

import { FiltersMenuListItem } from './FiltersMenuListItem'
import { ColumnFilterField } from './ColumnFilterField'
import { FilterWrapper } from './FilterWrapper'

interface Props<TData extends TableData> {
	open: boolean
	onClose: () => void
	table: TableInstance<TData>
}

export const FiltersMenu = <TData extends TableData>({
	open,
	onClose,
	table,
}: Props<TData>) => {
	const {
		getAllColumns,
		getState,
		resetColumnFilters,
		options: { localization, innerTable },
	} = table
	const [searchValue, setSearchValue] = useState<string>('')
	const [newColumnFilter, setNewColumnFilter] =
		useState<Table_Column<TData> | null>(null)
	const { columnFilters } = getState()
	const [isSearchActive, setSearchActive] = useState<boolean>(
		!columnFilters || !columnFilters.length
	)

	// all columns that can be filtered
	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		return columns.filter((column) => column.getCanFilter())
	}, [getAllColumns])

	// all columns that can be filtered, but not already filtered
	const { filterAppliedColumns, filterNonAppliedColumns } = useMemo(
		() => splitFilterColumns(allColumns, columnFilters, newColumnFilter),
		[allColumns, columnFilters, newColumnFilter]
	)

	const handleSetColumnFilter = useCallback((column: Table_Column<TData>) => {
		setSearchActive(false)
		setNewColumnFilter(column)
	}, [])

	const changeFilter = useCallback((column, value) => {
		column.setFilterValue(value)
	}, [])

	const handleRemoveAllFilter = useCallback(() => {
		setSearchActive(true)
		resetColumnFilters()
	}, [resetColumnFilters])

	const handleRemoveFilter = useCallback((column: Table_Column<TData>) => {
		column.setFilterValue(undefined)
	}, [])

	// Columns that are non-filtered, and match the search value
	const menuItems = useMemo(() => {
		return filterNonAppliedColumns
			.filter((col) =>
				col.columnDef.header.toLowerCase().includes(searchValue.toLowerCase())
			)
			.map((column) => (
				<FiltersMenuListItem
					key={column.id}
					column={column}
					onAddFilter={handleSetColumnFilter}
				/>
			))
	}, [filterNonAppliedColumns, handleSetColumnFilter, searchValue])

	return (
		<Sidebar
			open={open}
			onClose={onClose}
			styles={{ minWidth: 660 }}
			withHeader
			headerTitle="Filters"
			innerTableSidebar={innerTable}
		>
			{!isSearchActive && !!filterAppliedColumns.length ? (
				<>
					{filterAppliedColumns.map((column, index) => (
						<FilterWrapper
							key={getColumnId(column.columnDef)}
							onDelete={() => handleRemoveFilter(column)}
							table={table}
							column={column}
							isFirst={index === 0}
						>
							<ColumnFilterField
								autoFocus={newColumnFilter === column}
								changeFilter={changeFilter}
								column={column}
								table={table}
							/>
						</FilterWrapper>
					))}
					<Box
						sx={{
							alignItems: 'center',
							justifyContent: 'space-between',
							my: 0,
							mx: '12px',
							py: '6px',
						}}
					>
						<Divider sx={{ my: '15px' }} />
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
							}}
						>
							<ButtonBordered
								variant="outlined"
								onClick={() => setSearchActive(true)}
							>
								{localization.addFilter} +
							</ButtonBordered>
							<ButtonBordered onClick={() => handleRemoveAllFilter()}>
								{localization.removeAll}
							</ButtonBordered>
						</Box>
					</Box>
				</>
			) : (
				<>
					<SidebarSearchComponent
						dividerProps={{ sx: { mb: '12px' } }}
						onChange={setSearchValue}
					/>
					{menuItems.length ? (
						menuItems
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							{localization.noOptions}
						</Typography>
					)}
				</>
			)}
		</Sidebar>
	)
}
