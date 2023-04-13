import React, { useState, useRef } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

import type { Table_Column, TableInstance } from '../../../../index'
import type { FilterType } from '../FiltersMenu'
import { ToolbarMultiselect } from '../../../../components/ToolbarMultiselect'

interface Props<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
	filter: FilterType<TData>
	firstInList: boolean
	changeFilter(filter: FilterType<TData>, value: string[] | number[]): void
}

export const FiltersMenuAppliedFilter = <
	TData extends Record<string, any> = {}
>({
	firstInList,
	table,
	filter,
	changeFilter,
}: Props<TData>) => {
	const {
		options: { localization },
	} = table
	const getColumnFilterOptions: (
		column: Table_Column<TData>
	) => { label: string; value: string }[] = (column) => {
		return Array.from(column.getFacetedUniqueValues().keys())
			.sort()
			.filter((el) => el)
			.map((el) => ({
				label: el,
				value: el,
			}))
	}

	const getFilterAppliedValues = () => {
		const column = filter.column

		return getColumnFilterOptions(column).filter((filterOption) => {
			const value = filter.value

			return value.includes(filterOption.value)
		})
	}

	const handleChangeFilter = (filterValue) => {
		const values = filterValue.map(({ value }) => value)
		changeFilter(filter, values)
	}

	return (
		<>
			{filter ? (
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						flexWrap: 'nowrap',
						paddingLeft: '4px',
						alignItems: 'center',
						width: '100%',
						minWidth: 300,
						boxSizing: 'border-box',
					}}
				>
					<Divider
						sx={{
							display: firstInList ? 'none' : 'flex',
							width: '100%',
							boxSizing: 'border-box',
							px: '24px',
							color: '#6C6F80',
							fontSize: '14px',
							fontWeight: 600,
						}}
					>
						{localization.and}
					</Divider>
					<Box
						sx={{
							display: 'flex',
							width: '100%',
							boxSizing: 'border-box',
							px: '24px',
							mt: firstInList ? '18px' : '24px',
						}}
					>
						<Typography
							sx={{
								color: '#303240',
								fontWeight: 600,
								fontSize: '14px',
							}}
						>
							{filter.column.columnDef.header}
						</Typography>
						<Typography
							sx={{
								color: '#6C6F80',
								fontWeight: 600,
								fontSize: '14px',
								ml: '9px',
							}}
						>
							{localization.isAnyOf}
						</Typography>
					</Box>
					<ToolbarMultiselect
						table={table}
						appliedValues={getFilterAppliedValues()}
						options={getColumnFilterOptions(filter.column)}
						onChangeFilter={handleChangeFilter}
					/>
				</Box>
			) : null}
		</>
	)
}
