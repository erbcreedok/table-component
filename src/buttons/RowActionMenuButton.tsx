import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import React, { MouseEvent, useRef, useState } from 'react'

import { Colors, IconsColor, Tooltip } from '../components'
import { RowActionMenu } from '../menus/RowActionMenu'
import { Table_Row, TableData, TableInstance } from '../TableComponent'

type Props<TData = TableData> = {
	table: TableInstance<TData>
	row: Table_Row<TData>
	sx?: IconButtonProps['sx']
}

export const RowActionMenuButton = <TData,>({
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
	const anchorRef = useRef(null)
	const [open, setOpen] = useState(false)

	const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
		event.stopPropagation()
		event.preventDefault()
		setOpen(true)
	}

	const handleStartEditMode = (event: MouseEvent) => {
		event.stopPropagation()
		setEditingRow({ ...row })
		setOpen(false)
	}

	return renderRowActionMenuItems ? (
		<>
			<Tooltip
				arrow
				enterDelay={1000}
				enterNextDelay={1000}
				title={localization.rowActions}
				placement="top"
			>
				<IconButton
					disabled={table.constants.disableActionButtons}
					ref={anchorRef}
					aria-label={localization.rowActions}
					onClick={handleOpenRowActionMenu}
					size="small"
					sx={{
						height: '1.5rem',
						width: '1.5rem',
						borderRadius: '4px',
						color: IconsColor.default,
						backgroundColor: open ? Colors.Gray40 : undefined,
						...sx,
					}}
				>
					<MoreVertIcon sx={{ height: 18, width: 18 }} />
				</IconButton>
			</Tooltip>
			<RowActionMenu
				anchorEl={anchorRef.current}
				handleEdit={handleStartEditMode}
				open={open}
				row={row}
				setOpen={setOpen}
				table={table}
			/>
		</>
	) : null
}
