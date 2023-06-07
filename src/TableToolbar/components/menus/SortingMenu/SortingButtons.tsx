import React from 'react'
import Box from '@mui/material/Box'
import { IconButton, SxProps } from '@mui/material'

import { useTableContext } from '../../../../context/useTableContext'
import { Table_Column } from '../../../../TableComponent'
import { Colors, Text, IconsColor } from '../../../../components/styles'
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
	const {
		options: {
			icons: { AscIcon, DescIcon },
		},
	} = table
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
							? Colors.gray
							: 'initial',
						marginRight: hideUnselected ? '0px' : '4px',
					}}
					size="small"
				>
					<AscIcon
						htmlColor={IconsColor.default}
						sx={{ width: 18, height: 18 }}
					/>
				</IconButton>
				<IconButton
					onClick={() => column.toggleSorting(true, true)}
					disableRipple
					sx={{
						display: hideUnselected && sorting === 'asc' ? 'none' : 'flex',
						backgroundColor: hideUnselected
							? 'initial'
							: sorting === 'desc'
							? Colors.gray
							: 'initial',
					}}
					size="small"
				>
					<DescIcon
						htmlColor={IconsColor.default}
						sx={{ width: 18, height: 18 }}
					/>
				</IconButton>
			</ConditionalBox>
		</Box>
	)
}
