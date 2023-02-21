import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { GroupedCellBase } from '../../body/GroupedCellBase'
import { HeaderBase } from '../../head/HeaderBase'
import MaterialReactTable from '../../index'
import { MaterialReactTableProps, MRT_ColumnDef } from '../../MaterialReactTable'

const meta: Meta = {
	title: 'Data Examples/Teams',
};

export default meta;

const getRandomFromArray = <T,>(array: T[]) => array[Math.floor(Math.random() * array.length)];

const users = [...Array(200)].map(() => ({
	id: faker.datatype.uuid(),
	fullName: faker.name.fullName(),
	avatarUrl: faker.image.avatar(),
	role: faker.name.jobTitle(),
}));
const impacts = ['Critical', 'High', 'Medium', 'Low', null];
const performances = ['Often exceeds', 'Sometimes exceeds', 'Meets', undefined];
const risksOfLeaving = ['Leaver', 'High', 'Medium', 'Low', undefined];
const successionStatuses = ['No successors', 'Successors identified', 'Successors in place', null];

type TeamMember = {
	id: string;
	member: {
		id: string;
		fullName: string;
		avatarUrl: string;
		role: string;
	};
	impact: string | null;
	performance: string | null;
	riskOfLeaving: string | null;
	successionStatus: string | null;
	location: string;
}
const data: TeamMember[] = users.map((user) => ({
	id: faker.datatype.uuid(),
	member: user,
	impact: getRandomFromArray(impacts),
	performance: getRandomFromArray(performances),
	riskOfLeaving: getRandomFromArray(risksOfLeaving),
	successionStatus: getRandomFromArray(successionStatuses),
	location: faker.address.city(),
}));

const colors = [
	'#B32424',
	'#FA4B4B',
	'#F67E00',
	'#7833FF',
	'#009ECC',
	'#6DBE72',
]
const colorNA = '#E1E3EB'

const colorsSet: Record<string, Record<string, string>> = {
	impact: {
		'Critical': colors[3],
		'High': colors[1],
		'Medium': colors[2],
		'Low': colors[5],
		'N/A': colorNA,
	},
	performance: {
		'Often exceeds': colors[3],
		'Sometimes exceeds': colors[4],
		'Meets': colors[5],
	},
	riskOfLeaving: {
		'Leaver': colors[0],
		'High': colors[1],
		'Medium': colors[2],
		'Low': colors[5],
		'N/A': colorNA,
	}
}

const getKey = (value: unknown) => {
	if (typeof value === 'string') return value

	return `${value}`
}
const getColors = (columnId: string, value: unknown) => {
	const key = getKey(value)
	if (colorsSet[columnId]) {
		if (colorsSet[columnId][key]) {
			return colorsSet[columnId][key]
		}
		const color = getRandomFromArray(colors)
		colorsSet[columnId][key] = color
		return color
	}
	colorsSet[columnId] = {}
	const color = getRandomFromArray(colors)
	colorsSet[columnId][key] = color
	return color
}

const ColoredGroupedCell: typeof GroupedCellBase = (props) => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return <GroupedCellBase borderColor={getColors(columnId, value)} {...props} />
}

const columns = [
	{
		header: 'Team member',
		accessorKey: 'member.id',
		Cell: ({ row }) => {
			const user = row.original.member
			return user.fullName
		},
		GroupedCell: ColoredGroupedCell,
	},
	{
		header: 'Impact on the project',
		accessorKey: 'impact',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
	},
	{
		header: 'Performance',
		accessorKey: 'performance',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
	},
	{
		header: 'Risk of leaving',
		accessorKey: 'riskOfLeaving',
		GroupedCell: ColoredGroupedCell,
		Header: HeaderBase,
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
] as MRT_ColumnDef<TeamMember>[];

const groupsSorting = {
	impact: (a: string, b: string) => {
		const order = ['Critical', 'High', 'Medium', 'Low'];
		return order.indexOf(a) - order.indexOf(b);
	},
	performance: (a: string, b: string) => {
		const order = ['Often exceeds', 'Sometimes exceeds', 'Meets'];
		return order.indexOf(a) - order.indexOf(b);
	},
	riskOfLeaving: (a: string, b: string) => {
		const order = ['Leaver', 'High', 'Medium', 'Low'];
		return order.indexOf(a) - order.indexOf(b);
	}
}

export const TeamsTableDefault: Story<MaterialReactTableProps> = () => (
	<MaterialReactTable
		columns={columns}
		data={data}
		enableAggregationRow={false}
		enableTopToolbar={false}
		enableGrouping
		enableColumnDragging={false}
		enablePagination={false}
		groupsSorting={groupsSorting}
		groupBorder={{ left: '12px solid white', top: '20px solid white' }}
		initialState={{ grouping: ['impact', 'performance'] }}
		uppercaseHeader
	/>
);
