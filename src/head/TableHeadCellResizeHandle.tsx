import React, { FC } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { Table_Header, TableInstance } from '..'

interface Props {
	header: Table_Header
	table: TableInstance
}

export const TableHeadCellResizeHandle: FC<Props> = ({ header, table }) => {
	const {
		getState,
		options: { columnResizeMode },
	} = table
	const { showColumnFilters } = getState()
	const { column } = header
	const { columnDef } = column
	const { columnDefType } = columnDef

	return (
		<Box
			onClick={(e) => e.stopPropagation()}
			onDoubleClick={() => column.resetSize()}
			onMouseDown={header.getResizeHandler()}
			onTouchStart={header.getResizeHandler()}
			sx={(theme) => ({
				cursor: 'col-resize',
				mr: '-1rem',
				position: 'absolute',
				right: '1px',
				px: '4px',
				opacity: column.getIsResizing() ? 1 : 0,
				'&:active > hr': {
					backgroundColor: theme.palette.info.main,
					opacity: 1,
				},
				'td:hover &, th:hover &, &:hover': {
					opacity: 1,
				},
			})}
			style={{
				transform:
					column.getIsResizing() && columnResizeMode === 'onEnd'
						? `translateX(${getState().columnSizingInfo.deltaOffset ?? 0}px)`
						: undefined,
			}}
		>
			<Divider
				flexItem
				orientation="vertical"
				sx={{
					borderRadius: '2px',
					borderWidth: '2px',
					height:
						showColumnFilters && columnDefType === 'data' ? '3.5rem' : '1.5rem',
					touchAction: 'none',
					transition: column.getIsResizing()
						? undefined
						: 'all 150ms ease-in-out',
					userSelect: 'none',
					zIndex: 4,
				}}
			/>
		</Box>
	)
}
