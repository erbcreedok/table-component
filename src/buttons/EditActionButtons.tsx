import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { Table_Row, TableInstance } from '..'

interface Props<TData extends Record<string, any> = {}> {
	row: Table_Row<TData>
	table: TableInstance<TData>
	variant?: 'icon' | 'text'
}

export const EditActionButtons = <TData extends Record<string, any> = {}>({
	row,
	table,
	variant = 'icon',
}: Props<TData>) => {
	const {
		getState,
		options: {
			icons: { CancelIcon, SaveIcon },
			localization,
			onEditingRowsSave,
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
		onEditingRowsSave?.({
			exitEditingMode: () => setEditingRow(null),
			rows: editingRow ?? row,
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
