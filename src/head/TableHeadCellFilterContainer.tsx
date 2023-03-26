import React, { FC } from 'react'
import Collapse from '@mui/material/Collapse'

import { FilterRangeFields } from '../inputs/FilterRangeFields'
import { FilterTextField } from '../inputs/FilterTextField'
import { Table_Header, TableInstance } from '..'
import { FilterCheckbox } from '../inputs/FilterCheckbox'

interface Props {
	header: Table_Header
	table: TableInstance
}

export const TableHeadCellFilterContainer: FC<Props> = ({ header, table }) => {
	const { getState } = table
	const { showColumnFilters } = getState()
	const { column } = header
	const { columnDef } = column

	return (
		<Collapse in={showColumnFilters} mountOnEnter unmountOnExit>
			{columnDef.filterVariant === 'checkbox' ? (
				<FilterCheckbox column={column} table={table} />
			) : columnDef.filterVariant === 'range' ||
			  ['between', 'betweenInclusive', 'inNumberRange'].includes(
					columnDef._filterFn
			  ) ? (
				<FilterRangeFields header={header} table={table} />
			) : (
				<FilterTextField header={header} table={table} />
			)}
		</Collapse>
	)
}
