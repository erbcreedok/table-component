import React from 'react'
import Box from '@mui/material/Box'
import { IconButton, SxProps } from '@mui/material'

import { Table_Column } from '../../../../TableComponent'
import { AscIcon } from '../../../../icons/AscIcon'
import { DescIcon } from '../../../../icons/DescIcon'
import { Colors, Text } from '../../../../components/styles'

interface Props<TData extends Record<string, any> = {}> {
	column: Table_Column<TData>
	sx?: SxProps | undefined
}
export const SortingButtons = <TData extends Record<string, any> = {}>(
	props: Props<TData>
) => {
	const { column } = props
	const sorting = column?.getIsSorted()

	return (
		<Box
			sx={{
				height: 24,
				display: 'flex',
				alignItems: 'center',
				boxSizing: 'border-box',
				'& button': {
					fontSize: '14px',
					color: Text.Primary,
					borderRadius: '4px',
				},
				'& button:hover': {
					backgroundColor: Colors.Lightgray,
				},
				'& button:active': {
					backgroundColor: Colors.gray,
				},
				...props.sx,
			}}
		>
			<IconButton
				onClick={() => column.toggleSorting(false, true)}
				disableRipple
				sx={{
					backgroundColor: sorting === 'asc' ? Colors.gray : 'initial',
					marginRight: '4px',
				}}
				size="small"
			>
				<AscIcon />
			</IconButton>
			<IconButton
				onClick={() => column.toggleSorting(true, true)}
				disableRipple
				sx={{
					backgroundColor: sorting === 'desc' ? Colors.gray : 'initial',
				}}
				size="small"
			>
				<DescIcon />
			</IconButton>
		</Box>
	)
}
