import React from 'react'
import Box from '@mui/material/Box'
import { IconButton, SxProps } from '@mui/material'

import {
	getSortingIcon,
	getSortingText,
} from '../../../../utils/getSortingInfo'
import { getPascalCase } from '../../../../utils/getPascalCase'
import { withNativeEvent } from '../../../../utils/withNativeEvent'
import { useTableContext } from '../../../../context/useTableContext'
import { Table_Column } from '../../../../TableComponent'
import { Colors, TextColor } from '../../../../components/styles'
import { ConditionalBox } from '../../../../components/ConditionalBox'

interface Props<TData extends Record<string, any> = {}> {
	column: Table_Column<TData>
	sx?: SxProps | undefined
	hideUnselected?: boolean
	groupButtons?: boolean
	isInChip?: boolean
}
export const SortingButtons = <TData extends Record<string, any> = {}>(
	props: Props<TData>
) => {
	const { table } = useTableContext()
	const { column, hideUnselected } = props
	const sorting = column?.getIsSorted()
	const ascSortingText = getSortingText({
		table,
		sortingFn: column.getSortingFn(),
		isAsc: true,
		withSortWord: false,
	})
	const descSortingText = getSortingText({
		table,
		sortingFn: column.getSortingFn(),
		isAsc: false,
		withSortWord: false,
	})

	return (
		<Box
			sx={{
				height: 24,
				display: 'flex',
				alignItems: 'center',
				boxSizing: 'border-box',
				'& button': {
					fontSize: '14px',
					color: TextColor.Primary,
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
					onClick={withNativeEvent(
						{
							el: `${
								props.isInChip ? 'SortingChip' : 'SortingSidebar'
							}_${getPascalCase(column.columnDef.header)}_${getPascalCase(
								ascSortingText
							)}`,
							type: 'click',
						},
						table
					)(() => column.toggleSorting(false, true))}
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
					onClick={withNativeEvent(
						{
							el: `${
								props.isInChip ? 'SortingChip' : 'SortingSidebar'
							}_${getPascalCase(column.columnDef.header)}_${getPascalCase(
								descSortingText
							)}`,
							type: 'click',
						},
						table
					)(() => column.toggleSorting(true, true))}
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
