import React, { MouseEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { Table_Cell, Table_Row, TableInstance } from '..'

import { EditActionButtons } from './EditActionButtons'
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

interface Props<TData extends Record<string, any> = {}> {
	cell: Table_Cell<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
}

export const ToggleRowActionMenuButton = <
	TData extends Record<string, any> = {}
>({
	cell,
	row,
	table,
}: Props<TData>) => {
	const {
		getState,
		options: {
			editingMode,
			enableEditing,
			icons: { EditIcon },
			localization,
			renderRowActionMenuItems,
			renderRowActions,
		},
		setEditingRow,
	} = table

	const { editingRow } = getState()

	const handleStartEditMode = (event: MouseEvent) => {
		event.stopPropagation()
		setEditingRow({ ...row })
	}

	return (
		<>
			{renderRowActions ? (
				<>{renderRowActions({ cell, row, table })}</>
			) : row.id === editingRow?.id && editingMode === 'row' ? (
				<EditActionButtons row={row} table={table} />
			) : enableEditing ? (
				<Tooltip placement="right" arrow title={localization.edit}>
					<IconButton
						aria-label={localization.edit}
						sx={commonIconButtonStyles}
						onClick={handleStartEditMode}
					>
						<EditIcon />
					</IconButton>
				</Tooltip>
			) : renderRowActionMenuItems ? (
				<RowActionMenuButton table={table} row={row} />
			) : null}
		</>
	)
}
