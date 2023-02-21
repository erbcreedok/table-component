import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Box as MuiBox } from '@mui/material'
import { useResizeDetector } from 'react-resize-detector'
import React, { ReactNode, useCallback, useState } from 'react'
import { MRT_Cell, MRT_Column, MRT_Row, MRT_TableInstance } from '../MaterialReactTable'
import { getShouldForwardProps } from '../utils/getShouldForwardProps'

const Box = styled(MuiBox, getShouldForwardProps('rotate', 'borderColor'))<{ rotate?: boolean; borderColor?: string }>`
	background-color: #FAFAFC;
	box-sizing: border-box;
  height: calc(100% + 2rem);
  width: calc(100% + 1.5rem);
	margin: -1rem -0.75rem;
	padding: 1rem 0.75rem;
	border-left: 2px solid ${({ borderColor }) => borderColor ?? '#E1E3EB'};
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: 2;
	${({ rotate, borderColor }) => rotate && css`
		writing-mode: vertical-rl;
		border-left: none;
    border-right: 2px solid ${borderColor ?? '#E1E3EB'};
		transform: rotate(180deg);
		text-align: right;
		vertical-align: top;
	`}
`

type Props<TData> = {
	cell: MRT_Cell<TData>;
	column: MRT_Column<TData>;
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
	borderColor?: string;
}
export const GroupedCellBase = <TData,>({ cell, row, column, table, borderColor }: Props<TData>) => {
	const [isLandscape, setIsLandscape] = useState(true)
	const content = (column.columnDef.Cell ? column.columnDef.Cell({ cell, column, row, table}) : cell.getValue() as ReactNode) || 'N/A'
	const { ref } = useResizeDetector({
		onResize: useCallback((width, height) => {
			setIsLandscape(width > 100 || height < width)
		}, [])
	})


	return (
		<Box ref={ref} rotate={!isLandscape} borderColor={borderColor}>
			{content}
		</Box>
	)
}
