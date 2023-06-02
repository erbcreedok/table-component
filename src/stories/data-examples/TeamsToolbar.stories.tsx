import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { TableComponentProps, TableMain, TableProvider, TableStatusBar, TableToolbar, useTableContext } from '../../'
import { Colors, DEFAULT_TEAMS_PRESETS } from '../utils/constants'
import { getTablePresetProps } from '../utils/getTablePresetProps'
import { getSeparatedTeamMembers } from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { sortByArrayOrder } from '../utils/sortByArrayOrder'

const meta: Meta = {
	title: 'Data Examples/Table Toolbar',
}

export default meta

const data = getSeparatedTeamMembers()
const columns = getTeamMembersColumns()

const groupsSorting = {
	impact: sortByArrayOrder(['Critical', 'High', 'Medium', 'Low']),
	performance: sortByArrayOrder([
		'Often exceeds',
		'Sometimes exceeds',
		'Meets',
	]),
	riskOfLeaving: sortByArrayOrder(['Leaver', 'High', 'Medium', 'Low']),
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	background: ${Colors.bg};
	border-radius: 10px;
	padding: 10px;
	gap: 12px;
`
const ToolbarWrapper = styled.div`
	font-family: sans-serif;
	align-items: center;
	display: flex;
	padding: 10px;
	margin-bottom: 20px;
	${TableToolbar.Wrapper} {
		justify-content: flex-end;
	}
`

const TableExample = () => {
	const { table } = useTableContext()

	return (
		<>
			<ToolbarWrapper>
				<TableToolbar table={table} />
			</ToolbarWrapper>
			<Wrapper>
				<TableStatusBar table={table} lineProps={{ sx: { backgroundColor: Colors.white } }} />
				<TableMain />
			</Wrapper>
		</>
	)
}

export const TeamsToolbar: Story<TableComponentProps> = () => (
	<TableProvider
		columns={columns}
		data={data}
		enableAggregationRow={false}
		enableTopToolbar={false}
		enableStatusBar={false}
		enableGrouping
		enableColumnResizing
		enableColumnDragging={false}
		enablePagination={false}
		enableMultiSort
		enableMultiRemove
		groupBorder={{ left: `12px solid ${Colors.bg}`, top: `20px solid ${Colors.bg}` }}
		uppercaseHeader
		groupsSorting={groupsSorting}
		muiTablePaperProps={{ sx: { boxShadow: 'none' } }}
		initialState={{
			grouping: ['impact'],
			columnSizing: { impact: 1, performance: 1 },
			columnVisibility: {
				location: false,
			},
			sorting: [{ id: 'teamMember', desc: false }],
		}}
		{...getTablePresetProps('tablePresetsCustom', DEFAULT_TEAMS_PRESETS)}
	>
		<TableExample />
	</TableProvider>
)
