import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import type { Table_Column, TableData, TableInstance } from '..'

interface Props<TData = TableData> {
	column: Table_Column<TData>
	table: TableInstance<TData>
}

export const ColumnPinningButtons = <TData,>({
	column,
	table,
}: Props<TData>) => {
	const {
		options: {
			icons: { PushPinIcon },
			localization,
		},
	} = table

	const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
		column.pin(pinDirection)
	}

	return (
		<Box sx={{ minWidth: '70px', textAlign: 'center' }}>
			{column.getIsPinned() ? (
				<Tooltip arrow title={localization.unpin}>
					<IconButton onClick={() => handlePinColumn(false)} size="small">
						<PushPinIcon />
					</IconButton>
				</Tooltip>
			) : (
				<>
					<Tooltip arrow title={localization.pinToLeft}>
						<IconButton onClick={() => handlePinColumn('left')} size="small">
							<PushPinIcon
								style={{
									transform: 'rotate(90deg)',
								}}
							/>
						</IconButton>
					</Tooltip>
					<Tooltip arrow title={localization.pinToRight}>
						<IconButton onClick={() => handlePinColumn('right')} size="small">
							<PushPinIcon
								style={{
									transform: 'rotate(-90deg)',
								}}
							/>
						</IconButton>
					</Tooltip>
				</>
			)}
		</Box>
	)
}
