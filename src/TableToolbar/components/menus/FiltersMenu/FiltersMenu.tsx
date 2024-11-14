import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
	ButtonBordered,
	ListTitle,
	SidebarPropsWithOnCloseEnd,
	SidebarSearchComponent,
	SidebarWithMuiProps,
	Table_Column,
	TableData,
	TableInstance,
} from '../../../../'
import { getColumnId } from '../../../../column.utils'
import { createComponentWithMuiProps } from '../../../../utils/createComponentWithMuiProps'
import { getOrderedColumns } from '../../../../utils/getOrderedColumns'
import { getSuggestedColumns } from '../../../../utils/getSuggestedColumns'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { getValueOrFunctionHandler } from '../../../../utils/getValueOrFunctionHandler'
import { mergeMuiProps } from '../../../../utils/mergeMuiProps'
import { sortByStringArray } from '../../../../utils/sortByStringArray'
import { splitArrayItems } from '../../../../utils/splitArrayItems'

import { ColumnFilterField } from './ColumnFilterField'
import { FiltersMenuListItem } from './FiltersMenuListItem'
import { FilterWrapper } from './FilterWrapper'

export interface FiltersMenuProps<TData = TableData> {
	open: boolean
	onClose: () => void
	table: TableInstance<TData>
	sidebarProps?: SidebarPropsWithOnCloseEnd
}

export const FiltersMenu = ({
	open,
	onClose,
	table,
	sidebarProps,
}: FiltersMenuProps) => {
	const {
		getAllLeafColumns,
		getState,
		resetColumnFilters,
		options: {
			localization,
			innerTable,
			suggestedColumns,
			organizeFilteringMenu,
		},
	} = table

	const [searchValue, setSearchValue] = useState<string>('')
	const [newColumnFilter, setNewColumnFilter] = useState<Table_Column | null>(
		null
	)
	const { columnFilters } = getState() // this updates memo below
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

	const { filteredColumns, unfilteredColumns, areSuggestedShown } =
		useMemo(() => {
			const allColumns = getOrderedColumns(
				getAllLeafColumns(),
				(cols) => cols.filter((col) => col.getCanFilter()),
				organizeFilteringMenu
			)

			const [filteredColumns, unfilteredColumns] = splitArrayItems(
				allColumns,
				(col) => myFiltersIds.includes(getColumnId(col))
			)

			let result: Table_Column[]
			let areSuggestedShown = false

			if (searchValue)
				result = unfilteredColumns.filter(({ columnDef: { header } }) =>
					header.toLowerCase().includes(searchValue.toLowerCase())
				)
			else
				[result, areSuggestedShown] = getSuggestedColumns(
					unfilteredColumns,
					suggestedColumns?.filtering
				)

			return {
				filteredColumns: sortByStringArray(
					filteredColumns,
					myFiltersIds,
					getColumnId
				),
				unfilteredColumns: result,
				areSuggestedShown,
			}
		}, [
			getAllLeafColumns,
			organizeFilteringMenu,
			myFiltersIds,
			suggestedColumns?.filtering,
			searchValue,
		])

	const changeFilter = useCallback((column, value) => {
		column.setFilterValue(value)
	}, [])

	const handleRemoveAllFilter = useCallback(() => {
		setNewColumnFilter(null)
		setSearchActive(true)
		resetColumnFilters()
		setMyFiltersIds([])
	}, [resetColumnFilters])

	const handleRemoveFilter = useCallback((column: Table_Column) => {
		setNewColumnFilter(null)
		column.setFilterValue(undefined)
		setMyFiltersIds((ids) => ids.filter((id) => id !== column.id))
	}, [])

	const handleAddFilter = useCallback((column: Table_Column) => {
		setSearchValue('')
		setSearchActive(false)
		setNewColumnFilter(column)
	}, [])

	const onCloseEnd = sidebarProps?.onCloseEnd
	const handleCloseClick = useCallback(() => {
		onClose?.()
		onCloseEnd?.()
	}, [onClose, onCloseEnd])

	return (
		<SidebarWithMuiProps
			table={table as TableInstance}
			open={open}
			onClose={handleCloseClick}
			withHeader
			headerTitle={localization.showFiltering}
			innerTableSidebar={innerTable}
			{...sidebarProps}
			PaperProps={mergeMuiProps(
				{
					sx: { minWidth: 660 },
				},
				getTestAttributes(table.options.e2eLabels, 'sidebarFilters'),
				sidebarProps?.PaperProps
			)}
		>
			{!isSearchActive && filteredColumns.length > 0 ? (
				<>
					{filteredColumns.map((column, index) => (
						<FilterWrapper
							key={getColumnId(column)}
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
								{...getTestAttributes(
									table.options.e2eLabels,
									'sidebarFiltersAddFilter'
								)}
							>
								{localization.addFilter} +
							</ButtonBordered>
							<ButtonBordered
								onClick={() => handleRemoveAllFilter()}
								{...getTestAttributes(
									table.options.e2eLabels,
									'sidebarFiltersRemoveAll'
								)}
							>
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
					{unfilteredColumns.length > 0 ? (
						unfilteredColumns.map((column) => (
							<FiltersMenuListItem
								key={column.id}
								column={column}
								onAddFilter={handleAddFilter}
							/>
						))
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							{localization.noOptions}
						</Typography>
					)}
				</>
			)}
		</SidebarWithMuiProps>
	)
}

export const FiltersMenuWithMuiProps = createComponentWithMuiProps(
	FiltersMenu,
	({ table }) =>
		getValueOrFunctionHandler(table.options.muiFiltersMenuProps)({
			table,
		})
)
