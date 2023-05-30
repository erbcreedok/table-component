import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import React from 'react'

import { Text } from '../components/styles'
import { TooltipOverflow } from '../components/TooltipOverflow'
import { Table_Column } from '../TableComponent'

type Props<TData extends Record<string, any>> = {
	column: Table_Column<TData>
}

const Subtitle = styled(Box)`
	font-size: 12px;
	line-height: 12px;
	color: ${Text.Primary};
	text-transform: none;
	font-weight: normal;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`
export const HeaderBase = <T extends Record<string, any>>({
	column,
}: Props<T>) => {
	return (
		<>
			<TooltipOverflow
				text={column.columnDef.header}
				spacing={5}
				placement="top"
				arrow
			/>
			<Subtitle title={column.columnDef.subtitle}>
				{column.columnDef.subtitle}
			</Subtitle>
		</>
	)
}
