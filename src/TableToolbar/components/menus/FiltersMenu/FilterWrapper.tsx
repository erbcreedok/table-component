import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import React, { MouseEventHandler } from 'react'

import { DeleteIcon } from '../../../../icons/DeleteIcon'
import {
	Table_Column,
	TableData,
	TableInstance,
} from '../../../../TableComponent'
import { getFilterTypeLabel } from '../../../../utils/getFilterTypeLabel'

export type FilterWrapperProps<TData extends TableData> = BoxProps & {
	isFirst?: boolean
	column: Table_Column<TData>
	table: TableInstance<TData>
	onDelete: MouseEventHandler<HTMLButtonElement>
}
export const FilterWrapper = <TData extends Record<string, any>>({
	children,
	isFirst,
	column,
	onDelete,
	table,
	...props
}: FilterWrapperProps<TData>) => {
	const {
		options: { localization },
	} = table

	return (
		<Box
			{...props}
			sx={{
				display: 'flex',
				flexDirection: 'column',
				flexWrap: 'nowrap',
				paddingLeft: '4px',
				alignItems: 'center',
				width: '100%',
				minWidth: 300,
				boxSizing: 'border-box',
				'&:hover button': {
					visibility: 'visible',
				},
			}}
		>
			<Divider
				sx={{
					display: isFirst ? 'none' : 'flex',
					width: '100%',
					boxSizing: 'border-box',
					px: '24px',
					pt: '15px',
					color: '#6C6F80',
					fontSize: '14px',
					fontWeight: 600,
				}}
			>
				<Typography>{localization.and}</Typography>
			</Divider>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					width: '100%',
					boxSizing: 'border-box',
					px: '24px',
					mt: isFirst ? '18px' : '24px',
				}}
			>
				<Box
					sx={{
						display: 'flex',
						boxSizing: 'border-box',
					}}
				>
					<Typography
						sx={{
							color: '#303240',
							fontWeight: 600,
							fontSize: '14px',
						}}
					>
						{column.columnDef.header}
					</Typography>
					<Typography
						sx={{
							color: '#6C6F80',
							fontWeight: 600,
							fontSize: '14px',
							ml: '9px',
						}}
					>
						{getFilterTypeLabel(table, column)}
					</Typography>
				</Box>
				<IconButton
					sx={{ visibility: 'hidden' }}
					disableRipple
					onClick={onDelete}
					size="small"
				>
					<DeleteIcon />
				</IconButton>
			</Box>
			{children}
		</Box>
	)
}
