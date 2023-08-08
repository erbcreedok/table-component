import { Avatar, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import { TableCellProps } from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import React from 'react'
import { GroupedCellBase } from '../../components/GroupedCellBase'
import {
	HeaderBase,
	HeaderSearch,
	HeaderSearchOptionProps,
	RowActionMenuButton,
} from '../../index'
import { Flex } from '../../components/Flex'
import { TextEllipsis } from '../../components/TextEllipsis'
import {
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_Row,
	TableInstance,
} from '../../TableComponent'
import { AnalyticsIcon } from '../../icons/AnalyticsIcon'
import { getNestedProp } from '../../utils/getNestedProp'
import { TeamMember } from '../types/TeamMember'
import { Colors } from './constants'
import { convertDate } from './convertDate'
import { createGetColors } from './createGetColors'
import { anyOfDateRange } from './customFilterFns'
import { isTeamMember } from './getTeamMembers'
import { getTeamsBorderColorSet } from './getTeamsBorderColorSet'
import { getTeamsCellBackgroundSet } from './getTeamsCellBackgroundSet'
import { sortByArrayOrder } from './sortByArrayOrder'

const getBorderColors = createGetColors(getTeamsBorderColorSet(), {
	fallback: Colors.lightestGrey,
})
const getBackgroundColors = createGetColors(getTeamsCellBackgroundSet())

export const ColoredGroupedCell: typeof GroupedCellBase = (props) => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return (
		<GroupedCellBase
			borderColor={getBorderColors(columnId, value)}
			{...props}
		/>
	)
}

export const coloredCellProps = <TData extends Record<string, any> = {}>(props: {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
}): TableCellProps => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return {
		sx: { backgroundColor: getBackgroundColors(columnId, value) },
	}
}

export const teamMemberAccessorFn =
	(accessorKey: string) => (item: TeamMember) => {
		if (isTeamMember(item)) {
			return getNestedProp(item, accessorKey)
		}
		return ''
	}
const SearchOption = ({
	item,
	onClick,
}: HeaderSearchOptionProps<TeamMember>) => (
	<Box
		onClick={onClick}
		sx={{
			display: 'flex',
			alignItems: 'center',
			p: '9px 12px',
			gap: '12px',
			'&:hover': { background: Colors.bg },
		}}
	>
		<Avatar
			sx={{ width: 24, height: 24 }}
			src={item.member.avatarUrl}
			alt={item.member.fullName}
		/>
		<Typography>
			<TextEllipsis style={{ fontSize: '14px' }} title={item.member.fullName}>
				{item.member.fullName}
			</TextEllipsis>
		</Typography>
	</Box>
)
export const getTeamMembersColumns = () => {
	return [
		{
			header: 'Team member',
			accessorFn: teamMemberAccessorFn('member.fullName'),
			displayDataKey: 'member.fullName',
			id: 'teamMember',
			dataType: 'textual',
			filterVariant: 'text',
			Cell: ({ row, table }) => {
				const user = row.original.member
				return (
					<Flex
						center="y"
						gap="0.75rem"
						style={{ minWidth: '100%', padding: '0 0.575rem' }}
					>
						<Avatar
							sx={{ width: 36, height: 36 }}
							src={user.avatarUrl}
							alt={user.fullName}
						/>
						<Flex column style={{ overflow: 'hidden' }}>
							<TextEllipsis
								style={{ fontSize: '0.875rem' }}
								title={user.fullName}
							>
								{user.fullName}
							</TextEllipsis>
							<TextEllipsis
								style={{
									color: '#6C6F80',
									fontSize: '0.75rem',
									fontWeight: '400',
								}}
							>
								{user.role}
							</TextEllipsis>
						</Flex>
						<RowActionMenuButton table={table} row={row} sx={{ ml: 'auto' }} />
					</Flex>
				)
			},
			GroupedCell: ColoredGroupedCell,
			enableColumnOrdering: false,
			enableDividerRight: true,
			enableGrouping: false,
			enableHiding: false,
			minSize: 250,
			Header: ({ column, header, table }) => (
				<HeaderSearch
					column={column}
					header={header}
					table={table}
					searchPath="member.fullName"
					placeholder="Search for employee"
					renderOption={SearchOption}
				/>
			),
			FilterField: ({ onChange, value, autoFocus }) => (
				<Box sx={{ px: '12px', width: '100%', boxSizing: 'border-box' }}>
					<Typography>Custom Filter Field</Typography>
					<TextField
						fullWidth
						variant="outlined"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						autoFocus={autoFocus}
					/>
				</Box>
			),
			FilterChipField: ({ onChange, value }) => (
				<Box sx={{ px: '12px', width: '100%', boxSizing: 'border-box' }}>
					<Typography>Custom Filter Chip Field</Typography>
					<TextField
						size="small"
						fullWidth
						variant="outlined"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				</Box>
			),
		},
		{
			header: 'Impact on the project',
			id: 'impact',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('impact'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			enableSorting: false,
		},
		{
			header: 'Performance',
			id: 'performance',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('performance'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			headerEndAdornment: <AnalyticsIcon />,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			filterSelectOptions: [
				'Often exceeds',
				'Sometimes exceeds',
				'Meets',
				{ value: null, label: 'N/A' },
			],
			sortingFn(rowA, rowB) {
				return sortByArrayOrder([
					'Often exceeds',
					'Sometimes exceeds',
					'Meets',
				])(rowA.getValue('performance'), rowB.getValue('performance'))
			},
		},
		{
			header: 'Risk of leaving',
			id: 'riskOfLeaving',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('riskOfLeaving'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			sortDescFirst: false,
		},
		{
			header: 'Succession status',
			id: 'successionStatus',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('successionStatus'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
			enableGrouping: false,
		},
		{
			header: 'Location',
			id: 'location',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('location'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
		},
		{
			header: 'Hired At',
			id: 'hiredAt',
			accessorFn: teamMemberAccessorFn('hiredAt'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
			Cell: ({ cell }) => (
				<div onClick={() => console.log(cell.getValue())}>
					{convertDate(cell.getValue() as Date)}
				</div>
			),
			filterSelectOptions: [
				'Less than 1 months',
				'Between 1 and 3 months',
				'More than 3 months',
				'N/A',
			],
			filterFn: anyOfDateRange,
		},
	] as Array<Table_ColumnDef<TeamMember>>
}
