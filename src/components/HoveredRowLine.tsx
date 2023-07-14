import { Box, Portal } from '@mui/material'
import React from 'react'

import { useTableContext } from '../context/useTableContext'

import { Colors } from './styles'

export const HoveredRowLine = () => {
	const {
		table: {
			getState,
			refs: { tableHeadCellRefs },
		},
	} = useTableContext()
	const { hoveredRow, grouping } = getState()

	const getGroupedColOffset = () => {
		if (!grouping.length) return 0
		const lastGroupingColumn = grouping[grouping.length - 1]
		const lastColumnEl = tableHeadCellRefs.current[lastGroupingColumn]
		if (!lastColumnEl) return 0
		const { left, width } = lastColumnEl.getBoundingClientRect()

		return left + width
	}

	if (!hoveredRow) return null

	const groupedColumnsOffset = getGroupedColOffset()

	const {
		top = 0,
		width = 0,
		left = 0,
		height = 0,
	} = hoveredRow?.rowRef.current?.getBoundingClientRect() ?? {}

	return (
		<Portal>
			<Box
				sx={{
					position: 'absolute',
					top: top + height,
					width: width - groupedColumnsOffset,
					left: groupedColumnsOffset || left,
					height: '1px',
					backgroundColor: Colors.LightBlue,
				}}
			/>
		</Portal>
	)
}
