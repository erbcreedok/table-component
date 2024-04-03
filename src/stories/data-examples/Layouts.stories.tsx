import { styled } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, {
	TableComponentProps,
	TableConsumer,
	TableMain,
	TableProvider,
	TableStatusBar,
	TableToolbar,
} from '../../'
import { TeamMember } from '../types/TeamMember'
import { Colors, DEFAULT_TEAMS_PRESETS } from '../utils/constants'
import { getTablePresetProps } from '../utils/getTablePresetProps'
import { getSeparatedTeamMembers } from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { WidgetLayout } from './components/WidgetLayout'

const meta: Meta = {
	title: 'Data Examples/Layouts',
}

export default meta

const _data = getSeparatedTeamMembers()
const _columns = getTeamMembersColumns()

const Wrapper = styled('div')`
	display: flex;
	flex-direction: column;
	background: ${Colors.bg};
	border-radius: 10px;
	padding: 10px;
	margin: 10px;
	&:empty {
		display: none;
	}
`
const ToolbarWrapper = styled('div')`
	font-family: sans-serif;
	align-items: center;
	display: flex;
	padding: 10px;
	margin-bottom: 20px;
`

export const TableWithDetachedToolbar: Story<TableComponentProps> = ({
	columns,
	data,
	...args
}) => (
	<TableProvider
		columns={columns ?? _columns}
		data={data ?? _data}
		enableTopToolbar={false}
		enableStatusBar={false}
		enableGrouping
		enableColumnResizing
		enableColumnDragging={false}
		enablePagination={false}
		enableMultiSort
		enableMultiRemove
		groupBorder={{
			left: `12px solid ${Colors.bg}`,
			top: `20px solid ${Colors.bg}`,
		}}
		uppercaseHeader
		muiTablePaperProps={{ sx: { boxShadow: 'none' } }}
		initialState={{
			grouping: ['impact'],
			columnSizing: { impact: 44 },
			columnVisibility: {
				location: false,
			},
			sorting: [{ id: 'teamMember', desc: false }],
		}}
		{...getTablePresetProps('tablePresetsCustom', DEFAULT_TEAMS_PRESETS)}
		{...args}
	>
		<TableConsumer>
			{({ table }) => (
				<>
					<ToolbarWrapper>
						<TableToolbar table={table} sx={{ justifyContent: 'flex-end' }} />
					</ToolbarWrapper>
					<Wrapper>
						<TableStatusBar
							table={table}
							lineProps={{ sx: { backgroundColor: Colors.white } }}
						/>
					</Wrapper>
				</>
			)}
		</TableConsumer>
		<Wrapper>
			<TableMain />
		</Wrapper>
	</TableProvider>
)

export const WidgetLayoutTable: Story<TableComponentProps<TeamMember>> = ({
	columns = _columns,
	data = _data,
}) => {
	return (
		<WidgetLayout>
			<TableComponent
				enableBottomToolbar={false}
				columns={columns}
				data={data}
				enableGrouping
				enablePinning
				enableColumnResizing
				enableColumnOrdering
				enableColumnDragging={true}
				enablePagination={false}
				enableMultiSort
				enableMultiRemove
				enableStickyHeader
				enableStickyScrollbars={{
					horizontal: true,
				}}
				muiTablePaperProps={{ sx: { mx: 2 } }}
				muiTableContainerProps={{ sx: { maxHeight: undefined } }}
				{...getTablePresetProps('tablePresetsCustom', DEFAULT_TEAMS_PRESETS)}
			/>
		</WidgetLayout>
	)
}
