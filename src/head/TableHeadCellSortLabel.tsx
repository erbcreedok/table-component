import React, { FC, useCallback } from 'react'
import TableSortLabel from '@mui/material/TableSortLabel'
import type { TableCellProps } from '@mui/material/TableCell'

import { Table_Header, TableInstance } from '..'
import { Tooltip } from '../components'
import { getSortingIconConstructor } from '../utils/getSortingInfo'

interface Props {
	header: Table_Header
	table: TableInstance
	tableCellProps?: TableCellProps
}

export const TableHeadCellSortLabel: FC<Props> = ({ header, table }) => {
	const {
		options: { localization, enableMultiSort },
	} = table
	const { column } = header
	const { columnDef } = column

	const isSorted = column.getIsSorted()

	const sortTooltip = isSorted
		? isSorted === 'desc'
			? localization.sortedByColumnDesc.replace('{column}', columnDef.header)
			: localization.sortedByColumnAsc.replace('{column}', columnDef.header)
		: localization.unsorted

	const toggleSorting = useCallback(
		(e) => {
			e.stopPropagation()
			column.toggleSorting(isSorted === 'asc', enableMultiSort)
		},
		[column, enableMultiSort, isSorted]
	)

	return (
		<Tooltip arrow placement="top" title={sortTooltip}>
			<TableSortLabel
				aria-label={sortTooltip}
				active={!!isSorted}
				disabled={table.constants.disableActionButtons}
				onClick={toggleSorting}
				direction="desc"
				sx={{
					flex: '0 0',
					'& svg': {
						margin: 0,
						width: '18px',
						height: '18px',
					},
				}}
				IconComponent={getSortingIconConstructor({
					column,
					isAsc: isSorted === 'asc',
					table,
				})}
			/>
		</Tooltip>
	)
}
