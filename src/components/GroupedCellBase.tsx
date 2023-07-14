import { styled, Box } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useResizeDetector } from 'react-resize-detector'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'

import { SelectCheckbox } from '../inputs/SelectCheckbox'
import { getColumnId } from '../column.utils'
import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableInstance,
} from '../TableComponent'
import { getShouldForwardProps } from '../utils/getShouldForwardProps'

import {
	Colors,
	groupDividerBorder,
	groupDividerHoveredBorder,
	Text,
} from './styles'
import { Tooltip } from './Tooltip'

const Wrapper = styled(Box, getShouldForwardProps('borderColor'))<{
	borderColor?: string
}>`
	box-sizing: border-box;
	position: absolute;
	top: 1rem;
	bottom: 1rem;
	left: 0.75rem;
	right: 0.75rem;
	margin: -1rem -0.75rem;
	padding: 1rem 0.75rem;
	border-left: 2px solid ${({ borderColor }) => borderColor ?? '#E1E3EB'};
	font-weight: bold;
	overflow: hidden;
	text-overflow: ellipsis;
	line-clamp: 2;
`

type Props<TData extends object> = {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
	borderColor?: string
}
export const GroupedCellBase = <TData extends object>({
	cell,
	row,
	column,
	table,
	borderColor,
}: Props<TData>) => {
	const [isLandscape, setIsLandscape] = useState(true)
	const [isShort, setIsShort] = useState(false)
	const [isTooShort, setIsTooShort] = useState(false)
	const content =
		(column.columnDef.Cell
			? column.columnDef.Cell({ cell, column, row, table })
			: (cell.getValue() as ReactNode)) || 'N/A'
	const { ref } = useResizeDetector({
		onResize: useCallback((width, height) => {
			setIsLandscape(width > 100 || height < width)
			setIsShort(height < 100 && width < 60)
			setIsTooShort(height < 60 && width < 60)
		}, []),
	})
	const {
		options: {
			enableRowSelection,
			icons: { ExpandIcon, CollapseIcon },
		},
		setGroupCollapsed,
	} = table
	const columnId = getColumnId(column.columnDef)
	const { grouping, groupCollapsed, hoveredRow } = table.getState()
	const isLastGroupedColumn =
		grouping.length > 0 && grouping[grouping.length - 1] === columnId
	const groupId = row.groupIds ? row.groupIds[columnId] : undefined
	const expanded = groupId ? !groupCollapsed[groupId] : true
	const groupRow = groupId ? row.groupRows?.[groupId] : undefined

	const isHovered = useMemo(() => {
		if (!groupRow?.subRows || !hoveredRow?.row) return false

		return groupRow.subRows.includes(hoveredRow.row)
	}, [groupRow, hoveredRow?.row])

	const toggleExpand = useCallback(() => {
		if (!groupId) return
		setGroupCollapsed((prev) => {
			return {
				...prev,
				[groupId]: !prev[groupId],
			}
		})
	}, [groupId, setGroupCollapsed])

	return (
		<Tooltip
			arrow
			placement="top"
			title={isShort ? cell.getValue() ?? 'N/A' : undefined}
		>
			<Wrapper
				ref={ref}
				borderColor={borderColor}
				sx={{
					backgroundColor: isHovered ? Colors.LightestBlue : Colors.Gray10,
					borderRight: isLastGroupedColumn
						? isHovered
							? groupDividerHoveredBorder
							: groupDividerBorder
						: undefined,
				}}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						height: 'fit-content',
						maxHeight: '100%',
						flexDirection: !isShort && isLandscape ? 'row' : 'column',
						gap: isShort ? '2px' : '8px',
						mt: isShort ? '-0.25rem' : 0,
					}}
				>
					<IconButton
						disabled={(groupRow?.subRows?.length ?? 0) <= 1}
						sx={{ p: 0, order: 1 }}
						onClick={toggleExpand}
					>
						{expanded ? <CollapseIcon /> : <ExpandIcon />}
					</IconButton>
					{enableRowSelection && groupId && (
						<SelectCheckbox
							table={table}
							parentRow={row.groupRows?.[groupId]}
							sx={{ order: !isShort && isLandscape ? 2 : 0 }}
						/>
					)}
					{!isTooShort && (
						<Box
							sx={{
								order: 3,
								writingMode: isLandscape ? 'none' : 'vertical-rl',
								transform: !isLandscape ? 'rotate(-180deg)' : '',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								minHeight: !isLandscape ? '24px' : 0,
								lineClamp: 2,
							}}
						>
							{content}
						</Box>
					)}
					{!isTooShort && (
						<Typography
							sx={{
								color: Text.Disabled,
								fontSize: 12,
								order: 4,
								ml: isLandscape ? 'auto' : 0,
								mt: isLandscape ? 0 : '8px',
							}}
						>
							{groupRow?.subRows?.length}
						</Typography>
					)}
				</Box>
			</Wrapper>
		</Tooltip>
	)
}
