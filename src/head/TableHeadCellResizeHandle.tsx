import React, { FC, useCallback } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { Table_Header, TableInstance } from '..'
import { Colors, IconsColor } from '../components/styles'

interface Props {
	header: Table_Header
	table: TableInstance
}

export const TableHeadCellResizeHandle: FC<Props> = ({ header, table }) => {
	const {
		getState,
		options: { columnResizeMode },
	} = table
	const { column } = header

	const handleResize = useCallback(
		(e: React.UIEvent) => {
			e.stopPropagation() // for DragScrollingContainer to not mess things up
			header.getResizeHandler()(e)
		},
		[header]
	)

	return (
		<Box
			onClick={(e) => e.stopPropagation()}
			onDoubleClick={() => column.resetSize()}
			onMouseDown={handleResize}
			onTouchStart={handleResize}
			sx={(theme) => ({
				cursor: 'col-resize',
				mr: '-11px',
				position: 'absolute',
				right: '1px',
				top: 0,
				bottom: 0,
				px: '11px',
				opacity: column.getIsResizing() ? 1 : 0,
				transition: 'opacity 0s',
				'&:active > hr': {
					backgroundColor: theme.palette.info.main,
					opacity: 1,
				},
				'&:hover': {
					opacity: 1,
					transition: 'opacity 0.2s',
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
					borderWidth: '1px',
					height: '100%',
					touchAction: 'none',
					transition: column.getIsResizing()
						? undefined
						: 'all 150ms ease-in-out',
					userSelect: 'none',
					zIndex: 4,
					borderColor: column.getIsResizing()
						? Colors.LightBlue
						: IconsColor.active,
				}}
			/>
		</Box>
	)
}
