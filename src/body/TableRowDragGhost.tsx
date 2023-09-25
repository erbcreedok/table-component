import { BoxProps, Portal } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { forwardRef, ReactNode, RefObject, useMemo } from 'react'

import { Colors, IconsColor, TextColor } from '../components/styles'
import { DraggingMessage, TableData, TableInstance } from '../TableComponent'
import { getColorAlpha } from '../utils/getColorAlpha'
import { getTargetGroupingKeysValues } from '../utils/getTargetGroupingKeysValues'

const renderCells = (
	cells: HTMLCollection | undefined,
	draggingRows,
	icon: ReactNode
) => {
	const isMulti = draggingRows.length > 1
	let firstRowRendered = false
	const renderedCells = Array.from(cells ?? []).map((child, index) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const { isGrouped, isUtil } = child.dataset
		if (isGrouped === 'true') {
			return null
		}
		const props: BoxProps = {
			className: child.className,
			sx: {
				borderTop: 'none',
				borderBottom: 'none',
				width: isUtil ? '10px' : undefined,
				borderRight: isMulti ? 'none' : undefined,
			},
			dangerouslySetInnerHTML: {
				__html: child.innerHTML,
			},
		}
		if (isUtil === 'true') {
			return (
				<div
					key={index}
					style={{
						display: 'table-cell',
						verticalAlign: 'inherit',
						paddingLeft: '5px',
						color: IconsColor.disabled,
					}}
				>
					{icon}
				</div>
			)
		}
		if (isMulti && firstRowRendered) {
			return null
		}
		firstRowRendered = true

		return <Box key={index} {...props} />
	})

	return [
		...renderedCells,
		isMulti && (
			<div
				key="drag-counter"
				style={{ display: 'table-cell', verticalAlign: 'inherit' }}
			>
				<Typography
					sx={{
						m: 'auto 18px',
						p: '6px 18px 6px 12px',
						background: Colors.Gray10,
						borderRadius: 100,
						color: TextColor.Primary,
					}}
				>
					{draggingRows.length} items dragging...
				</Typography>
			</div>
		),
	].filter(Boolean)
}

const Message = ({ text, type }: DraggingMessage) => {
	return (
		<Typography
			sx={{
				p: '9px 12px',
				borderRadius: '6px',
				border: `2px solid ${
					type === 'danger'
						? Colors.Red
						: type === 'warning'
						? Colors.Amber3
						: Colors.LightBlue
				}`,
				background:
					type === 'danger'
						? Colors.Red2
						: type === 'warning'
						? Colors.Amber2
						: Colors.LightestBlue,
				zIndex: 10,
				width: 'fit-content',
			}}
		>
			{text}
		</Typography>
	)
}

const GroupingChangeMessage = ({ newGroups, columnNames, icon }) => {
	return (
		<Box
			sx={{
				p: '9px 12px',
				borderRadius: '6px',
				border: `2px solid ${Colors.Amber3}`,
				background: Colors.Amber2,
				zIndex: 10,
				width: 'fit-content',
			}}
		>
			{Object.keys(newGroups).map((group) => (
				<Box
					key={group}
					sx={{
						display: 'flex',
						flexDirection: 'row',
						justifyContent: 'space-between',
						flexWrap: 'nowrap',
					}}
				>
					<Typography
						sx={{
							fontWeight: 400,
							fontSize: '14px',
							lineHeight: '18px',
							color: TextColor.Dark,
						}}
					>
						{columnNames[group]}
					</Typography>
					{icon}
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '14px',
							lineHeight: '18px',
							color: TextColor.Dark,
						}}
					>
						{newGroups[group] ?? 'N/A'}
					</Typography>
				</Box>
			))}
		</Box>
	)
}

