import { Box, Portal } from '@mui/material'
import React from 'react'

import { useTableContext } from '../context/useTableContext'

import { Colors } from './styles'

export const HoveredRowLine = () => {
	const { table } = useTableContext()
	const { hoveredRow } = table.getState()

	if (!hoveredRow) return null

	const {
		top = 0,
		width,
		left,
		height = 0,
	} = hoveredRow?.rowRef.current?.getBoundingClientRect() ?? {}

	return (
		<Portal>
			<Box
				sx={{
					position: 'absolute',
					top: top + height,
					width,
					left,
					height: '1px',
					backgroundColor: Colors.LightBlue,
				}}
			/>
		</Portal>
	)
}
