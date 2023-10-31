import { useState, useMemo, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { Typography } from '@mui/material'

import { ListTitle } from '../../../../components/ListTitle'
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
		getAllLeafColumns,
		getState,
		resetColumnFilters,
		options: { localization, innerTable, suggestedColumns },
	} = table
	const [searchValue, setSearchValue] = useState<string>('')
	const [newColumnFilter, setNewColumnFilter] =
		useState<Table_Column<TData> | null>(null)
	const { columnFilters } = getState()
	const [isSearchActive, setSearchActive] = useState<boolean>(
		!columnFilters || !columnFilters.length
	)

	// these for not removing empty [] filters except when pressed main delete
	const [myFiltersIds, setMyFiltersIds] = useState(
		columnFilters.map((col) => col.id)
	)
	useEffect(() => {
		if (newColumnFilter)
			setMyFiltersIds((myFilters) => [...myFilters, newColumnFilter.id])
	}, [newColumnFilter])

	// all columns that can be filtered
	const allColumns = useMemo(() => {
		const columns = getAllLeafColumns()

		return columns.filter((column) => column.getCanFilter())
	}, [getAllLeafColumns])

	// all columns that can be filtered, but not already filtered
	const { filterAppliedColumns, filterNonAppliedColumns } = useMemo(
		() => splitFilterColumns(allColumns, myFiltersIds),
		[allColumns, myFiltersIds]
	)

	const changeFilter = useCallback((column, value) => {
		column.setFilterValue(value)
	}, [])

	const handleRemoveAllFilter = useCallback(() => {
		setNewColumnFilter(null)
		setSearchActive(true)
		resetColumnFilters()
		setMyFiltersIds([])
	}, [resetColumnFilters])

	const handleRemoveFilter = useCallback((column: Table_Column<TData>) => {
		setNewColumnFilter(null)
		column.setFilterValue(undefined)
		setMyFiltersIds((ids) => ids.filter((id) => id !== column.id))
	}, [])

	// Columns that are non-filtered, and match the search value
	const [menuItems, areSuggestedShown] = useMemo(() => {
		const handleAddFilter = (column: Table_Column<TData>) => {
			setSearchValue('')
			setSearchActive(false)
			setNewColumnFilter(column)
		}

		let areSuggestedShown = false

		let columns: Table_Column<TData>[]

		if (suggestedColumns?.filtering && !searchValue) {
			columns = filterNonAppliedColumns.filter(({ id }) =>
				suggestedColumns.filtering?.includes(id)
			)
			if (columns.length === 0) columns = filterNonAppliedColumns
			else areSuggestedShown = true
		} else if (searchValue) {
			columns = filterNonAppliedColumns.filter(({ columnDef: { header } }) =>
				header.toLowerCase().includes(searchValue.toLowerCase())
			)
		} else {
			columns = filterNonAppliedColumns
		}

		return [
			columns.map((column) => (
				<FiltersMenuListItem
					key={column.id}
					column={column}
					onAddFilter={handleAddFilter}
				/>
			)),
			areSuggestedShown,
		]
	}, [filterNonAppliedColumns, searchValue, suggestedColumns])

	return (
		<Sidebar
			open={open}
			onClose={onClose}
			styles={{ minWidth: 660 }}
			withHeader
			headerTitle={localization.showFiltering}
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
					{areSuggestedShown && (
						<ListTitle sx={{ padding: '0 29px', margin: '20px 0 ' }}>
							{localization.suggested}
						</ListTitle>
					)}
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
