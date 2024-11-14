import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import type { Table_Row, TableData, TableInstance } from '..'

interface Props<TData = TableData> {
	row: Table_Row<TData>
	table: TableInstance<TData>
	variant?: 'icon' | 'text'
}

export const EditActionButtons = ({ row, table, variant = 'icon' }: Props) => {
	const {
		getState,
		options: {
			icons: { CancelIcon, SaveIcon },
			localization,
			onEditingRowSave,
			onEditingRowCancel,
		},
		refs: { editInputRefs },
		setEditingRow,
	} = table
	const { editingRow } = getState()

	const handleCancel = () => {
		onEditingRowCancel?.({ row, table })
		setEditingRow(null)
	}

	const handleSave = () => {
		// look for auto-filled input values
		Object.values(editInputRefs?.current)?.forEach((input) => {
			if (
				input.value !== undefined &&
				Object.hasOwn(editingRow?._valuesCache as object, input.name)
			) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				editingRow._valuesCache[input.name] = input.value
			}
		})
		onEditingRowSave?.({
			exitEditingMode: () => setEditingRow(null),
			row: editingRow ?? row,
			table,
			values: editingRow?._valuesCache ?? { ...row.original },
		})
	}

	return (
		<Box
			onClick={(e) => e.stopPropagation()}
			sx={{ display: 'flex', gap: '0.75rem' }}
		>
			{variant === 'icon' ? (
				<>
					<Tooltip arrow title={localization.cancel}>
						<IconButton aria-label={localization.cancel} onClick={handleCancel}>
							<CancelIcon />
						</IconButton>
					</Tooltip>
					<Tooltip arrow title={localization.save}>
						<IconButton
							aria-label={localization.save}
							color="info"
							onClick={handleSave}
						>
							<SaveIcon />
						</IconButton>
					</Tooltip>
				</>
			) : (
				<>
					<Button onClick={handleCancel}>{localization.cancel}</Button>
					<Button onClick={handleSave} variant="contained">
						{localization.save}
					</Button>
				</>
			)}
		</Box>
	)
}
