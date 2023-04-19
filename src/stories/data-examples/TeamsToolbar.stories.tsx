import styled from '@emotion/styled'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { TableProvider } from '../../context/TableProvider'
import { useTableContext } from '../../context/useTableContext'
import { TableMain } from '../../table/TableMain'
import { TableComponentProps } from '../../TableComponent'
import { DEFAULT_PRESETS } from '../../TableToolbar/components/buttons/presetContants'
import { TableToolbar } from '../../TableToolbar/TableToolbar'
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
	background: #f5f5f5;
	border-radius: 10px;
	padding: 10px;
`
const ToolbarWrapper = styled.div`
	font-family: sans-serif;
	align-items: center;
	display: flex;
	padding: 10px;
	margin-bottom: 20px;
`

const TableExample = () => {
	const { table } = useTableContext()

	return (
		<>
			<ToolbarWrapper>
				<div style={{ flexGrow: 1 }} />
				<TableToolbar table={table} />
			</ToolbarWrapper>
			<Wrapper>
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
		enableGrouping
		enableColumnResizing
		enableColumnDragging={false}
		enablePagination={false}
		enableMultiSort
		enableMultiRemove
		groupBorder={{ left: '12px solid white', top: '20px solid white' }}
		uppercaseHeader
		groupsSorting={groupsSorting}
		initialState={{
			grouping: ['impact'],
			columnSizing: { impact: 1, performance: 1 },
			columnVisibility: {
				location: false,
			},
			sorting: [{ id: 'teamMember', desc: false }],
		}}
		onSavePresets={(presets) => {
			localStorage.setItem('tablePresetsCustom', JSON.stringify(presets))
		}}
		onGetPresets={() => {
			return JSON.parse(localStorage.getItem('tablePresetsCustom') as string)
		}}
		onGetDefaultPresets={() => DEFAULT_PRESETS}
	>
		<TableExample />
	</TableProvider>
)
