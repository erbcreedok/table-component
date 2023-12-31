import React, { FC, MouseEvent } from 'react'
import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'
import IconButton from '@mui/material/IconButton'

import { Table_Header, TableInstance } from '..'
import { Tooltip } from '../components/Tooltip'

interface Props {
	header: Table_Header
	table: TableInstance
}

export const TableHeadCellFilterLabel: FC<Props> = ({ header, table }) => {
	const {
		options: {
			icons: { FiltersIcon },
			localization,
		},
		refs: { filterInputRefs },
		setShowFilters,
	} = table
	const { column } = header
	const { columnDef } = column

	const isRangeFilter =
		columnDef.filterVariant === 'range' ||
		['between', 'betweenInclusive', 'inNumberRange'].includes(
			columnDef._filterFn
		)
	const currentFilterOption = columnDef._filterFn
	const filterTooltip = localization.filteringByColumn
		.replace('{column}', String(columnDef.header))
		.replace(
			'{filterType}',
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			localization[
				`filter${
					currentFilterOption?.charAt(0)?.toUpperCase() +
					currentFilterOption?.slice(1)
				}`
			]
		)
		.replace(
			'{filterValue}',
			`"${
				Array.isArray(column.getFilterValue())
					? (column.getFilterValue() as [string, string]).join(
							`" ${isRangeFilter ? localization.and : localization.or} "`
					  )
					: (column.getFilterValue() as string)
			}"`
		)
		.replace('" "', '')

	return (
		<Grow
			unmountOnExit
			in={
				(!!column.getFilterValue() && !isRangeFilter) ||
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				(isRangeFilter && // @ts-ignore
					(!!column.getFilterValue()?.[0] || !!column.getFilterValue()?.[1]))
			}
		>
			<Box component="span" sx={{ flex: '0 0' }}>
				<Tooltip arrow placement="top" title={filterTooltip}>
					<IconButton
						disableRipple
						onClick={(event: MouseEvent<HTMLButtonElement>) => {
							setShowFilters(true)
							queueMicrotask(() => {
								filterInputRefs.current[`${column.id}-0`]?.focus()
								filterInputRefs.current[`${column.id}-0`]?.select()
							})
							event.stopPropagation()
						}}
						size="small"
						sx={{
							height: '12px',
							m: 0,
							opacity: 0.8,
							p: '2px',
							transform: 'scale(0.66)',
							width: '12px',
						}}
					>
						<FiltersIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</Grow>
	)
}
