import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { MouseEvent, useState } from 'react'

import { RowActionMenu } from '../menus/RowActionMenu'
import { Table_Row, TableInstance } from '../TableComponent'

type Props<TData extends Record<string, any> = {}> = {
	table: TableInstance<TData>
	row: Table_Row<TData>
	sx?: IconButtonProps['sx']
}

const commonIconButtonStyles = {
	height: '2rem',
	ml: '10px',
	opacity: 0.5,
	transition: 'opacity 150ms',
	width: '2rem',
	'&:hover': {
		opacity: 1,
	},
}

export const RowActionMenuButton = <TData extends Record<string, any> = {}>({
	table,
	row,
	sx,
}: Props<TData>) => {
	const {
		options: {
			localization,
			icons: { MoreVertIcon },
			renderRowActionMenuItems,
		},
		setEditingRow,
	} = table
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setAnchorEl(event.currentTarget)
	}

	const handleStartEditMode = (event: MouseEvent) => {
		event.stopPropagation()
		setEditingRow({ ...row })
		setAnchorEl(null)
	}

	return renderRowActionMenuItems ? (
		<>
			<Tooltip
				arrow
				enterDelay={1000}
				enterNextDelay={1000}
				title={localization.rowActions}
			>
				<IconButton
					aria-label={localization.rowActions}
					onClick={handleOpenRowActionMenu}
					size="small"
					sx={{ ...commonIconButtonStyles, ...sx }}
				>
					<MoreVertIcon />
				</IconButton>
			</Tooltip>
			<RowActionMenu
				anchorEl={anchorEl}
				handleEdit={handleStartEditMode}
				row={row}
				setAnchorEl={setAnchorEl}
				table={table}
			/>
		</>
	) : null
}
