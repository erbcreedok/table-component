import { capitalize, styled, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import { FC } from 'react'

import type { Table_Column, TableInstance } from '..'
import { SelectedChevron } from '..'
import { getPascalCase } from '../utils/getPascalCase'
import { getShouldForwardProps } from '../utils/getShouldForwardProps'
import { getTestAttributes } from '../utils/getTestAttributes'
import { withNativeEvent } from '../utils/withNativeEvent'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

type Props = {
	column: Table_Column
	table: TableInstance
	setVisible: (visible: boolean) => void
	direction?: 'left' | 'right'
}

const IconBox = styled(Box, getShouldForwardProps('rotate'))<{
	rotate?: boolean
}>`
	height: 18px;
	${({ rotate }) => (rotate ? `transform: rotate(-180deg);` : '')}
	color: inherit;
`
export const QuickColumnPinningMenuItemOptions: FC<Props> = ({
	column,
	table,
	setVisible,
	direction = 'left',
}) => {
	const {
		options: {
			e2eLabels,
			icons: { FreezeToLeftIcon },
			localization,
		},
	} = table
	const { columnPinning } = table.getState()
	const isPinned = column.getIsPinned() === direction
	const isMultipleColumnsPinned = (columnPinning[direction] ?? []).length > 1

	const handleFreezeColumn = () => {
		table.setColumnPinning(({ left, right }) => ({
			left: left?.filter((id) => id !== column.id),
			right: right?.filter((id) => id !== column.id),
			[direction]: [column.id],
		}))
		setVisible(false)
	}

	const handleFreezeUpToThisColumn = () => {
		const { collapsedMultirow } = table.getState()
		const sortedColumns = table
			.getVisibleLeafColumns()
			.map((col) => col.id)
			.filter(
				(id) => !collapsedMultirow.some((group) => group.colIds.includes(id))
			)
		const index = sortedColumns.indexOf(column.id)
		if (index < 0) {
			setVisible(false)

			return
		}
		let newColumnPinning: string[] = []
		if (direction === 'left') {
			newColumnPinning = sortedColumns.slice(0, index + 1)
		} else {
			newColumnPinning = sortedColumns.slice(index)
		}
		table.setColumnPinning(({ left, right }) => ({
			left: left?.filter((id) => id !== column.id),
			right: right?.filter((id) => id !== column.id),
			[direction]: newColumnPinning,
		}))
		setVisible(false)
	}

	return (
		<>
			<Typography
				sx={{
					fontWeight: '600',
					p: '9px 12px 3px',
					fontSize: 12,
					lineHeight: '18px',
					mt: direction === 'right' ? '3px' : 0,
				}}
			>
				{direction === 'left'
					? localization.freezeToLeft
					: localization.freezeToRight}
			</Typography>
			<MenuItem
				key={1}
				onClick={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_FreezeThisColumnTo${capitalize(direction)}`,
						type: 'click',
					},
					table
				)(handleFreezeColumn)}
				sx={commonMenuItemStyles}
				{...getTestAttributes(
					e2eLabels,
					direction === 'left'
						? 'columnMenuItemFreezeColumnLeft'
						: 'columnMenuItemFreezeColumnRight'
				)}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>
						<IconBox rotate={direction === 'right'}>
							<FreezeToLeftIcon />
						</IconBox>
					</ListItemIcon>
					{localization.freezeThisColumn}
					{isPinned && !isMultipleColumnsPinned && (
						<SelectedChevron table={table} />
					)}
				</Box>
			</MenuItem>

			<MenuItem
				key={2}
				divider
				onClick={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_FreezeUpToThisColumnTo${capitalize(direction)}`,
						type: 'click',
					},
					table
				)(handleFreezeUpToThisColumn)}
				sx={commonMenuItemStyles}
				{...getTestAttributes(
					e2eLabels,
					direction === 'left'
						? 'columnMenuItemFreezeUpToThisColumnLeft'
						: 'columnMenuItemFreezeUpToThisColumnRight'
				)}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>
						<IconBox rotate={direction === 'right'}>
							<FreezeToLeftIcon />
						</IconBox>
					</ListItemIcon>
					{localization.freezeUpToThisColumn}
					{isPinned && isMultipleColumnsPinned && (
						<SelectedChevron table={table} />
					)}
				</Box>
			</MenuItem>
		</>
	)
}
