import { Meta, Story } from '@storybook/react'
import React from 'react'
import MaterialReactTable from '../../index'
import { MaterialReactTableProps } from '../../MaterialReactTable'
import { getSeparatedTeamMembers } from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { sortByArrayOrder } from '../utils/sortByArrayOrder'

const meta: Meta = {
	title: 'Data Examples/Teams',
};

export default meta;


const groupsSorting = {
	impact: sortByArrayOrder(['Critical', 'High', 'Medium', 'Low']),
	performance: sortByArrayOrder(['Often exceeds', 'Sometimes exceeds', 'Meets']),
	riskOfLeaving: sortByArrayOrder(['Leaver', 'High', 'Medium', 'Low']),
}

const data = getSeparatedTeamMembers()
const columns = getTeamMembersColumns()

export const TeamsTableDefault: Story<MaterialReactTableProps> = () => (
	<MaterialReactTable
		columns={columns}
		data={data}
		enableAggregationRow={false}
		enableTopToolbar={false}
		enableGrouping
		enableColumnResizing
		enableColumnDragging={false}
		enablePagination={false}
		groupsSorting={groupsSorting}
		groupBorder={{ left: '12px solid white', top: '20px solid white' }}
		initialState={{ grouping: ['impact', 'performance'], columnSizing: { impact: 1, performance: 1 }}}
		uppercaseHeader
	/>
);
