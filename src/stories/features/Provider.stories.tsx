import { styled } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import { TableProvider } from '../../context/TableProvider'
import { useTableContext } from '../../context/useTableContext'
import { TableMain } from '../../table/TableMain'
import { TableComponentProps } from '../../TableComponent'
import { TableToolbar } from '../../TableToolbar'
import { getSeparatedTeamMembers } from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'

const meta: Meta = {
	title: 'Features/Provider Example',
}

export default meta;


const data = getSeparatedTeamMembers()
const columns = getTeamMembersColumns()

const Wrapper = styled('div')`
	display: flex;
	flex-direction: column;
	background: #f5f5f5;
	border-radius: 10px;
	padding: 10px;
`
const ToolbarWrapper = styled('div')`
	font-family: sans-serif;
	align-items: center;
	display: flex;
	background: #f5f5f5;
	border-radius: 10px;
	padding: 10px;
	margin-bottom: 20px;
`

const TableExample = () => {
	const { table } = useTableContext()

	return (
		<>
			<ToolbarWrapper>
				<div>HEADER</div>
				<div style={{ flexGrow: 1 }} />
				<TableToolbar table={table} />
			</ToolbarWrapper>
			<Wrapper>
				<TableMain />
			</Wrapper>
		</>
	)
}

export const TableProviderDefault: Story<TableComponentProps> = () => (
	<TableProvider
		columns={columns}
		data={data}
		enableAggregationRow={false}
		enableTopToolbar={false}
		enableGrouping
		enableColumnResizing
		enableColumnDragging={false}
		enablePagination={false}
		groupBorder={{ left: '12px solid white', top: '20px solid white' }}
		uppercaseHeader
	>
		<TableExample />
	</TableProvider>
);
