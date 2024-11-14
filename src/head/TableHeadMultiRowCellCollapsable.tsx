import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { FC } from 'react'

import type { MultirowColumn, TableInstance } from '..'
import { TextColor } from '../components/styles'

type Props = {
	cell: MultirowColumn
	table: TableInstance
	isCollapsed: boolean
	canCollapse: boolean
	onCollapse: (
		data: { id: string; colIds: string[]; originalColIds: string[] },
		depth: number
	) => void
}

export const TableHeadMultiRowCellCollapsable: FC<Props> = ({
	cell,
	table,
	isCollapsed,
	canCollapse,
	onCollapse,
}) => {
	const {
		options: {
			icons: { ExpandIcon, CollapseIcon },
		},
	} = table

	const handleExpandCollapse = (e) => {
		e.stopPropagation()
		onCollapse(
			{ id: cell.id, colIds: cell.colIds, originalColIds: cell.originalColIds },
			cell.depth
		)
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'row',
					cursor: 'pointer',
				}}
			>
				<IconButton
					sx={{
						cursor: 'pointer',
						p: 0,
					}}
					disabled={!canCollapse}
					onClick={(e) => handleExpandCollapse(e)}
				>
					{isCollapsed ? <ExpandIcon /> : <CollapseIcon />}
				</IconButton>
				<Typography
					sx={{
						fontSize: '12px',
						fontWeight: '600',
						lineHeight: '18px',
						letterSpacing: '0.01em',
						textAlign: 'left',
						ml: '6px',
					}}
				>
					{cell.text}
				</Typography>
			</Box>
			<Typography
				sx={{
					fontSize: '12px',
					fontWeight: '600',
					lineHeight: '18px',
					letterSpacing: '0.01em',
					color: TextColor.Disabled,
				}}
			>
				{cell.colIds.length}
			</Typography>
		</Box>
	)
}
