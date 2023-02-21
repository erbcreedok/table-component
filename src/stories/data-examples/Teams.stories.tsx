import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React from 'react'
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
const impacts = ['Critical', 'High', 'Medium', 'Low', 'N/A'];
const performances = ['Often exceeds', 'Sometimes exceeds', 'Meets', 'N/A'];
const risksOfLeaving = ['Leaver', 'High', 'Medium', 'Low', 'N/A'];
const successionStatuses = ['No successors', 'Successors identified', 'Successors in place', 'N/A'];

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

const columns = [
	{
		header: 'Team member',
		accessorKey: 'member',
		enableGrouping: false,
		Cell: ({ cell }) => {
			const user = cell.getValue() as TeamMember['member']
			return user.fullName
		},
	},
	{
		header: 'Impact on the project',
		accessorKey: 'impact',
		GroupedCell: ({cell}) => cell.getValue(),
	},
	{
		header: 'Performance',
		accessorKey: 'performance',
	},
	{
		header: 'Risk of leaving',
		accessorKey: 'riskOfLeaving',
	},
	{
		header: 'Succession status',
		accessorKey: 'successionStatus',
	},
	{
		header: 'Location',
		accessorKey: 'location',
	}
] as MRT_ColumnDef<TeamMember>[];

const groupsSorting = {
	impact: (a: string, b: string) => {
		const order = ['Critical', 'High', 'Medium', 'Low', 'N/A'];
		return order.indexOf(a) - order.indexOf(b);
	},
	performance: (a: string, b: string) => {
		const order = ['Often exceeds', 'Sometimes exceeds', 'Meets', 'N/A'];
		return order.indexOf(a) - order.indexOf(b);
	},
	riskOfLeaving: (a: string, b: string) => {
		const order = ['Leaver', 'High', 'Medium', 'Low', 'N/A'];
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
		initialState={{ grouping: ['impact'] }}
	/>
);
