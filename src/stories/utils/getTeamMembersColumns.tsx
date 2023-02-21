import { Avatar } from '@mui/material'
import { TableCellProps } from '@mui/material/TableCell'
import React from 'react'
import { GroupedCellBase } from '../../body/GroupedCellBase'
import { Flex } from '../../components/Flex'
import { TextEllipsis } from '../../components/TextEllipsis'
import { HeaderBase } from '../../head/HeaderBase'
import { MRT_Cell, MRT_Column, MRT_ColumnDef, MRT_Row, MRT_TableInstance } from '../../MaterialReactTable'
import { TeamMember } from '../types/TeamMember'
import { Colors } from './constants'
import { createGetColors } from './createGetColors'
import { getTeamsBorderColorSet } from './getTeamsBorderColorSet'
import { getTeamsCellBackgroundSet } from './getTeamsCellBackgroundSet'

const getBorderColors = createGetColors(getTeamsBorderColorSet(), { fallback: Colors.lightestGrey })
const getBackgroundColors = createGetColors(getTeamsCellBackgroundSet())

const ColoredGroupedCell: typeof GroupedCellBase = (props) => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return <GroupedCellBase borderColor={getBorderColors(columnId, value)} {...props} />
}

const coloredCellProps = <TData, >(props: {
	cell: MRT_Cell<TData>;
	column: MRT_Column<TData>;
	row: MRT_Row<TData>;
	table: MRT_TableInstance<TData>;
}): TableCellProps => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return {
		sx: { backgroundColor: getBackgroundColors(columnId, value) },
	}
}
export const getTeamMembersColumns = () => [
	{
		header: 'Team member',
		accessorKey: 'member.id',
		Cell: ({ row, column }) => {
			const user = row.original.member
			return (
				<Flex center="y" gap="0.75rem" style={{ minWidth: column.getSize(), padding: '0 0.575rem' }} title={user.fullName}>
					<Avatar sx={{ width: 24, height: 24 }} src={user.avatarUrl} alt={user.fullName} />
					<Flex column style={{ overflow: 'hidden' }}>
						<TextEllipsis style={{ fontSize: '0.875rem' }}>{user.fullName}</TextEllipsis>
						<TextEllipsis style={{ color: '#6C6F80', fontSize: '0.75rem', fontWeight: '400' }}>{user.role}</TextEllipsis>
					</Flex>
				</Flex>
			)
		},
		GroupedCell: ColoredGroupedCell,
	},
	{
		header: 'Impact on the project',
		accessorKey: 'impact',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
		muiTableBodyCellProps: coloredCellProps,
	},
	{
		header: 'Performance',
		accessorKey: 'performance',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
		muiTableBodyCellProps: coloredCellProps,
	},
	{
		header: 'Risk of leaving',
		accessorKey: 'riskOfLeaving',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
		muiTableBodyCellProps: coloredCellProps,
	},
	{
		header: 'Succession status',
		accessorKey: 'successionStatus',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
	},
	{
		header: 'Location',
		accessorKey: 'location',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
	}
] as MRT_ColumnDef<TeamMember>[]
