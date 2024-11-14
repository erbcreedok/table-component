import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React, { MouseEvent } from 'react'

import type { Table_Cell, Table_Row, TableData, TableInstance } from '..'
import { isEditingEnabled } from '../utils/isEditingEnabled'
import { isEditRowActionVisible } from '../utils/showRowActionsColumn'

import { RowActionMenuButton } from './RowActionMenuButton'

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

interface Props<TData = TableData> {
	cell: Table_Cell<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
}

export const ToggleRowActionMenuButton = <TData,>({
	cell,
	row,
	table,
}: Props<TData>) => {
	const {
		options: {
			enableEditing,
			editingMode,
			icons: { EditIcon },
			localization,
			renderRowActionMenuItems,
			renderRowActions,
		},
		setEditingRow,
	} = table

	const handleStartEditMode = (event: MouseEvent) => {
		event.stopPropagation()
		setEditingRow({ ...row })
	}

	return (
		<>
			{renderRowActions ? (
				<>{renderRowActions({ cell, row, table })}</>
			) : renderRowActionMenuItems ? (
				<RowActionMenuButton table={table} row={row} />
			) : isEditingEnabled(enableEditing, { table, row }) &&
			  isEditRowActionVisible(editingMode) ? (
				<Tooltip placement="right" arrow title={localization.edit}>
					<IconButton
						aria-label={localization.edit}
						sx={commonIconButtonStyles}
						onClick={handleStartEditMode}
					>
						<EditIcon />
					</IconButton>
				</Tooltip>
			) : null}
		</>
	)
}
