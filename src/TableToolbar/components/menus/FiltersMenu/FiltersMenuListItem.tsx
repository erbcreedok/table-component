import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import MenuItem, { MenuItemProps } from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import type { Table_Column } from '../../../..'
import { getE2EAttributes } from '../../../../utils/getE2EAttributes'
import { mergeSx } from '../../../../utils/mergeSx'

type Props<TData extends Record<string, any> = {}> = {
	column: Table_Column<TData>
	onAddFilter(column: Table_Column<TData>): void
} & MenuItemProps

export const FiltersMenuListItem = <TData extends Record<string, any> = {}>({
	column,
	onAddFilter,
	...rest
}: Props<TData>) => {
	const { columnDef } = column

	const menuItemRef = useRef<HTMLElement>(null)

	return (
		<>
			<MenuItem
				ref={menuItemRef as any}
				{...rest}
				sx={mergeSx(
					(theme) => ({
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
					}),
					rest.sx
				)}
				onClick={(e) => {
					onAddFilter(column)
					rest.onClick?.(e)
				}}
				{...getE2EAttributes(
					'filtersMenuListItem',
					`filtersMenuListItem_${column.id}`
				)}
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
						{...getE2EAttributes(
							'filtersMenuAddItem',
							`filtersMenuAddItem_${column.id}`
						)}
					>
						Add Item +
					</Typography>
				</Box>
			</MenuItem>
		</>
	)
}
