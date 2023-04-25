import styled from '@emotion/styled'
import React from 'react'

import { Table_Column, Table_Header, TableInstance } from '../TableComponent'

const Box = styled('div')`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: inherit;
`
type Props<TData extends Record<string, any>> = {
	column: Table_Column<TData>
	header: Table_Header<TData>
	table: TableInstance<TData>
}
export const HeaderBase = <T extends Record<string, any>>({
	column,
}: Props<T>) => {
	return <Box title={column.columnDef.header}>{column.columnDef.header}</Box>
}
