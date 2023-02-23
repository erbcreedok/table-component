import styled from '@emotion/styled'
import React from 'react'
import { Table_Column, Table_Header, TableInstance } from '../MaterialReactTable'

const Box = styled('div')`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: inherit;
`
type Props<TData> = {
	column: Table_Column<TData>;
	header: Table_Header<TData>;
	table: TableInstance<TData>;
}
export const HeaderBase = <T,>({ column }: Props<T>) => {
	return <Box style={{ minWidth: column.getSize() }} title={column.columnDef.header}>{column.columnDef.header}</Box>
}
