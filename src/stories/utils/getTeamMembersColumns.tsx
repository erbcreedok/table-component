import { Avatar } from '@mui/material'
import { TableCellProps } from '@mui/material/TableCell'
import React from 'react'
import { GroupedCellBase } from '../../body/GroupedCellBase'
import { RowActionMenuButton } from '../../index'
import { Flex } from '../../components/Flex'
import { TextEllipsis } from '../../components/TextEllipsis'
import { HeaderBase } from '../../head/HeaderBase'
import {
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_Row,
	TableInstance,
} from '../../TableComponent'
import { AnalyticsIcon } from '../../TableToolbar/components/icons/AnalyticsIcon'
import { getNestedProp } from '../../utils/getNestedProp'
import { TeamMember } from '../types/TeamMember'
import { Colors } from './constants'
import { createGetColors } from './createGetColors'
import { isTeamMember } from './getTeamMembers'
import { getTeamsBorderColorSet } from './getTeamsBorderColorSet'
import { getTeamsCellBackgroundSet } from './getTeamsCellBackgroundSet'
import { HeaderSearch } from '../../head/HeaderSearch'
import { sortByArrayOrder } from './sortByArrayOrder'

const getBorderColors = createGetColors(getTeamsBorderColorSet(), {
	fallback: Colors.lightestGrey,
})
const getBackgroundColors = createGetColors(getTeamsCellBackgroundSet())

const ColoredGroupedCell: typeof GroupedCellBase = (props) => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return (
		<GroupedCellBase
			borderColor={getBorderColors(columnId, value)}
			{...props}
		/>
	)
}

const coloredCellProps = <TData extends Record<string, any> = {}>(props: {
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

export const teamMemberAccessorFn = (accessorKey: string) => (item: TeamMember) => {
	if (isTeamMember(item)) {
		return getNestedProp(item, accessorKey)
	}
	return ''
}
export const getTeamMembersColumns = () =>
	[
		{
			header: 'Team member',
			accessorFn: teamMemberAccessorFn('member.fullName'),
			displayDataKey: 'member.fullName',
			filterVariant: 'multi-select',
			id: 'teamMember',
			Cell: ({ row, table }) => {
				const user = row.original.member
				return (
					<Flex
						center="y"
						gap="0.75rem"
						style={{ minWidth: '100%', padding: '0 0.575rem' }}
						title={user.fullName}
					>
						<Avatar
							sx={{ width: 24, height: 24 }}
							src={user.avatarUrl}
							alt={user.fullName}
						/>
						<Flex column style={{ overflow: 'hidden' }}>
							<TextEllipsis style={{ fontSize: '0.875rem' }}>
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
			enableGrouping: false,
			enableHiding: false,
			minSize: 250,
			Header: ({ column, header, table }) => (
				<HeaderSearch
					column={column}
					header={header}
					table={table}
					searchPath="member.fullName"
					placeHolder="Search for employee"
				/>
			),
		},
		{
			header: 'Impact on the project',
			id: 'impact',
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
			accessorFn: teamMemberAccessorFn('performance'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			headerEndAdornment: <AnalyticsIcon />,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			sortingFn(rowA, rowB) {
				return sortByArrayOrder(['Often exceeds', 'Sometimes exceeds', 'Meets'])(rowA.getValue('performance'),  rowB.getValue('performance'))
			},
		},
		{
			header: 'Risk of leaving',
			id: 'riskOfLeaving',
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
			accessorFn: teamMemberAccessorFn('location'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
		},
	] as Array<Table_ColumnDef<TeamMember>>
