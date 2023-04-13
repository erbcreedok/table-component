import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import type { Table_Column, TableInstance } from '../../../..'

interface Props<TData extends Record<string, any> = {}> {
	column: Table_Column<TData>
	table: TableInstance<TData>
	allColumns: Table_Column<TData>[]
	onAddFilter(column: Table_Column<TData>): void
}

export const FiltersMenuListItem = <TData extends Record<string, any> = {}>({
	column,
	table,
	allColumns,
	onAddFilter,
}: Props<TData>) => {
	const { columnDef } = column

	const menuItemRef = useRef<HTMLElement>(null)

	return (
		<>
			<MenuItem
				ref={menuItemRef as any}
				sx={(theme) => ({
					alignItems: 'center',
					justifyContent: 'flex-start',
					my: 0,
					mx: '9px',
					px: '16px',
					py: '6px',
					height: 48,
					borderRadius: '6px',
					'&:hover': {
						backgroundColor: theme.palette.grey[100],
					},
					'& .add-item': {
						visibility: 'hidden',
					},
					'&:hover .add-item': {
						visibility: 'visible',
					},
				})}
				onClick={() => onAddFilter(column)}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'nowrap',
						paddingLeft: '4px',
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
						minWidth: 300,
					}}
				>
					<Typography sx={{ alignSelf: 'center' }}>
						{columnDef.header}
					</Typography>
					<Typography
						className="add-item"
						sx={{ color: '#009ECC', fontWeight: 600 }}
					>
						Add Item +
					</Typography>
				</Box>
			</MenuItem>
		</>
	)
}
