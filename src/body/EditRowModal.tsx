import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Stack from '@mui/material/Stack'

import { EditActionButtons } from '../buttons/EditActionButtons'
import { EditCellField } from '../inputs/EditCellField'
import type { Table_Row, TableInstance } from '..'

interface Props<TData extends Record<string, any> = {}> {
	open: boolean
	row: Table_Row<TData>
	table: TableInstance<TData>
}

export const EditRowModal = <TData extends Record<string, any> = {}>({
	open,
	row,
	table,
}: Props<TData>) => {
	const {
		options: { localization },
	} = table

	return (
		<Dialog open={open}>
			<DialogTitle textAlign="center">{localization.edit}</DialogTitle>
			<DialogContent>
				<form onSubmit={(e) => e.preventDefault()}>
					<Stack
						sx={{
							gap: '1.5rem',
							minWidth: { xs: '300px', sm: '360px', md: '400px' },
							pt: '1rem',
							width: '100%',
						}}
					>
						{row
							.getAllCells()
							.filter((cell) => cell.column.columnDef.columnDefType === 'data')
							.map((cell) => (
								<EditCellField
									cell={cell as any}
									key={cell.id}
									showLabel
									table={table as any}
								/>
							))}
					</Stack>
				</form>
			</DialogContent>
			<DialogActions sx={{ p: '1.25rem' }}>
				<EditActionButtons row={row} table={table} variant="text" />
			</DialogActions>
		</Dialog>
	)
}
