import { Box, Portal } from '@mui/material'
import React from 'react'

import { useTableContext } from '../context/useTableContext'

import { Colors } from './styles'

export const HoveredRowLine = () => {
	const {
		table: {
			constants: { expandableColumn },
			options: { enableExpanding },
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
		const { right } = lastColumnEl.getBoundingClientRect()

		return right
	}
	const getDepthOffset = () => {
		const expandColumnEl = expandableColumn?.id
			? tableHeadCellRefs.current[expandableColumn?.id]
			: undefined
		if (!expandColumnEl || !hoveredRow) return 0
		const { left } = expandColumnEl.getBoundingClientRect()

		return left + (hoveredRow.asChild ? hoveredRow.row.depth * 12 + 30 : 0)
	}

	if (!hoveredRow) return null

	const {
		top = 0,
		width = 0,
		left = 0,
		height = 0,
	} = hoveredRow?.rowRef.current?.getBoundingClientRect() ?? {}

	const offset = enableExpanding ? getDepthOffset() : getGroupedColOffset()

	return (
		<Portal>
			<Box
				sx={{
					position: 'absolute',
					top: top + height,
					width: width - offset,
					left: offset || left,
					height: '1px',
					backgroundColor: Colors.LightBlue,
				}}
			/>
		</Portal>
	)
}
