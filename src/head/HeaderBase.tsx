import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import React, { ComponentProps } from 'react'

import { TextColor } from '../components/styles'
import { TooltipOverflow } from '../components/TooltipOverflow'
import { Table_Column } from '../TableComponent'

type Props<TData extends Record<string, any>> = {
	column: Table_Column<TData>
	tooltipDisabled?: boolean
	boxProps?: ComponentProps<typeof TooltipOverflow>['boxProps']
}

const Subtitle = styled(Box)`
	font-size: 12px;
	line-height: 12px;
	color: ${TextColor.Primary};
	text-transform: none;
	font-weight: normal;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`
export const HeaderBase = <TData extends Record<string, any>>({
	column,
	tooltipDisabled,
	boxProps,
}: Props<TData>) => {
	return (
		<>
			<TooltipOverflow
				disabled={tooltipDisabled}
				text={column.columnDef.shortHeader ?? column.columnDef.header}
				spacing={5}
				placement="top"
				arrow
				boxProps={boxProps}
			/>
			<Subtitle title={column.columnDef.subtitle}>
				{column.columnDef.subtitle}
			</Subtitle>
		</>
	)
}
