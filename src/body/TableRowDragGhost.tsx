import { BoxProps, Portal } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { forwardRef, ReactNode, RefObject, useMemo } from 'react'

import { Colors, IconsColor, Text } from '../components/styles'
import {
	DraggingMessage,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'
import { getColorAlpha } from '../utils/getColorAlpha'

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
				<td
					key={index}
					style={{
						paddingLeft: '5px',
						color: IconsColor.disabled,
					}}
				>
					{icon}
				</td>
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
			<td key="drag-counter">
				<Typography
					sx={{
						m: 'auto 18px',
						p: '6px 18px 6px 12px',
						background: Colors.Gray10,
						borderRadius: 100,
						color: Text.Primary,
					}}
				>
					{draggingRows.length} items dragging...
				</Typography>
			</td>
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
			icons: { RowDragIcon },
			validateHoveredRow,
		},
		getState,
	} = table
	const { draggingRows, hoveredRow, sorting } = getState()

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

		return validateHoveredRow(hoveredRow as Table_Row<TData>, table)
	}, [hoveredRow, table])

	const draggingMessage = useMemo<DraggingMessage | null>(() => {
		if (hoveredRowValidation !== false && hoveredRowValidation !== true) {
			return hoveredRowValidation
		}

		return null
	}, [hoveredRow, table])

	return (
		<Portal>
			<Box
				sx={{
					visibility: 'hidden',
					position: 'fixed',
					pointerEvents: 'none',
					zIndex: '9999',
					transform: 'translate(-20px, -10px)',
					cursor: 'grabbing',
				}}
				ref={ref}
			>
				{isDragging && (
					<>
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
						</Box>
					</>
				)}
			</Box>
		</Portal>
	)
}

export const TableRowDragGhost = forwardRef(TableRowDragGhostRoot)
