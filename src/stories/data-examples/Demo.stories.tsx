import { Meta, Story } from '@storybook/react'
import React from 'react'
import { Avatar } from '@mui/material';
import TableComponent from '../../index'
import { TableComponentProps, Table_ColumnDef, Table_Cell, } from '../../TableComponent'
import { GroupedCellBase } from '../../components/GroupedCellBase';
import { getSeparatedTeamMembers } from '../utils/getTeamMembers'
import { sortByArrayOrder } from '../utils/sortByArrayOrder'
import { TopToolbar } from './components/TopToolbar'
import Box from '@mui/material/Box'
import { Flex } from '../../components/Flex';
import { TextEllipsis } from '../../components/TextEllipsis';
import { HeaderBase } from '../../head/HeaderBase';
import { Colors } from '../utils/constants'
import { TeamMember } from '../types/TeamMember';
import { getTeamsBorderColorSet } from '../utils/getTeamsBorderColorSet'
import { createGetColors } from '../utils/createGetColors'


const meta: Meta = {
	title: 'Data Examples/DEMO',
};

export default meta;


const groupsSorting = {
	impact: sortByArrayOrder(['Critical', 'High', 'Medium', 'Low']),
	performance: sortByArrayOrder(['Often exceeds', 'Sometimes exceeds', 'Meets']),
	riskOfLeaving: sortByArrayOrder(['Leaver', 'High', 'Medium', 'Low']),
}

const data = getSeparatedTeamMembers(50)
// const columns = getTeamMembersColumns()

const getBorderColors = createGetColors(getTeamsBorderColorSet(), { fallback: Colors.lightestGrey })

const ColoredGroupedCell: typeof GroupedCellBase = (props) => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return <GroupedCellBase borderColor={getBorderColors(columnId, value)} {...props} />
}

const riskOfLeavingColor = (cell: Table_Cell<TeamMember>) => {
	if (cell.getValue<string>() == "Leaver") { return Colors.red1 }
	if (cell.getValue<string>() == "High") { return Colors.red2 }
	return undefined
}
const impactOnProjectColor = (cell: Table_Cell<TeamMember>) => {
	if (cell.getValue<string>() == "Critical") { return Colors.red1 }
	if (cell.getValue<string>() == "High") { return Colors.red2 }
	return undefined
}
const columns = [
	{
		header: 'Team member',
		accessorKey: 'member.id',
		Cell: ({ row, column }) => {
			const user = row.original.member;
			return (
				<Flex
					center="y"
					gap="0.75rem"
					style={{ minWidth: column.getSize(), padding: '0 0.575rem' }}
					title={user.fullName}
				>
					<Avatar
						sx={{ width: 36, height: 36 }}
						src={user.avatarUrl}
						alt={user.fullName}
					/>
					<Flex column style={{ overflow: 'hidden' }}>
						<TextEllipsis style={{ fontSize: '0.875rem' }}>
							{user.fullName}
						</TextEllipsis>
						<TextEllipsis
							style={{ color: '#6C6F80', fontSize: '0.75rem', fontWeight: '400' }}
						>
							{user.role}
						</TextEllipsis>
					</Flex>
				</Flex>
			);
		},
		// GroupedCell: GroupedCellBase,
		enableHiding: false,
		enableGrouping: false,
	},
	{
		header: 'Impact on the project',
		accessorKey: 'impact',
		// GroupedCell: GroupedCellBase,
		GroupedCell: ColoredGroupedCell,
		muiTableBodyCellProps: ({ cell }) => ({
			sx: { backgroundColor: impactOnProjectColor(cell), verticalAlign: 'middle', },
		}),
		Header: HeaderBase,
	},
	{
		header: 'Performance',
		accessorKey: 'performance',
		// GroupedCell: GroupedCellBase,
		GroupedCell: ColoredGroupedCell,
		Cell: ({ cell }) => (<span>{cell.getValue<string>()}</span>),
		// Header: HeaderBase,
		Header: ({ column }) => (<Box sx={{ display: 'flex' }}>
			<Box sx={{ flexGrow: 1 }}>{column.columnDef.header}</Box>
			<Box> <button onClick={() => alert('menu')}>📶</button></Box>
		</Box>),
	},
	{
		header: 'Risk of leaving',
		accessorKey: 'riskOfLeaving',
		// GroupedCell: GroupedCellBase,
		GroupedCell: ColoredGroupedCell,
		muiTableBodyCellProps: ({ cell }) => ({
			sx: { backgroundColor: riskOfLeavingColor(cell), verticalAlign: 'middle', },
		}),
		Header: HeaderBase,
	},
	{
		header: 'Succession status',
		accessorKey: 'successionStatus',
		// GroupedCell: GroupedCellBase,
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
	},
	{
		header: 'Location',
		accessorKey: 'location',
		// GroupedCell: GroupedCellBase,
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
	},
] as Table_ColumnDef<TeamMember>[];


export const TableDemo: Story<TableComponentProps> = () => {
	return (
		<>
			<TableComponent
				columns={columns}
				data={data}
				enableAggregationRow={false}
				enableTopToolbar={true}
				renderTopToolbar={TopToolbar}
				enableColumnFilters={false}
				enableGrouping
				enableColumnResizing
				enableColumnDragging={false}
				enablePagination={false}
				groupsSorting={groupsSorting}
				groupBorder={{ left: '12px solid white', top: '20px solid white', divider: '3px solid #E1E3EB' }}
				// initialState={{ grouping: ['impact', 'performance'], columnSizing: { impact: 1, performance: 1 } }}
				uppercaseHeader
				enableRowSelection
				isMultiSortEvent={() => true} //now no need to hold `shift` key to multi-sort
				maxMultiSortColCount={3} //prevent more than 3 columns from being sorted at once
				// enablePinning onSortingChange
				muiTableBodyCellProps={{
					sx: {
						verticalAlign: 'middle',
					},
				}}
				muiTableBodyRowProps={{
					sx: {
						height: '48px',
					},
				}}
			/>
		</>);
};
