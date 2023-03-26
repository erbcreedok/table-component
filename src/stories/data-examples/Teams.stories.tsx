import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import TableComponent, { Table_Row } from '../../index'
import { TableComponentProps } from '../../TableComponent'
import { TeamMember } from '../types/TeamMember'
import { getExpandingTeamMembers, getSeparatedTeamMembers, getTeamMembers } from '../utils/getTeamMembers'
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
const dataTree = getExpandingTeamMembers(10)
const columns = getTeamMembersColumns()

export const TeamsTableDefault: Story<TableComponentProps> = () => (
	<TableComponent
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
		// initialState={{ grouping: ['impact', 'performance'], columnSizing: { impact: 1 }}}
		uppercaseHeader
	/>
);

export const TeamsTableSubtree: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={dataTree}
		enableAggregationRow={false}
		enableTopToolbar={false}
		enableGrouping
		enableColumnResizing
		enableColumnDragging={false}
		enablePagination={false}
		enableExpanding
		groupsSorting={groupsSorting}
		groupBorder={{ left: '12px solid white', top: '20px solid white' }}
		// initialState={{ grouping: ['impact', 'performance'], columnSizing: { impact: 1 }}}
		uppercaseHeader
	/>
);

export const TeamsTableRowOrdering: Story<TableComponentProps> = () => {
	const [data, setData] = useState(() => getTeamMembers(100));
	const [draggingRow, setDraggingRow] = useState<Table_Row<TeamMember> | null>(null);
	const [hoveredRow, setHoveredRow] = useState<Table_Row<TeamMember> | null>(null);

	return (
		<TableComponent
			columns={columns}
			data={data}
			enableAggregationRow={false}
			enableTopToolbar={false}
			enableGrouping
			enableColumnResizing
			enableColumnDragging={false}
			enablePagination={false}
			enableRowOrdering
			groupsSorting={groupsSorting}
			groupBorder={{ left: '12px solid white', top: '20px solid white' }}
			uppercaseHeader
			autoResetPageIndex={false}
			enableSorting={false}
			muiTableBodyRowDragHandleProps={{
				onDragEnd: () => {
					if (hoveredRow && draggingRow) {
						data.splice(
							hoveredRow.index,
							0,
							data.splice(draggingRow.index, 1)[0],
						);
						setData([...data]);
					}
				},
			}}
			onDraggingRowChange={setDraggingRow}
			onHoveredRowChange={setHoveredRow}
			state={{
				draggingRow,
				hoveredRow,
			}}
		/>
	);
}
