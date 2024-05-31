import { BoxProps, GrowProps, TooltipProps } from '@mui/material'
import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import React from 'react'

import { Table_Header, TableData, TableInstance } from '..'
import { Tooltip } from '../components/Tooltip'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { mergeSx } from '../utils/mergeSx'
import { getFilterValueText } from '../utils/getFilterValueText'

export type TableHeadCellFilterLabelProps<TData extends TableData = {}> = {
	header: Table_Header<TData>
	table: TableInstance<TData>
	buttonProps?: IconButtonProps
	tooltipProps?: TooltipProps
	growProps?: GrowProps
	boxProps?: BoxProps
}

export const TableHeadCellFilterLabel = ({
	header,
	table,
	tooltipProps,
	buttonProps,
	growProps,
	boxProps,
}: TableHeadCellFilterLabelProps) => {
	const {
		options: {
			icons: { FiltersIcon },
			localization,
		},
	} = table
	const { column } = header
	const { columnDef } = column

	const isRangeFilter =
		columnDef.filterVariant === 'range' ||
		['between', 'betweenInclusive', 'inNumberRange'].includes(
			columnDef._filterFn
		)
	const currentFilterOption = columnDef._filterFn

	const filterFilterValueText = getFilterValueText(
		column.getFilterValue(),
		columnDef.filterSelectOptions
	)

	const filterTooltip =
		tooltipProps?.title ??
		localization.filteringByColumn
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
					Array.isArray(filterFilterValueText)
						? (filterFilterValueText as [string, string]).join(
								`" ${isRangeFilter ? localization.and : localization.or} "`
						  )
						: filterFilterValueText
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
			{...growProps}
		>
			<Box
				component="span"
				{...boxProps}
				sx={mergeSx({ flex: '0 0' }, boxProps?.sx)}
			>
				<Tooltip arrow placement="top" title={filterTooltip} {...tooltipProps}>
					<IconButton
						disableRipple
						size="small"
						{...buttonProps}
						sx={mergeSx(
							{
								height: '12px',
								m: 0,
								opacity: 0.8,
								p: '2px',
								transform: 'scale(0.66)',
								width: '12px',
							},
							buttonProps?.sx
						)}
					>
						<FiltersIcon />
					</IconButton>
				</Tooltip>
			</Box>
		</Grow>
	)
}

export const TableHeadCellFilterLabelWithMuiProps = (
	_props: TableHeadCellFilterLabelProps
) => {
	const { table, header } = _props
	const {
		options: { muiTableHeadCellFilterLabelProps },
	} = table
	const props = getValueOrFunctionHandler(muiTableHeadCellFilterLabelProps)({
		table,
		column: header.column,
	})

	return <TableHeadCellFilterLabel {...props} header={header} table={table} />
}
