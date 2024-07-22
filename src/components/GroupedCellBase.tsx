import { Box, styled } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'

import { getColumnId } from '../column.utils'
import { SelectCheckbox } from '../inputs/SelectCheckbox'
import {
	Table_Cell,
	Table_Column,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'
import { getIsGroupCollapsedDefault } from '../utils/getIsGroupCollapsed'
import { getShouldForwardProps } from '../utils/getShouldForwardProps'
import { onGroupCollapsedToggleDefault } from '../utils/onGroupCollapsedToggle'

import {
	Colors,
	groupDividerBorder,
	groupDividerHoveredBorder,
	TextColor,
} from './styles'
import { Tooltip } from './Tooltip'

const padding = '1rem'

const Wrapper = styled(
	Box,
	getShouldForwardProps('borderColor', 'innerTable')
)<{
	borderColor?: string
	innerTable?: boolean
}>`
	box-sizing: border-box;
	position: absolute;
	top: 1rem;
	bottom: 1rem;
	left: 0.75rem;
	right: 0.75rem;
	margin: -1rem -0.75rem;
	padding: ${padding} 0.75rem;
	border-left: ${({ borderColor, innerTable }) =>
		innerTable ? 'none' : `2px solid ${borderColor ?? '#E1E3EB'}`};
	border-top: ${({ innerTable }) =>
		innerTable ? '1px solid #E1E3EB' : 'none'};
	font-weight: bold;
	overflow: clip;
	text-overflow: ellipsis;
	line-clamp: 2;
`

type Props<TData extends TableData = {}> = PropsWithChildren<{
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
	borderColor?: string
}>
export const GroupedCellBase = <TData extends TableData = {}>({
	cell,
	row,
	column,
	table,
	borderColor,
	children,
}: Props<TData>) => {
	const [isLandscape, setIsLandscape] = useState(true)
	const [isShort, setIsShort] = useState(false)
	const [isTooShort, setIsTooShort] = useState(false)

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
			innerTable,
			getGroupRowCount,
			icons: { ExpandIcon, CollapseIcon },
			onGroupCollapsedToggle,
			getIsGroupCollapsed,
			enableGroupCount,
			enableGroupCollapsing,
			enableGroupSelection,
		},
		getState,
	} = table
	const columnId = getColumnId(column)
	const {
		grouping,
		hoveredRow,
		isLoading,
		showSkeletons,
		stickyHeadersHeight,
	} = getState()
	const isLastGroupedColumn =
		grouping.length > 0 && grouping[grouping.length - 1] === columnId
	const groupId = row.groupIds ? row.groupIds[columnId] : undefined
	const expanded = groupId
		? (getIsGroupCollapsed ?? getIsGroupCollapsedDefault)({
				table,
				row,
				cell,
				column,
				groupId,
		  })
		: true
	const groupRow = groupId ? row.groupRows?.[groupId] : undefined
	const columnSize = column.getSize()

	const isHovered = useMemo(() => {
		if (!groupRow?.subRows || !hoveredRow?.row) return false

		return groupRow.subRows.includes(hoveredRow.row)
	}, [groupRow, hoveredRow?.row])

	const toggleExpand = useCallback(() => {
		if (!groupId) return
		const toggle = onGroupCollapsedToggle ?? onGroupCollapsedToggleDefault
		toggle({
			cell,
			row,
			column,
			table,
			collapsed: expanded,
			groupId,
		})
	}, [cell, column, expanded, groupId, onGroupCollapsedToggle, row, table])

	const skeletonWidth = useMemo(() => {
		return Math.round(
			Math.random() * (columnSize - columnSize / 3) + columnSize / 3
		)
	}, [columnSize])

	return (
		<Tooltip
			arrow
			placement="top"
			title={isShort ? cell.getValue() ?? 'N/A' : undefined}
		>
			<Wrapper
				ref={ref}
				borderColor={borderColor}
				innerTable={innerTable}
				sx={{
					backgroundColor: isHovered ? Colors.LightestBlue : Colors.Gray10,
					borderRight: isLastGroupedColumn
						? isHovered
							? groupDividerHoveredBorder
							: groupDividerBorder
						: undefined,
				}}
			>
				{isLoading || showSkeletons ? (
					<Skeleton
						animation="wave"
						sx={{ transform: 'none' }}
						{...(isLandscape
							? { width: skeletonWidth, height: 20 }
							: { height: skeletonWidth, width: 20 })}
					/>
				) : (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							height: 'fit-content',
							maxHeight: '100%',
							flexDirection: !isShort && isLandscape ? 'row' : 'column',
							gap: isShort ? '2px' : '8px',
							mt: isShort ? '-0.25rem' : 0,
							position: 'sticky',
							top: `calc(${padding} + ${stickyHeadersHeight}px)`,
						}}
					>
						{enableGroupCollapsing && (
							<IconButton
								disabled={(groupRow?.subRows?.length ?? 0) <= 1}
								sx={{ p: 0, order: 1 }}
								onClick={toggleExpand}
							>
								{expanded ? <CollapseIcon /> : <ExpandIcon />}
							</IconButton>
						)}
						{enableGroupSelection && enableRowSelection && groupId && (
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
								{children}
							</Box>
						)}
						{!isTooShort && enableGroupCount && (
							<Typography
								sx={{
									color: TextColor.Disabled,
									fontSize: 12,
									order: 4,
									ml: isLandscape ? 'auto' : 0,
									mt: isLandscape ? 0 : '8px',
								}}
							>
								{getGroupRowCount?.({ groupId, groupRow, table }) ??
									groupRow?.subRows?.length}
							</Typography>
						)}
					</Box>
				)}
			</Wrapper>
		</Tooltip>
	)
}
