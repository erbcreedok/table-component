import React from 'react'
import Box from '@mui/material/Box'
import { IconButton, SxProps } from '@mui/material'

import { getSortingIcon } from '../../../../utils/getSortingInfo'
import { useTableContext } from '../../../../context/useTableContext'
import { Table_Column } from '../../../../TableComponent'
import { Colors, Text } from '../../../../components/styles'
import { ConditionalBox } from '../../../../components/ConditionalBox'

interface Props<TData extends Record<string, any> = {}> {
	column: Table_Column<TData>
	sx?: SxProps | undefined
	hideUnselected?: boolean
	groupButtons?: boolean
}
export const SortingButtons = <TData extends Record<string, any> = {}>(
	props: Props<TData>
) => {
	const { table } = useTableContext()
	const { column, hideUnselected } = props
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
					backgroundColor: Colors.Gray20,
				},
				'& button:active': {
					backgroundColor: Colors.Gray,
				},
				...props.sx,
			}}
		>
			<ConditionalBox
				condition={!hideUnselected && props.groupButtons}
				sx={{
					display: 'flex',
					border: `1px solid ${Colors.Gray40}`,
					borderRadius: '4px',
					p: '2px',
					mt: '-4px',
				}}
			>
				<IconButton
					onClick={() => column.toggleSorting(false, true)}
					disableRipple
					sx={{
						display: hideUnselected && sorting === 'desc' ? 'none' : 'flex',
						backgroundColor: hideUnselected
							? 'initial'
							: sorting === 'asc'
							? Colors.Gray
							: 'initial',
						marginRight: hideUnselected ? '0px' : '4px',
					}}
					size="small"
				>
					{getSortingIcon({
						table,
						sortingFn: column.getSortingFn(),
						isAsc: true,
						sortingIconProps: {
							sx: { width: 18, height: 18 },
						},
					})}
				</IconButton>
				<IconButton
					onClick={() => column.toggleSorting(true, true)}
					disableRipple
					sx={{
						display: hideUnselected && sorting === 'asc' ? 'none' : 'flex',
						backgroundColor: hideUnselected
							? 'initial'
							: sorting === 'desc'
							? Colors.Gray
							: 'initial',
					}}
					size="small"
				>
					{getSortingIcon({
						table,
						sortingFn: column.getSortingFn(),
						isAsc: false,
						sortingIconProps: {
							sx: { width: 18, height: 18 },
						},
					})}
				</IconButton>
			</ConditionalBox>
		</Box>
	)
}
