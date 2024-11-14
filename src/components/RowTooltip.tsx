import { PropsWithChildren, ReactElement, useMemo } from 'react'

import type { Table_Row, TableData, TableInstance } from '..'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'

import { Tooltip } from './Tooltip'

export type RowTooltipProps<TData = TableData> = PropsWithChildren<{
	row: Table_Row<TData>
	table: TableInstance<TData>
}>

export const RowTooltip = ({ row, table, children }: RowTooltipProps) => {
	const {
		options: { rowTooltipProps, CustomRowTooltip },
	} = table

	const tooltipProps = useMemo(
		() => getValueOrFunctionHandler(rowTooltipProps)({ row, table }),
		[table, row, rowTooltipProps]
	)

	if (CustomRowTooltip) {
		return (
			<CustomRowTooltip row={row} table={table}>
				{children}
			</CustomRowTooltip>
		)
	}

	if (rowTooltipProps && tooltipProps) {
		return <Tooltip {...tooltipProps}>{children as ReactElement}</Tooltip>
	}

	return <>{children}</>
}
