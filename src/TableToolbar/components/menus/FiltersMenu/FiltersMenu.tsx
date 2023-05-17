import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
import { Typography } from '@mui/material'

import type { Table_Column, TableInstance } from '../../../../index'
import { Table_DisplayColumnIdsArray } from '../../../../column.utils'
import { SidebarHeaderComponent } from '../components/SidebarHeader'
import { SidebarSearchComponent } from '../components/SidebarSearch'

import { FiltersMenuListItem } from './FiltersMenuListItem'
import { FiltersMenuAppliedFilter } from './FiltersMenuAppliedFilter'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	setAnchorEl: (anchorEl: HTMLElement | null) => void
	table: TableInstance<TData>
}

export type FilterType<TData extends Record<string, any> = {}> = {
	value: any[]
	id: string
	column: Table_Column<TData>
}

export const FiltersMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const {
		getAllColumns,
		getState,
		resetColumnFilters,
		options: { localization },
	} = table
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const [isFilterAddition, setIsFilterAddition] = useState<boolean | null>(true)
	const [appliedFilters, setAppliedFilters] = useState<FilterType<TData>[]>([])

	const allColumns = useMemo(() => {
		const columns = getAllColumns()

		return columns.filter(
			(column) => !Table_DisplayColumnIdsArray.includes(column.id)
		)
	}, [getAllColumns])

	const getActiveFiltersData = useCallback(() => {
		const filters = getState().columnFilters

		return filters.map((filter) => ({
			...filter,
			column: allColumns.find(({ id }) => id === filter.id),
		}))
	}, [allColumns, getState])

	useEffect(() => {
		const activeFilters = getActiveFiltersData()

		if (activeFilters.length) {
			setIsFilterAddition(false)
		}
		setAppliedFilters(activeFilters as FilterType<TData>[])
	}, [getActiveFiltersData])

	const handleCloseCLick = () => setAnchorEl(null)

	const handleOnSearchChange = (value: string) => {
		if (value) {
			setIsSearchActive(true)
		} else {
			setIsSearchActive(false)
		}
		setSearchList(
			value.length
				? allColumns.filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}

	const handleSetColumnFilter = (column) => {
		const lastFilter = {
			id: column.id,
			value: [],
			column,
		}
		setAppliedFilters([...appliedFilters, lastFilter])
		setIsFilterAddition(false)
		column.setFilterValue()
	}

	const changeFilter = (filter, value) => {
		const updatedAppliedFilters = appliedFilters.map((el) => {
			if (el.id === filter.id) {
				return {
					...el,
					value,
				}
			}

			return el
		})

		setAppliedFilters(updatedAppliedFilters)
		filter.column.setFilterValue(value)
	}

	const handleRemoveAllFilter = () => {
		setIsFilterAddition(true)
		setAppliedFilters([])
		resetColumnFilters()
	}

	const handleRemoveFilter = (filter) => {
		setAppliedFilters(
			appliedFilters.filter((applied) => applied.id !== filter.id)
		)
		filter.column.setFilterValue()

		if (appliedFilters.length === 1) {
			setIsFilterAddition(true)
		}
	}

	const renderListItems = (list) => {
		return (
			<>
				{list
					.filter((column) =>
						appliedFilters.every((filter) => filter.id !== column.id)
					)
					.map((column, index) => (
						<FiltersMenuListItem
							allColumns={allColumns}
							column={column}
							table={table}
							key={`${index}-${column.id}`}
							onAddFilter={handleSetColumnFilter}
						/>
					))}
			</>
		)
	}

	const renderMenuList = () => {
		if (isSearchActive) {
			if (searchList.length) {
				return renderListItems(searchList)
			}

			return (
				<Typography
					sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
				>
					No options
				</Typography>
			)
		}

		return renderListItems(allColumns)
	}

	return (
		<Drawer
			anchor="right"
			open={!!anchorEl}
			onClose={handleCloseCLick}
			transitionDuration={400}
		>
			<Box sx={{ minWidth: 660 }}>
				<SidebarHeaderComponent title="Filters" onClick={handleCloseCLick} />

				{!isFilterAddition && appliedFilters.length ? (
					<>
						{appliedFilters
							.filter((el) => el)
							.map((filter, index) => (
								<FiltersMenuAppliedFilter
									firstInList={index === 0}
									table={table}
									filter={filter}
									changeFilter={changeFilter}
									removeFilter={handleRemoveFilter}
									key={`${index}-${index}`}
								/>
							))}
						<Box
							sx={{
								alignItems: 'center',
								justifyContent: 'space-between',
								my: 0,
								mx: '12px',
								// px: '12px',
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
								<Button
									variant="outlined"
									onClick={() => setIsFilterAddition(true)}
									sx={{ fontWeight: 600, fontSize: '14px' }}
								>
									{localization.addFilter} +
								</Button>
								<Button
									onClick={() => handleRemoveAllFilter()}
									sx={{ fontWeight: 600, fontSize: '14px' }}
								>
									{localization.removeAll}
								</Button>
							</Box>
						</Box>
					</>
				) : null}

				{isFilterAddition ? (
					<>
						<SidebarSearchComponent
							dividerProps={{ sx: { mb: '12px' } }}
							onChange={handleOnSearchChange}
						/>
						{renderMenuList()}
					</>
				) : null}
			</Box>
		</Drawer>
	)
}
