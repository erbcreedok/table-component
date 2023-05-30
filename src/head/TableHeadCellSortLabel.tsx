import React, { FC, useCallback, useMemo } from 'react'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import type { TableCellProps } from '@mui/material/TableCell'

import { Table_Header, TableInstance } from '..'

interface Props {
	header: Table_Header
	table: TableInstance
	tableCellProps?: TableCellProps
}

export const TableHeadCellSortLabel: FC<Props> = ({
	header,
	table,
	tableCellProps,
}) => {
	const {
		options: {
			icons: { SortDescIcon },
			localization,
			enableMultiSort,
		},
	} = table
	const { column } = header
	const { columnDef } = column

	const isSorted = column.getIsSorted()

	const sortTooltip = isSorted
		? isSorted === 'desc'
			? localization.sortedByColumnDesc.replace('{column}', columnDef.header)
			: localization.sortedByColumnAsc.replace('{column}', columnDef.header)
		: localization.unsorted

	const transform = useMemo(() => {
		let translateX = ''
		if (tableCellProps?.align !== 'right') {
			translateX = `translateX(-0.5ch)`
			if (isSorted === 'asc') {
				translateX = `translateX(0.5ch)`
			}
		}
		const rotateY = isSorted === 'asc' ? 'rotateY(180deg)' : undefined

		return [translateX, rotateY].filter(Boolean).join(' ')
	}, [isSorted, tableCellProps?.align])

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
				onClick={toggleSorting}
				direction={isSorted ? (isSorted as 'asc' | 'desc') : undefined}
				sx={{
					flex: '0 0',
					width: '18px',
					transform,
				}}
				IconComponent={SortDescIcon}
			/>
		</Tooltip>
	)
}