type TableRowDragGhostProps<TData extends TableData> = {
	table: TableInstance<TData>
	rowRef: RefObject<HTMLTableRowElement>
	isDragging?: boolean
}
const TableRowDragGhostRoot = <TData extends TableData>(
	{ table, rowRef, isDragging }: TableRowDragGhostProps<TData>,
	ref
) => {
	const {
		options: {
			icons: { RowDragIcon, ArrowCircleRightIcon },
			validateHoveredRow,
		},
		getState,
		getAllColumns,
	} = table
	const { draggingRows, hoveredRow, sorting, grouping } = getState()

	const getShadowRowStyle = (index = 0) => ({
		opacity: 1,
		transform: `translate(0, ${6 * index}px) scale(${1 - index * 0.01})`,
		background: 'white',
		border: 'none',
		borderRadius: '6px',
		overflow: 'hidden',
		height: '48px',
		width: '100%',
		zIndex: 3 - index,
		filter: `drop-shadow(0 4px 22px ${getColorAlpha(Colors.Gray90, 0.15)})`,
	})

	const hoveredRowValidation = useMemo(() => {
		if (!hoveredRow) return false
		if (!validateHoveredRow) return true

		return validateHoveredRow(hoveredRow, table)
	}, [hoveredRow, table])

	const draggingMessage = useMemo<DraggingMessage | null>(() => {
		if (hoveredRowValidation !== false && hoveredRowValidation !== true) {
			return hoveredRowValidation
		}

		return null
	}, [hoveredRow, table])

	const newGroupingData = useMemo(() => {
		const draggingRowsNewGroups = getTargetGroupingKeysValues(
			hoveredRow?.row,
			grouping
		)
		if (draggingRowsNewGroups) {
			const newGroupings = Object.keys(draggingRowsNewGroups).reduce(
				(result, current) => {
					if (
						draggingRows.some(
							(row) => row.original[current] !== draggingRowsNewGroups[current]
						)
					) {
						result[current] = draggingRowsNewGroups[current]
					}

					return result
				},
				{}
			)

			return Object.keys(newGroupings).length ? newGroupings : null
		}

		return null
	}, [hoveredRow?.row, grouping, draggingRows])

	const columnNames = useMemo(() => {
		return getAllColumns().reduce((result, col) => {
			result[col.id] = col.columnDef.header

			return result
		}, {})
	}, [getAllColumns])

	if (!isDragging) return null

	return (
		<Portal>
			<Box
				sx={{
					position: 'fixed',
					pointerEvents: 'none',
					zIndex: '9999',
					transform: 'translate(-20px, -10px)',
					cursor: 'grabbing',
				}}
				ref={ref}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
					}}
				>
					<Box
						className={rowRef.current?.className}
						style={getShadowRowStyle()}
					>
						{renderCells(
							rowRef.current?.children,
							draggingRows,
							<RowDragIcon />
						)}
					</Box>
					{draggingRows.length > 1 && (
						<Box
							className={rowRef.current?.className}
							style={{ ...getShadowRowStyle(1), position: 'absolute' }}
						/>
					)}
					{draggingRows.length > 2 && (
						<Box
							className={rowRef.current?.className}
							style={{ ...getShadowRowStyle(2), position: 'absolute' }}
						/>
					)}
				</Box>
				<Box
					sx={{
						mt: `${draggingRows.length * 6 + 9}px`,
						display: 'flex',
						flexDirection: 'column',
						gap: '9px',
					}}
				>
					{sorting.length > 0 && hoveredRowValidation === true && (
						<Message
							text="Sorting will be reset automatically"
							type="warning"
						/>
					)}
					{draggingMessage && <Message {...draggingMessage} />}
					{newGroupingData && (
						<GroupingChangeMessage
							newGroups={newGroupingData}
							columnNames={columnNames}
							icon={
								<ArrowCircleRightIcon
									sx={{ mx: '14px', color: Colors.Amber4 }}
								/>
							}
						/>
					)}
				</Box>
			</Box>
		</Portal>
	)
}

export const TableRowDragGhost = forwardRef(TableRowDragGhostRoot)
