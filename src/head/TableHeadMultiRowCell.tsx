import React, { FC, useRef, useMemo } from 'react'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'

import type { MultirowColumn, TableInstance } from '..'
import { arrayHasAll } from '../utils/arrayHasAll'

import { TableHeadMultiRowCellActions } from './TableHeadMultiRowCellActions'
import { TableHeadMultiRowCellCollapsable } from './TableHeadMultiRowCellCollapsable'

type Props = {
	cell: MultirowColumn
	cellStyles: Record<string, any>
	table: TableInstance
	multirowColumnsDisplayDepth: number
	canCollapse: boolean
	isCollapsed: boolean
	showCollapse: boolean
	onCollapse: (
		data: { id: string; colIds: string[]; originalColIds: string[] },
		depth: number
	) => void
	collapsedMultirow: {
		id: string
		colIds: string[]
		originalColIds: string[]
	}[]
}

export const TableHeadMultiRowCell: FC<Props> = ({
	cell,
	cellStyles,
	table,
	multirowColumnsDisplayDepth,
	canCollapse,
	isCollapsed,
	showCollapse,
	onCollapse,
	collapsedMultirow,
}) => {
	const localRef = useRef<HTMLTableCellElement>(null)
	const { getState } = table
	const { grouping } = getState()

	const calculatedColSpan = useMemo(() => {
		if (isCollapsed) {
			return 1
		}

		if (collapsedMultirow.length) {
			const collapsedChildren = collapsedMultirow.reduce((acc, curr) => {
				if (arrayHasAll(cell.colIds, curr.colIds)) {
					acc.push(curr)
				}

				return acc
			}, [] as { id: string; colIds: string[] }[])
			const nonCollapsedColumns = cell.colIds.filter((id) => {
				return !collapsedChildren.some((ch) => ch.colIds.includes(id))
			})

			return collapsedChildren.length + nonCollapsedColumns.length
		}

		return cell.colSpan
	}, [
		isCollapsed,
		collapsedMultirow.length,
		collapsedMultirow,
		cell,
		table,
		grouping,
	])

	return (
		<TableHeadMultiRowCellActions
			key={cell.id}
			anchorElRef={localRef}
			table={table}
			actions={cell.multirowColumnActions}
			cell={cell}
			multirowColumnsDisplayDepth={multirowColumnsDisplayDepth}
		>
			{({ onClick }) => (
				<TableCell
					onClick={onClick}
					ref={localRef}
					sx={{
						...cellStyles,
						...(cell.isPinned
							? {
									position: 'sticky',
									left: cell.leftPinnedPosition,
									right: cell.rightPinnedPosition,
									zIndex: 3,
							  }
							: {}),
						cursor:
							cell.multirowColumnActions &&
							multirowColumnsDisplayDepth === cell.depth
								? 'pointer'
								: undefined,
					}}
					colSpan={calculatedColSpan}
				>
					{showCollapse ? (
						<TableHeadMultiRowCellCollapsable
							canCollapse={canCollapse}
							table={table}
							cell={cell}
							onCollapse={onCollapse}
							isCollapsed={isCollapsed}
						/>
					) : (
						cell.renderText?.() || (
							<Typography
								sx={{
									fontSize: '12px',
									fontWeight: '600',
									lineHeight: '18px',
									letterSpacing: '0.01em',
									textAlign: 'center',
								}}
							>
								{cell.text}
							</Typography>
						)
					)}
				</TableCell>
			)}
		</TableHeadMultiRowCellActions>
	)
}
