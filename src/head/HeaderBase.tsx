import styled from '@emotion/styled'
import React from 'react'
import { MRT_Column, MRT_Header, MRT_TableInstance } from '../MaterialReactTable'

const Box = styled('div')`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: inherit;
`
type Props<TData> = {
	column: MRT_Column<TData>;
	header: MRT_Header<TData>;
	table: MRT_TableInstance<TData>;
}
export const HeaderBase = <T,>({ column }: Props<T>) => {
	return <Box style={{ minWidth: column.getSize() }} title={column.columnDef.header}>{column.columnDef.header}</Box>
}
